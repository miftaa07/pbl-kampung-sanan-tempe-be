import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import pool from './config/database';
import { migrate } from './config/migrate';

import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import storeRoutes from './routes/storeRoutes';
import productRoutes from './routes/productRoutes';
import hampersRoutes from './routes/hampersRoutes';
import activityRoutes from './routes/activityRoutes';
import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: '*', // Allow all or specific client URLs in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      message: 'Backend Kampung Keripik Tempe Sanan is healthy and running',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: err.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/hampers', hampersRoutes);
app.use('/api/activity', activityRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' tidak ditemukan`
  });
});

// Centralized error handling
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Run migration checks
    await migrate();

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 Sanan Tempe Backend Server is running!`);
      console.log(`📍 Port: http://localhost:${PORT}`);
      console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
