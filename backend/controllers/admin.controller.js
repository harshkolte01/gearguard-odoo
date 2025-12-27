const adminService = require('../services/admin.service');

/**
 * Admin Controller
 * Handle HTTP requests for admin operations
 */

/**
 * Get all technicians and managers
 * @route GET /api/admin/technicians
 * @access Admin only
 */
const getAllTechnicians = async (req, res) => {
  try {
    const result = await adminService.getAllTechnicians();
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get all technicians error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch technicians',
        details: error.message,
      },
    });
  }
};

/**
 * Get single technician details
 * @route GET /api/admin/technicians/:id
 * @access Admin only
 */
const getTechnicianById = async (req, res) => {
  try {
    const { id } = req.params;
    const technician = await adminService.getTechnicianById(id);
    
    res.status(200).json({
      success: true,
      data: technician,
    });
  } catch (error) {
    console.error('Get technician by ID error:', error);
    
    const statusCode = error.message.includes('not found') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
        message: error.message,
        details: error.message,
      },
    });
  }
};

/**
 * Create new technician or manager
 * @route POST /api/admin/technicians
 * @access Admin only
 */
const createTechnician = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: 'Name, email, password, and role are required',
        },
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          details: 'Please provide a valid email address',
        },
      });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password too short',
          details: 'Password must be at least 6 characters long',
        },
      });
    }
    
    // Validate role
    if (!['technician', 'manager'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid role',
          details: 'Role must be either technician or manager',
        },
      });
    }
    
    const technician = await adminService.createTechnician({
      name,
      email,
      password,
      role,
    });
    
    res.status(201).json({
      success: true,
      message: 'Technician created successfully',
      data: technician,
    });
  } catch (error) {
    console.error('Create technician error:', error);
    
    // Handle duplicate email error
    if (error.message.includes('duplicate')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_EMAIL',
          message: 'Email Id should not be a duplicate in database',
          details: error.message,
        },
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create technician',
        details: error.message,
      },
    });
  }
};

/**
 * Update technician's team assignments
 * @route PATCH /api/admin/technicians/:id/teams
 * @access Admin only
 */
const updateTechnicianTeams = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamIds } = req.body;
    
    // Validate teamIds
    if (!Array.isArray(teamIds)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid team IDs',
          details: 'teamIds must be an array',
        },
      });
    }
    
    const updatedTechnician = await adminService.updateTechnicianTeams(id, teamIds);
    
    res.status(200).json({
      success: true,
      message: 'Team assignments updated successfully',
      data: updatedTechnician,
    });
  } catch (error) {
    console.error('Update technician teams error:', error);
    
    const statusCode = error.message.includes('not found') || error.message.includes('invalid') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
        message: error.message,
        details: error.message,
      },
    });
  }
};

/**
 * Get all teams for admin (with member counts)
 * @route GET /api/admin/teams
 * @access Admin only
 */
const getAdminTeams = async (req, res) => {
  try {
    const teams = await adminService.getAdminTeams();
    
    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error('Get admin teams error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch teams',
        details: error.message,
      },
    });
  }
};

/**
 * Get admin dashboard statistics
 * @route GET /api/admin/stats
 * @access Admin only
 */
const getAdminStats = async (req, res) => {
  try {
    const stats = await adminService.getAdminStats();
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch statistics',
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnicianTeams,
  getAdminTeams,
  getAdminStats,
};


