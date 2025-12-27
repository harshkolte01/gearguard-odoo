const calendarService = require('../services/calendar.service');

/**
 * Calendar Controller
 * Handles calendar-related HTTP requests
 */

/**
 * Get scheduled maintenance requests for calendar view
 * GET /api/calendar/scheduled
 * Query params: month, year, technician_id (optional)
 */
const getScheduledRequests = async (req, res) => {
  try {
    const { month, year, technician_id } = req.query;
    // Use cached user object if available, otherwise fallback to user ID
    const userOrId = req.userWithTeams || req.user.id;

    // Validate month and year
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: 'Month and year are required',
          details: 'Please provide valid month (1-12) and year parameters',
        },
      });
    }

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MONTH',
          message: 'Invalid month',
          details: 'Month must be between 1 and 12',
        },
      });
    }

    if (yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_YEAR',
          message: 'Invalid year',
          details: 'Year must be between 2000 and 2100',
        },
      });
    }

    const result = await calendarService.getScheduledRequests(
      userOrId,
      monthNum,
      yearNum,
      technician_id || null
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get scheduled requests error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch scheduled requests',
        details: error.message,
      },
    });
  }
};

/**
 * Get list of technicians for filtering
 * GET /api/calendar/technicians
 */
const getTechnicians = async (req, res) => {
  try {
    // Use cached user object if available, otherwise fallback to user ID
    const userOrId = req.userWithTeams || req.user.id;

    const technicians = await calendarService.getTechniciansForFilter(userOrId);

    res.json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    console.error('Get technicians error:', error);
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

module.exports = {
  getScheduledRequests,
  getTechnicians,
};


