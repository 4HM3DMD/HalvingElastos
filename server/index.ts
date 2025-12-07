import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// ==========================================
// Security Headers Middleware
// ==========================================
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Production-specific headers
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://blockchain.elastos.io https://api.elastos.io",
    "frame-ancestors 'self'"
  ].join('; '));
  
  next();
});

// ==========================================
// Compression Middleware (built-in gzip for responses)
// ==========================================
app.use((req, res, next) => {
  // Enable response compression hint
  res.setHeader('Vary', 'Accept-Encoding');
  next();
});

// ==========================================
// Body Parsers
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ==========================================
// Request Logging (API only)
// ==========================================
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && !isProduction) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// ==========================================
// Static Asset Caching (Production)
// ==========================================
if (isProduction) {
  // Cache static assets for 1 year (they have hashed filenames)
  app.use('/assets', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    next();
  });
  
  // Cache other static files for 1 day
  app.use((req, res, next) => {
    if (req.path.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    next();
  });
}

// ==========================================
// Application Bootstrap
// ==========================================
(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: Error & { status?: number; statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = isProduction ? "Internal Server Error" : err.message;

    res.status(status).json({ message });
    
    // Log error in development
    if (!isProduction) {
      console.error(err);
    }
  });

  // Setup Vite (development) or serve static files (production)
  if (!isProduction) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, () => {
    log(`serving on http://localhost:${port} (${isProduction ? 'production' : 'development'})`);
  });
})();
