const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireTechnician } = require('../middleware/rbac.middleware');

/**
 * Team Routes
 * All routes require authentication and technician+ role
 * Portal users do not have access
 */

/**
 * @route   GET /api/teams
 * @desc    Get teams based on user role (admin/manager see all, technician sees own teams)
 * @access  Technician+
 */
router.get('/', authMiddleware, requireTechnician, teamController.getTeams);

module.exports = router;


