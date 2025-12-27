const express = require('express');
const router = express.Router();
const maintenanceRequestController = require('../controllers/maintenance-request.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireAuth, requireAdmin } = require('../middleware/rbac.middleware');

/**
 * Maintenance Request Routes
 * All routes require authentication
 */

/**
 * @route   POST /api/maintenance-requests
 * @desc    Create new maintenance request with auto-fill
 * @access  All authenticated users
 */
router.post('/', authMiddleware, requireAuth, maintenanceRequestController.createRequest);

/**
 * @route   GET /api/maintenance-requests
 * @desc    Get maintenance requests with filters and pagination
 * @access  All authenticated users (filtered by role)
 */
router.get('/', authMiddleware, requireAuth, maintenanceRequestController.getRequests);

/**
 * @route   GET /api/maintenance-requests/:id
 * @desc    Get single request details
 * @access  All authenticated users (with access check)
 */
router.get('/:id', authMiddleware, requireAuth, maintenanceRequestController.getRequestById);

/**
 * @route   PATCH /api/maintenance-requests/:id/state
 * @desc    Update request state (workflow)
 * @access  Technician+ (not portal users)
 */
router.patch(
  '/:id/state',
  authMiddleware,
  requireAuth,
  maintenanceRequestController.updateRequestState
);

/**
 * @route   DELETE /api/maintenance-requests/:id
 * @desc    Delete request
 * @access  Admin only
 */
router.delete(
  '/:id',
  authMiddleware,
  requireAdmin,
  maintenanceRequestController.deleteRequest
);

module.exports = router;


