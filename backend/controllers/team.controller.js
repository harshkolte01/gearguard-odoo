const teamService = require('../services/team.service');

/**
 * Team Controller
 * Handle HTTP requests for teams
 */

/**
 * Get teams based on user role
 * GET /api/teams
 */
const getTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await teamService.getTeams(userId);

    res.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get teams',
      },
    });
  }
};

module.exports = {
  getTeams,
};


