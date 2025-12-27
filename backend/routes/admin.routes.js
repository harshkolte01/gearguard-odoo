const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/rbac.middleware');

/**
 * Admin Routes
 * All routes require admin authentication and authorization
 */

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/technicians
 * @desc    Get all technicians and managers with team memberships
 * @access  Admin only
 */
router.get('/technicians', adminController.getAllTechnicians);

/**
 * @route   GET /api/admin/technicians/:id
 * @desc    Get single technician details
 * @access  Admin only
 */
router.get('/technicians/:id', adminController.getTechnicianById);

/**
 * @route   POST /api/admin/technicians
 * @desc    Create new technician or manager
 * @access  Admin only
 * @body    { name, email, password, role }
 */
router.post('/technicians', adminController.createTechnician);

/**
 * @route   PATCH /api/admin/technicians/:id/teams
 * @desc    Update technician's team assignments
 * @access  Admin only
 * @body    { teamIds: string[] }
 */
router.patch('/technicians/:id/teams', adminController.updateTechnicianTeams);

/**
 * @route   GET /api/admin/teams
 * @desc    Get all teams with member counts (for admin operations)
 * @access  Admin only
 */
router.get('/teams', adminController.getAdminTeams);

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Admin only
 */
router.get('/stats', adminController.getAdminStats);

module.exports = router;


