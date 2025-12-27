const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { cacheUserData } = require('../middleware/user-cache.middleware');
const { requireTechnician } = require('../middleware/rbac.middleware');

/**
 * Dashboard Routes
 * All routes require authentication and technician+ role
 */

/**
 * @route   GET /api/dashboard/kpis
 * @desc    Get all KPI values for dashboard cards
 * @access  Technician+
 */
router.get('/kpis', authMiddleware, cacheUserData, requireTechnician, dashboardController.getKPIs);

/**
 * @route   GET /api/dashboard/critical-equipment
 * @desc    Get list of critical equipment
 * @access  Technician+
 */
router.get(
  '/critical-equipment',
  authMiddleware,
  cacheUserData,
  requireTechnician,
  dashboardController.getCriticalEquipment
);

/**
 * @route   GET /api/dashboard/technician-load
 * @desc    Get detailed technician workload breakdown
 * @access  Technician+
 */
router.get(
  '/technician-load',
  authMiddleware,
  cacheUserData,
  requireTechnician,
  dashboardController.getTechnicianLoad
);

/**
 * @route   GET /api/dashboard/requests
 * @desc    Get recent requests for dashboard table
 * @access  Technician+
 */
router.get('/requests', authMiddleware, cacheUserData, requireTechnician, dashboardController.getRequests);

module.exports = router;


