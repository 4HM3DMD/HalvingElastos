import type { Express } from "express";
import { createServer, type Server } from "http";
import { getFormattedBlockchainDataInstant, getBlockchainDataInstant, getHealthStatus } from "./blockchain";

export async function registerRoutes(app: Express): Promise<Server> {
  // ==========================================
  // Blockchain API Routes - INSTANT responses
  // ==========================================
  
  // Get all blockchain data (formatted for display) - INSTANT
  app.get("/api/blockchain", (req, res) => {
    try {
      const data = getFormattedBlockchainDataInstant();
      res.json(data);
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
      res.status(500).json({ error: "Failed to fetch blockchain data" });
    }
  });
  
  // Get raw blockchain data (for calculations) - INSTANT
  app.get("/api/blockchain/raw", (req, res) => {
    try {
      const data = getBlockchainDataInstant();
      res.json(data);
    } catch (error) {
      console.error("Error fetching raw blockchain data:", error);
      res.status(500).json({ error: "Failed to fetch blockchain data" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    try {
      const health = getHealthStatus();
      const status = health.cacheInitialized && health.consecutiveFailures < 10 ? 200 : 503;
      res.status(status).json({
        status: status === 200 ? 'healthy' : 'degraded',
        ...health,
        uptime: process.uptime(),
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: 'Health check failed' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
