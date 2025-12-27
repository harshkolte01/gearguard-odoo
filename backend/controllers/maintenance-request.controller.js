const maintenanceRequestService = require('../services/maintenance-request.service');
const { canAccessRequest, canCreateWorkCenterRequest } = require('../services/rbac.service');

/**
 * Maintenance Request Controller
 * Handle HTTP requests for maintenance requests
 */

/**
 * Create new maintenance request
 * POST /api/maintenance-requests
 */
const createRequest = async (req, res) => {
  try {
    const { subject, description, equipment_id, work_center_id, category, type, scheduled_date } = req.body;

    // Validate required fields
    if (!subject || !type) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: 'subject and type are required',
        },
      });
    }

    // Determine category
    const requestCategory = category || 'equipment';

    // Validate category
    if (!['equipment', 'work_center'].includes(requestCategory)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid category',
          details: 'Category must be equipment or work_center',
        },
      });
    }

    // Category-specific validation
    if (requestCategory === 'equipment') {
      if (!equipment_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Equipment ID required',
            details: 'equipment_id is required for equipment requests',
          },
        });
      }
    } else if (requestCategory === 'work_center') {
      // Check if user can create work center requests
      if (!canCreateWorkCenterRequest(req.user)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Permission denied',
            details: 'Portal users cannot create work center requests',
          },
        });
      }

      if (!work_center_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Work center ID required',
            details: 'work_center_id is required for work center requests',
          },
        });
      }
    }

    // Validate type
    if (!['corrective', 'preventive'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request type',
          details: 'Type must be corrective or preventive',
        },
      });
    }

    // Validate scheduled_date for preventive maintenance
    if (type === 'preventive' && !scheduled_date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Scheduled date required',
          details: 'Preventive maintenance requires a scheduled_date',
        },
      });
    }

    const request = await maintenanceRequestService.createRequest(
      { subject, description, equipment_id, work_center_id, category: requestCategory, type, scheduled_date },
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: request,
    });
  } catch (error) {
    console.error('Create request error:', error);
    
    // Handle specific error messages
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message,
          details: 'The requested resource could not be found',
        },
      });
    }

    if (error.message.includes('does not have a default maintenance team')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: 'Work center configuration is incomplete',
        },
      });
    }

    if (error.message.includes('Unable to create request')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: 'Request validation failed',
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to create request',
        details: 'An unexpected error occurred while creating the request',
      },
    });
  }
};

/**
 * Get maintenance requests with filters
 * GET /api/maintenance-requests
 */
const getRequests = async (req, res) => {
  try {
    const { page, limit, search, state, type, category, team_id, sort_by, sort_order } = req.query;

    const filters = {
      search,
      state,
      type,
      category,
      team_id,
      sort_by,
      sort_order,
    };

    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };

    const result = await maintenanceRequestService.getRequestsForDashboard(
      req.user.id,
      filters,
      pagination
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get requests',
        details: 'An unexpected error occurred while fetching requests',
      },
    });
  }
};

/**
 * Get single request details
 * GET /api/maintenance-requests/:id
 */
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permission
    const hasAccess = await canAccessRequest(req.user.id, id);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied',
          details: 'You don\'t have permission to view this request',
        },
      });
    }

    const request = await maintenanceRequestService.getRequestById(id);

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    if (error.message === 'Request not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Request not found',
        },
      });
    }

    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get request',
        details: 'An unexpected error occurred while fetching the request',
      },
    });
  }
};

/**
 * Update request state
 * PUT /api/maintenance-requests/:id/state
 */
const updateRequestState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state, duration_hours, assigned_technician_id } = req.body;

    // Check access permission
    const hasAccess = await canAccessRequest(req.user.id, id);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied',
          details: 'You don\'t have permission to update this request',
        },
      });
    }

    // Portal users cannot change state
    if (req.user.role === 'portal') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Permission denied',
          details: 'Portal users cannot change request state',
        },
      });
    }

    // Validate state
    if (!['new', 'in_progress', 'repaired', 'scrap'].includes(state)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid state',
          details: 'State must be new, in_progress, repaired, or scrap',
        },
      });
    }

    const updatedRequest = await maintenanceRequestService.updateRequestState(
      id,
      state,
      req.user.id,
      { duration_hours, assigned_technician_id }
    );

    res.json({
      success: true,
      message: 'Request state updated successfully',
      data: updatedRequest,
    });
  } catch (error) {
    if (error.message === 'Request not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Request not found',
        },
      });
    }

    // Handle state transition validation errors
    if (error.message.includes('transition') || 
        error.message.includes('Cannot change state') ||
        error.message.includes('Invalid state')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATE_TRANSITION',
          message: error.message,
        },
      });
    }

    // Handle other validation errors
    if (error.message.includes('Duration') || 
        error.message.includes('Technician') ||
        error.message.includes('Cannot start work') ||
        error.message.includes('Equipment is already marked as scrapped')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      });
    }

    console.error('Update request state error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update request state',
        details: 'An unexpected error occurred while updating the request',
      },
    });
  }
};

/**
 * Delete request (admin only)
 * DELETE /api/maintenance-requests/:id
 */
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await maintenanceRequestService.deleteRequest(id);

    res.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Delete request error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Request not found',
          details: 'The request may have already been deleted',
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete request',
        details: 'An unexpected error occurred while deleting the request',
      },
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestState,
  deleteRequest,
};


