const workCenterService = require('../services/work-center.service');

/**
 * Work Center Controller
 * Handle HTTP requests for work centers
 */

/**
 * Get all work centers
 * GET /api/work-centers
 */
const getWorkCenters = async (req, res) => {
  try {
    const { search, team_id } = req.query;

    const filters = {
      search,
      team_id,
    };

    const workCenters = await workCenterService.getWorkCenters(filters);

    res.json({
      success: true,
      data: workCenters,
    });
  } catch (error) {
    console.error('Get work centers error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get work centers',
      },
    });
  }
};

/**
 * Get single work center by ID
 * GET /api/work-centers/:id
 */
const getWorkCenterById = async (req, res) => {
  try {
    const { id } = req.params;

    const workCenter = await workCenterService.getWorkCenterById(id);

    res.json({
      success: true,
      data: workCenter,
    });
  } catch (error) {
    if (error.message === 'Work center not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Work center not found',
        },
      });
    }

    console.error('Get work center error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get work center',
      },
    });
  }
};

module.exports = {
  getWorkCenters,
  getWorkCenterById,
};


