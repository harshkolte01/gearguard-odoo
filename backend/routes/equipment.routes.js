const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Equipment Routes
 * All routes require authentication
 */

/**
 * @route   GET /api/equipment
 * @desc    Get equipment list with role-based filtering
 * @access  All authenticated users
 */
router.get('/', authMiddleware, dashboardController.getEquipment);

/**
 * @route   GET /api/equipment/:id
 * @desc    Get single equipment details
 * @access  All authenticated users
 */
router.get('/:id', authMiddleware, dashboardController.getEquipmentById);

/**
 * @route   GET /api/equipment/:id/maintenance-requests
 * @desc    Get maintenance requests for specific equipment
 * @access  All authenticated users
 */
router.get('/:id/maintenance-requests', authMiddleware, dashboardController.getEquipmentMaintenanceRequests);

module.exports = router;

