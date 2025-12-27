const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireTechnician } = require('../middleware/rbac.middleware');

/**
 * Calendar Routes
 * All routes require authentication and technician+ role
 */

/**
 * @route   GET /api/calendar/scheduled
 * @desc    Get scheduled maintenance requests for a specific month
 * @query   month - Month number (1-12)
 * @query   year - Year (e.g., 2025)
 * @query   technician_id - Optional technician filter (managers/admins only)
 * @access  Technician+
 */
router.get('/scheduled', authMiddleware, requireTechnician, calendarController.getScheduledRequests);

/**
 * @route   GET /api/calendar/technicians
 * @desc    Get list of technicians for filter dropdown
 * @access  Manager+ (returns empty for technicians)
 */
router.get('/technicians', authMiddleware, requireTechnician, calendarController.getTechnicians);

module.exports = router;


