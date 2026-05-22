// ============================================
// Express App — Middleware + Routes
// ============================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import reviewRoutes from './routes/review.js';
import historyRoutes from './routes/history.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from '../config/db.js';

const app = express();

// ── Database Connection (Serverless Support) ─
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// ── Security & Logging ──────────────────────
app.use(helmet());
app.use(morgan('dev'));

// ── CORS ────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5001',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:5001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Rate Limiting ────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/review', limiter);

// ── Body Parser ──────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ─────────────────────────────
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Root API Info ────────────────────────────
app.get(['/api', '/'], (_req, res) => {
  res.json({
    name: 'CodeReview AI API',
    status: 'running',
    routes: ['/api/health', '/api/review', '/api/history'],
  });
});

// ── Routes ───────────────────────────────────
app.use(['/api/review', '/review'], reviewRoutes);
app.use(['/api/history', '/history'], historyRoutes);

// ── 404 handler ──────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ─────────────────────
app.use(errorHandler);

// Export Express app for local server usage
export default app;

// Export a serverless handler (some platforms look for named handlers)
export const handler = (req, res) => app(req, res);
