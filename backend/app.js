const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

// CORS Configuration - Allow frontend to communicate with backend
app.use(cors({
  origin: ['http://localhost:3000', 'http://10.21.131.30:3000'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Home endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GearGuard API' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = app;

