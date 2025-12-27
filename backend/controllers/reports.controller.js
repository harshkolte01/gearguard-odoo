const reportsService = require('../services/reports.service');

/**
 * Reports Controller
 * Handle HTTP requests for report data and analytics
 */

/**
 * Get maintenance requests grouped by team
 * GET /api/reports/requests-by-team
 * Query params: startDate, endDate, state (comma-separated)
 */
const getRequestsByTeam = async (req, res) => {
  try {
    const { startDate, endDate, state } = req.query;

    const filters = {};
    
    if (startDate) {
      filters.startDate = startDate;
    }
    
    if (endDate) {
      filters.endDate = endDate;
    }
    
    if (state) {
      // Convert comma-separated string to array
      filters.state = state.split(',').map(s => s.trim());
    }

    // Use cached user object if available, otherwise fallback to user ID
    const userOrId = req.userWithTeams || req.user.id;
    const data = await reportsService.getRequestsByTeam(userOrId, filters);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get requests by team error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to generate team report',
      },
    });
  }
};

/**
 * Get maintenance requests grouped by equipment category
 * GET /api/reports/requests-by-category
 * Query params: startDate, endDate, state (comma-separated)
 */
const getRequestsByEquipmentCategory = async (req, res) => {
  try {
    const { startDate, endDate, state } = req.query;

    const filters = {};
    
    if (startDate) {
      filters.startDate = startDate;
    }
    
    if (endDate) {
      filters.endDate = endDate;
    }
    
    if (state) {
      // Convert comma-separated string to array
      filters.state = state.split(',').map(s => s.trim());
    }

    // Use cached user object if available, otherwise fallback to user ID
    const userOrId = req.userWithTeams || req.user.id;
    const data = await reportsService.getRequestsByEquipmentCategory(userOrId, filters);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get requests by category error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to generate category report',
      },
    });
  }
};

module.exports = {
  getRequestsByTeam,
  getRequestsByEquipmentCategory,
};


