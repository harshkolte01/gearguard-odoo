const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { cacheUserData } = require('../middleware/user-cache.middleware');
const { requireTechnician } = require('../middleware/rbac.middleware');

/**
 * Reports Routes
 * All routes require authentication and technician+ role (admin, manager, or technician)
 */

/**
 * @route   GET /api/reports/requests-by-team
 * @desc    Get maintenance requests grouped by team
 * @access  Admin, Manager, Technician
 * @query   startDate - Optional ISO date string
 * @query   endDate - Optional ISO date string
 * @query   state - Optional comma-separated states (new, in_progress, repaired, scrap)
 */
router.get(
  '/requests-by-team',
  authMiddleware,
  cacheUserData,
  requireTechnician,
  reportsController.getRequestsByTeam
);

/**
 * @route   GET /api/reports/requests-by-category
 * @desc    Get maintenance requests grouped by equipment category
 * @access  Admin, Manager, Technician
 * @query   startDate - Optional ISO date string
 * @query   endDate - Optional ISO date string
 * @query   state - Optional comma-separated states (new, in_progress, repaired, scrap)
 */
router.get(
  '/requests-by-category',
  authMiddleware,
  cacheUserData,
  requireTechnician,
  reportsController.getRequestsByEquipmentCategory
);

module.exports = router;

