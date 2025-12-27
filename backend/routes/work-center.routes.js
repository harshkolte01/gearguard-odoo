const express = require('express');
const router = express.Router();
const workCenterController = require('../controllers/work-center.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireTechnician } = require('../middleware/rbac.middleware');

/**
 * Work Center Routes
 * All routes require authentication and technician+ role
 */

/**
 * @route   GET /api/work-centers
 * @desc    Get all work centers with optional filters
 * @access  Technician+
 */
router.get('/', authMiddleware, requireTechnician, workCenterController.getWorkCenters);

/**
 * @route   GET /api/work-centers/:id
 * @desc    Get single work center details
 * @access  Technician+
 */
router.get('/:id', authMiddleware, requireTechnician, workCenterController.getWorkCenterById);

module.exports = router;


