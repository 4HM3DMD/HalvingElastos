/**
 * Elastos Blockchain Service
 * Instant response with in-memory cache, background refresh, and retry logic
 */

import fs from 'fs';
import path from 'path';

// ==========================================
// LOGGER (Production-safe logging)
// ==========================================
const isDev = process.env.NODE_ENV !== 'production';

const logger = {
  info: (msg: string) => isDev && console.log(`[Blockchain] ${msg}`),
  warn: (msg: string) => console.warn(`[Blockchain] ${msg}`),
  error: (msg: string, error?: unknown) => console.error(`[Blockchain] ${msg}`, error || ''),
  success: (msg: string) => isDev && console.log(`[Blockchain] ✓ ${msg}`),
};

// API Endpoints
const BLOCK_API = 'https://blockchain.elastos.io/api/v1/blocks/latest?limit=1';
const SUPPLY_API = 'https://api.elastos.io/widgets?q=total_supply';

// Cache file path
const CACHE_FILE = path.join(process.cwd(), 'blockchain-cache.json');

// Constants
const HALVING_INTERVAL = 1051200; // Blocks per halving cycle
const INITIAL_REWARD = 3.044; // Initial block reward after burn
const MAX_SUPPLY = 28219999; // Maximum ELA supply
const AVG_BLOCK_TIME_SECONDS = 120; // 2 minutes average

// Refresh interval (30 seconds)
const REFRESH_INTERVAL_MS = 30000;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 10000;

// Types
export interface BlockData {
  height: number;
  hash: string;
  time: number; // Unix timestamp
  txlength: number;
  minerinfo: string;
}

export interface BlockchainData {
  // From API
  currentBlock: number;
  blockTime: number; // Unix timestamp of current block
  circulatingSupply: number;
  
  // Calculated
  halvingNumber: number;
  nextHalvingBlock: number;
  blocksRemaining: number;
  progressPercent: number;
  currentReward: number;
  afterHalvingReward: number;
  estimatedHalvingDate: string;
  estimatedHalvingTime: string;
  remainingToMine: number;
  
  // Meta
  lastUpdated: number;
  isFromCache: boolean;
}

interface CacheData {
  currentBlock: number;
  blockTime: number;
  circulatingSupply: number;
  lastUpdated: number;
}

// ==========================================
// IN-MEMORY CACHE (for instant responses)
// ==========================================
let memoryCache: BlockchainData | null = null;
let isRefreshing = false;
let refreshIntervalId: NodeJS.Timeout | null = null;
let consecutiveFailures = 0;

// Read cache from file
function readFileCache(): CacheData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    logger.error('Error reading cache file', error);
  }
  return null;
}

// Write cache to file
function writeFileCache(data: CacheData): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    logger.error('Error writing cache file', error);
  }
}

// Sleep utility for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with retry logic and exponential backoff
async function fetchWithRetry<T>(
  url: string,
  parser: (response: Response) => Promise<T>,
  retries = MAX_RETRIES
): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await parser(response);
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      if (isLastAttempt) {
        logger.error(`Failed after ${retries + 1} attempts: ${url}`, error);
        return null;
      }
      
      // Exponential backoff: 2s, 4s, 8s
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
      logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  return null;
}

// Fetch latest block from Elastos API with retry
async function fetchLatestBlock(): Promise<BlockData | null> {
  return fetchWithRetry(BLOCK_API, async (response) => {
    const blocks = await response.json();
    return blocks[0] || null;
  });
}

// Fetch circulating supply from Elastos API with retry
async function fetchCirculatingSupply(): Promise<number | null> {
  return fetchWithRetry(SUPPLY_API, async (response) => {
    const text = await response.text();
    const supply = parseFloat(text.trim());
    return isNaN(supply) ? null : supply;
  });
}

// Calculate halving number from block height
function calculateHalvingNumber(blockHeight: number): number {
  return Math.floor(blockHeight / HALVING_INTERVAL);
}

// Calculate current block reward based on halving number
function calculateBlockReward(halvingNumber: number): number {
  return INITIAL_REWARD / Math.pow(2, halvingNumber);
}

// Format supply for display (approximation)
export function formatSupply(supply: number): string {
  if (supply >= 1000000) {
    return `~${(supply / 1000000).toFixed(1)}M`;
  }
  return `~${supply.toLocaleString()}`;
}

// Calculate estimated halving date from blocks remaining
function calculateEstimatedDate(blocksRemaining: number): { date: string; time: string } {
  const secondsRemaining = blocksRemaining * AVG_BLOCK_TIME_SECONDS;
  const estimatedDate = new Date(Date.now() + secondsRemaining * 1000);
  
  const dateOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  const timeOptions: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  };
  
  return {
    date: estimatedDate.toLocaleDateString('en-US', dateOptions),
    time: estimatedDate.toLocaleTimeString('en-US', timeOptions)
  };
}

