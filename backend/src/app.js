const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

// Security & Core Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Samaj Portal API Gateway is operational 🚀',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Import Feature Routes
const authRoutes = require('./modules/auth/auth.routes');
const profileRoutes = require('./modules/profiles/profile.routes');
const directoryRoutes = require('./modules/directory/directory.routes');

// API Routes Mounting Point
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profiles`, profileRoutes);
app.use(`${API_PREFIX}/directory`, directoryRoutes);

app.get(`${API_PREFIX}`, (req, res) => {
  res.json({
    name: 'Samaj Portal Enterprise API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      profiles: `${API_PREFIX}/profiles`,
      directory: `${API_PREFIX}/directory`,
      posts: `${API_PREFIX}/posts`,
      groups: `${API_PREFIX}/groups`,
      matrimonial: `${API_PREFIX}/matrimonial`,
      memorials: `${API_PREFIX}/memorials`,
      events: `${API_PREFIX}/events`,
      bloodBank: `${API_PREFIX}/blood-bank`,
      donations: `${API_PREFIX}/donations`,
      announcements: `${API_PREFIX}/announcements`,
      notifications: `${API_PREFIX}/notifications`,
      admin: `${API_PREFIX}/admin`,
    },
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error Details]:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
