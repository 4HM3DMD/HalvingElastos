import { useState, useEffect, useCallback, useRef } from 'react';

// Constants for calculations
const HALVING_INTERVAL = 1051200;
const AVG_BLOCK_TIME_SECONDS = 120; // 2 minutes

export interface BlockchainData {
  // Raw data
  currentBlock: number;
  blockTime: number;
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
  
  // Formatted for display
  currentBlockFormatted: string;
  nextHalvingBlockFormatted: string;
  blocksRemainingFormatted: string;
  circulatingSupplyFormatted: string;
  remainingToMineFormatted: string;
  progressPercentFormatted: string;
  currentRewardFormatted: string;
  afterHalvingRewardFormatted: string;
  
  // Meta
  lastUpdated: number;
  isFromCache: boolean;
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseBlockchainDataResult {
  data: BlockchainData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  
  // Countdown specific
  countdown: CountdownValues;
  prevCountdown: CountdownValues;
}

// Calculate derived values for fallback
function calculateFallbackData(): BlockchainData {
  // Use approximate current block (will be updated from API instantly)
  const currentBlock = 2100000;
  const halvingNumber = Math.floor(currentBlock / HALVING_INTERVAL);
  const nextHalvingBlock = (halvingNumber + 1) * HALVING_INTERVAL;
  const blocksRemaining = nextHalvingBlock - currentBlock;
  const progressPercent = ((currentBlock % HALVING_INTERVAL) / HALVING_INTERVAL) * 100;
  const circulatingSupply = 26160841;
  const currentReward = 3.044 / Math.pow(2, halvingNumber);
  const afterHalvingReward = currentReward / 2;
  const remainingToMine = 28219999 - circulatingSupply;

  // Calculate estimated date
  const secondsRemaining = blocksRemaining * AVG_BLOCK_TIME_SECONDS;
  const estimatedDate = new Date(Date.now() + secondsRemaining * 1000);
  const estimatedHalvingDate = estimatedDate.toLocaleDateString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });
  const estimatedHalvingTime = estimatedDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short'
  });

  return {
    currentBlock,
    blockTime: Math.floor(Date.now() / 1000),
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
    currentBlockFormatted: currentBlock.toLocaleString(),
    nextHalvingBlockFormatted: nextHalvingBlock.toLocaleString(),
    blocksRemainingFormatted: blocksRemaining.toLocaleString(),
    circulatingSupplyFormatted: `~${(circulatingSupply / 1000000).toFixed(1)}M`,
    remainingToMineFormatted: `~${(remainingToMine / 1000000).toFixed(1)}M`,
    progressPercentFormatted: progressPercent.toFixed(2),
    currentRewardFormatted: currentReward.toFixed(3),
    afterHalvingRewardFormatted: afterHalvingReward.toFixed(3),
    lastUpdated: Date.now(),
    isFromCache: true,
  };
}

// Initial fallback data (calculated once)
const INITIAL_FALLBACK = calculateFallbackData();

export function useBlockchainData(pollInterval = 30000): UseBlockchainDataResult {
  // Start with fallback data immediately - no loading state on initial render
  const [data, setData] = useState<BlockchainData>(INITIAL_FALLBACK);
  const [isLoading, setIsLoading] = useState(false); // Not loading initially - we have fallback
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<CountdownValues>(() => {
    // Calculate initial countdown from fallback
    const totalSeconds = INITIAL_FALLBACK.blocksRemaining * AVG_BLOCK_TIME_SECONDS;
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  });
  const prevCountdownRef = useRef<CountdownValues>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const hasLoadedRef = useRef(false);

  const fetchData = useCallback(async () => {
    // Only show loading on first real fetch attempt
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch('/api/blockchain');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blockchainData = await response.json();
      setData(blockchainData);
      setError(null);
      hasLoadedRef.current = true;
    } catch (err) {
      console.error('Error fetching blockchain data:', err);
      setError('Failed to fetch blockchain data');
      // Keep current data (either fallback or last good data)
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    // Fetch immediately - server responds instantly from memory cache
    fetchData();
    
    const intervalId = setInterval(fetchData, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchData, pollInterval]);

  // Countdown calculation - based purely on blocks remaining
  // No artificial time adjustment to stay honest about precision
  // Updates only when new block data arrives from API
  useEffect(() => {
    if (!data) return;

    const blocksRemaining = data.blocksRemaining;
    const totalSecondsRemaining = blocksRemaining * AVG_BLOCK_TIME_SECONDS;
    
    // Calculate time units directly from blocks (always even minutes since 2min/block)
    const days = Math.floor(totalSecondsRemaining / 86400);
    const hours = Math.floor((totalSecondsRemaining % 86400) / 3600);
    const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
    const seconds = 0; // Not displayed, kept for interface compatibility
    
    setCountdown(prev => {
      // Only update if values have changed
      if (prev.days === days && prev.hours === hours && prev.minutes === minutes) {
        return prev;
      }
      // Save previous value for flip animation
      prevCountdownRef.current = prev;
      return { days, hours, minutes, seconds };
    });
  }, [data]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    countdown,
    prevCountdown: prevCountdownRef.current,
  };
}

// Helper to format time units with leading zeros
export function padNumber(num: number, digits = 2): string {
  return num.toString().padStart(digits, '0');
}