// Build BlockchainData from raw values
function buildBlockchainData(
  currentBlock: number,
  blockTime: number,
  circulatingSupply: number,
  isFromCache: boolean
): BlockchainData {
  const halvingNumber = calculateHalvingNumber(currentBlock);
  const nextHalvingBlock = (halvingNumber + 1) * HALVING_INTERVAL;
  const blocksRemaining = nextHalvingBlock - currentBlock;
  const progressPercent = ((currentBlock % HALVING_INTERVAL) / HALVING_INTERVAL) * 100;
  const currentReward = calculateBlockReward(halvingNumber);
  const afterHalvingReward = currentReward / 2;
  const { date: estimatedHalvingDate, time: estimatedHalvingTime } = calculateEstimatedDate(blocksRemaining);
  const remainingToMine = MAX_SUPPLY - circulatingSupply;

  return {
    currentBlock,
    blockTime,
    circulatingSupply,
    halvingNumber,
    nextHalvingBlock,
    blocksRemaining,
    progressPercent: Math.round(progressPercent * 100) / 100,
    currentReward: Math.round(currentReward * 1000) / 1000,
    afterHalvingReward: Math.round(afterHalvingReward * 1000) / 1000,
    estimatedHalvingDate,
    estimatedHalvingTime,
    remainingToMine,
    lastUpdated: Date.now(),
    isFromCache
  };
}

// Background refresh - fetches new data and updates memory cache
async function refreshData(): Promise<void> {
  if (isRefreshing) return;
  isRefreshing = true;

  try {
    const [blockData, supply] = await Promise.all([
      fetchLatestBlock(),
      fetchCirculatingSupply()
    ]);

    if (blockData && supply) {
      // Reset failure counter on success
      consecutiveFailures = 0;
      
      // Update memory cache with fresh data
      memoryCache = buildBlockchainData(
        blockData.height,
        blockData.time,
        supply,
        false // fresh from API
      );

      // Also persist to file cache
      writeFileCache({
        currentBlock: blockData.height,
        blockTime: blockData.time,
        circulatingSupply: supply,
        lastUpdated: Date.now()
      });

      logger.success(`Updated: Block ${blockData.height.toLocaleString()}`);
    } else {
      consecutiveFailures++;
      logger.warn(`Refresh failed (${consecutiveFailures} consecutive failures)`);
      
      // If too many failures, extend refresh interval temporarily
      if (consecutiveFailures >= 5) {
        logger.warn('Multiple failures detected, using cached data');
      }
    }
  } catch (error) {
    consecutiveFailures++;
    logger.error('Refresh error', error);
  } finally {
    isRefreshing = false;
  }
}

// Initialize memory cache from file or API
async function initializeCache(): Promise<void> {
  logger.info('Initializing cache...');

  // First, try to load from file cache for instant startup
  const fileCache = readFileCache();
  if (fileCache) {
    memoryCache = buildBlockchainData(
      fileCache.currentBlock,
      fileCache.blockTime,
      fileCache.circulatingSupply,
      true // from cache
    );
    logger.success(`Loaded from file cache: Block ${fileCache.currentBlock.toLocaleString()}`);
  } else {
    // If no file cache, use fallback values
    memoryCache = buildBlockchainData(
      2100000, // Near halving block
      Math.floor(Date.now() / 1000),
      26160841,
      true
    );
    logger.warn('No cache file found, using fallback values');
  }

  // Then refresh from API in background
  refreshData();

  // Start periodic background refresh
  if (!refreshIntervalId) {
    refreshIntervalId = setInterval(refreshData, REFRESH_INTERVAL_MS);
    logger.info(`Background refresh started (every ${REFRESH_INTERVAL_MS / 1000}s)`);
  }
}

// Get blockchain data INSTANTLY from memory cache
export function getBlockchainDataInstant(): BlockchainData {
  if (memoryCache) {
    return memoryCache;
  }

  // Fallback if somehow cache isn't initialized
  logger.warn('Memory cache empty, using fallback');
  return buildBlockchainData(
    2100000, // Near halving block
    Math.floor(Date.now() / 1000),
    26160841,
    true
  );
}

// Original async function (kept for compatibility but uses instant cache)
export async function getBlockchainData(): Promise<BlockchainData> {
  return getBlockchainDataInstant();
}

// Get formatted data for frontend display (INSTANT)
export function getFormattedBlockchainDataInstant() {
  const data = getBlockchainDataInstant();
  
  return {
    ...data,
    currentBlockFormatted: data.currentBlock.toLocaleString(),
    nextHalvingBlockFormatted: data.nextHalvingBlock.toLocaleString(),
    blocksRemainingFormatted: data.blocksRemaining.toLocaleString(),
    circulatingSupplyFormatted: formatSupply(data.circulatingSupply),
    remainingToMineFormatted: formatSupply(data.remainingToMine),
    progressPercentFormatted: data.progressPercent.toFixed(2),
    currentRewardFormatted: data.currentReward.toFixed(3),
    afterHalvingRewardFormatted: data.afterHalvingReward.toFixed(3),
  };
}

// Original async function (kept for compatibility)
export async function getFormattedBlockchainData() {
  return getFormattedBlockchainDataInstant();
}

// Health check function
export function getHealthStatus() {
  return {
    cacheInitialized: memoryCache !== null,
    lastUpdated: memoryCache?.lastUpdated || null,
    isFromCache: memoryCache?.isFromCache || true,
    consecutiveFailures,
    isRefreshing
  };
}

// ==========================================
// INITIALIZE ON MODULE LOAD
// ==========================================
initializeCache();
