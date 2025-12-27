const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const maintenanceRequestRoutes = require('./routes/maintenance-request.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const equipmentCategoryRoutes = require('./routes/equipment-category.routes');
const workCenterRoutes = require('./routes/work-center.routes');
const calendarRoutes = require('./routes/calendar.routes');
const teamRoutes = require('./routes/team.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();

// CORS Configuration - Allow frontend to communicate with backend
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/maintenance-requests', maintenanceRequestRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/equipment-categories', equipmentCategoryRoutes);
app.use('/api/work-centers', workCenterRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/reports', reportsRoutes);

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

