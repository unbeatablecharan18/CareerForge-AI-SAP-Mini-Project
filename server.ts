/**
 * CareerForge AI - Production Full-Stack Server
 * Express application mounting Vite middlewares in development and serving static dist in production.
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initDatabase } from './server/db.js';
import { apiRouter } from './server/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Initialize persistent database
initDatabase();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Startup environment validation
if (!process.env.GEMINI_API_KEY) {
  console.warn('[Warning] GEMINI_API_KEY is not defined in the environment. AI model calls will use fallback processing.');
} else {
  console.log('[AI] GEMINI_API_KEY detected successfully.');
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: isProduction ? 'production' : 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api', apiRouter);

// Centralized error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error Intercepted]:', err);
  if (err?.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum supported resume size is 30MB.' });
    }
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  const statusCode = typeof err?.status === 'number' ? err.status : (typeof err?.statusCode === 'number' ? err.statusCode : 500);
  return res.status(statusCode).json({ error: err?.message || 'Internal server error.' });
});

// Development vs Production serving
async function setupFrontend() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted for development.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server] Serving production static assets from dist.');
  }
}

setupFrontend().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`  CAREERFORGE AI - Production Engine Active`);
    console.log(`  URL: http://0.0.0.0:${PORT}`);
    console.log(`  Environment: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`======================================================\n`);
  });
});
