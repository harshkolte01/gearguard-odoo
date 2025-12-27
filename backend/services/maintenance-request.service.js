const prisma = require('../prisma/client');
const { filterByUserRole } = require('./rbac.service');
const { autoFillFromWorkCenter } = require('./work-center.service');
const { validateStateTransition, REQUEST_STATES } = require('../constants/states');

/**
 * Maintenance Request Service
 * Business logic for maintenance requests
 */

/**
 * Auto-fill team and work center from equipment
 * @param {string} equipmentId - Equipment ID
 * @returns {Promise<object>} Auto-filled data
 */
const autoFillFromEquipment = async (equipmentId) => {
  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    include: {
      maintenanceTeam: { select: { id: true, name: true } },
      defaultTechnician: { select: { id: true, name: true, email: true } },
      workCenter: { select: { id: true, name: true } },
    },
  });

  if (!equipment) {
    throw new Error('Equipment not found');
  }

  return {
    team_id: equipment.maintenance_team_id,
    team: equipment.maintenanceTeam,
    work_center_id: equipment.work_center_id,
    workCenter: equipment.workCenter,
    suggested_technician_id: equipment.default_technician_id,
    suggestedTechnician: equipment.defaultTechnician,
  };
};

/**
 * Create new maintenance request
 * @param {object} data - Request data
 * @param {string} creatorId - User ID of creator
 * @returns {Promise<object>} Created request
 */
const createRequest = async (data, creatorId) => {
  const { subject, description, equipment_id, work_center_id, category, type, scheduled_date } = data;

  let autoFilled;
  let requestCategory = category || 'equipment';

  // Validate and auto-fill based on category
  if (requestCategory === 'work_center') {
    if (!work_center_id) {
      throw new Error('Work center ID is required for work center requests');
    }
    // Auto-fill from work center (will throw if no default team)
    autoFilled = await autoFillFromWorkCenter(work_center_id);
  } else {
    // Equipment request
    if (!equipment_id) {
      throw new Error('Equipment ID is required for equipment requests');
    }
    // Validate equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipment_id },
    });

    if (!equipment) {
      throw new Error('Equipment not found');
    }
    // Auto-fill from equipment
    autoFilled = await autoFillFromEquipment(equipment_id);
  }

  // Final validation: ensure we have a team_id
  if (!autoFilled.team_id) {
    throw new Error('Unable to create request: No maintenance team could be determined. Please contact an administrator.');
  }

  // Create request with appropriate category
  const request = await prisma.maintenanceRequest.create({
    data: {
      subject,
      description,
      type,
      state: 'new',
      category: requestCategory,
      equipment_id: requestCategory === 'equipment' ? equipment_id : null,
      work_center_id: requestCategory === 'work_center' ? work_center_id : autoFilled.work_center_id,
      team_id: autoFilled.team_id,
      assigned_technician_id: autoFilled.suggested_technician_id || null,
      scheduled_date: scheduled_date ? new Date(scheduled_date) : null,
      created_by: creatorId,
    },
    include: {
      equipment: {
        select: {
          name: true,
          serial_number: true,
          department: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      workCenter: {
        select: {
          id: true,
          name: true,
        },
      },
      assignedTechnician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    ...request,
    auto_filled: {
      team: true,
      work_center: !!autoFilled.work_center_id,
      suggested_technician: autoFilled.suggestedTechnician?.name || null,
    },
  };
};

/**
 * Get maintenance requests for dashboard with filters
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<object>} Requests with pagination
 */
const getRequestsForDashboard = async (userId, filters = {}, pagination = {}) => {
  const { search, state, type, category, team_id, equipment_id, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const { page = 1, limit = 10 } = pagination;

  // Build where clause
  let where = {};

  // Apply role-based filtering
  where = await filterByUserRole(userId, where);

  // Apply search
  if (search) {
    where.OR = [
      { subject: { contains: search, mode: 'insensitive' } },
      { equipment: { name: { contains: search, mode: 'insensitive' } } },
      { equipment: { serial_number: { contains: search, mode: 'insensitive' } } },
      { workCenter: { name: { contains: search, mode: 'insensitive' } } },
      { workCenter: { code: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Apply state filter
  if (state) {
    const states = state.split(',');
    where.state = { in: states };
  }

  // Apply type filter
  if (type) {
    where.type = type;
  }

  // Apply category filter
  if (category) {
    where.category = category;
  }

  // Apply team filter
  if (team_id) {
    where.team_id = team_id;
  }

  // Apply equipment filter
  if (equipment_id) {
    where.equipment_id = equipment_id;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get total count
  const total = await prisma.maintenanceRequest.count({ where });

  // Get requests
  const requests = await prisma.maintenanceRequest.findMany({
    where,
    include: {
      equipment: {
        select: {
          name: true,
          serial_number: true,
          department: true,
        },
      },
      workCenter: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      assignedTechnician: {
        select: {
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { [sort_by]: sort_order },
    skip,
    take: limit,
  });

  return {
    requests,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update request state
 * @param {string} requestId - Request ID
 * @param {string} newState - New state
 * @param {string} userId - User making the change
 * @param {object} additionalData - Additional data (duration, technician)
 * @returns {Promise<object>} Updated request
 */
const updateRequestState = async (requestId, newState, userId, additionalData = {}) => {
  const { duration_hours, assigned_technician_id } = additionalData;

  // Get current request and user
  const currentRequest = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    include: { 
      team: true,
      equipment: {
        select: {
          id: true,
          name: true,
          serial_number: true,
          status: true,
        },
      },
    },
  });

  if (!currentRequest) {
    throw new Error('Request not found');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teamMemberships: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Validate state transition using state machine
  const transitionValidation = validateStateTransition(currentRequest.state, newState);
  if (!transitionValidation.valid) {
    throw new Error(transitionValidation.error);
  }

  // Validate state transition - cannot start work without assigned technician
  if (newState === REQUEST_STATES.IN_PROGRESS && !currentRequest.assigned_technician_id) {
    throw new Error('Cannot start work: A technician must be assigned to this request before work can begin');
  }

  // Validate state transition - duration required when marking as repaired
  if (newState === REQUEST_STATES.REPAIRED && !duration_hours) {
    throw new Error('Duration hours required when marking as repaired');
  }

  // Validate duration_hours if provided
  if (duration_hours !== undefined) {
    if (typeof duration_hours !== 'number' || duration_hours <= 0) {
      throw new Error('Duration hours must be a positive number');
    }
    if (duration_hours > 1000) {
      throw new Error('Duration hours must not exceed 1000');
    }
  }

  // If assigning technician, verify they're in the team and user has permission
  if (assigned_technician_id !== undefined) {
    // Only admins and managers can assign technicians
    if (!['admin', 'manager'].includes(user.role)) {
      throw new Error('Only administrators and managers can assign technicians');
    }

    const technician = await prisma.user.findUnique({
      where: { id: assigned_technician_id },
      include: { teamMemberships: true },
    });

    if (!technician) {
      throw new Error('Technician not found');
    }

    const isInTeam = technician.teamMemberships.some(
      (tm) => tm.team_id === currentRequest.team_id
    );

    if (!isInTeam) {
      throw new Error('Technician must be a member of the request team');
    }
  }

  // SCRAP LOGIC: If marking as scrap and this is an equipment request, mark equipment as scrapped
  if (newState === REQUEST_STATES.SCRAP && currentRequest.equipment_id && currentRequest.equipment) {
    // Prevent scrapping if equipment is already scrapped
    if (currentRequest.equipment.status === 'scrapped') {
      throw new Error('Equipment is already marked as scrapped');
    }

    // Update equipment status to scrapped
    await prisma.equipment.update({
      where: { id: currentRequest.equipment_id },
      data: { status: 'scrapped' },
    });

    console.log(`Equipment ${currentRequest.equipment.serial_number} marked as scrapped due to request ${requestId} by user ${user.name}`);
  }

  // Update request
  const updateData = {
    state: newState,
  };

  if (duration_hours !== undefined) {
    updateData.duration_hours = duration_hours;
  }

  if (assigned_technician_id !== undefined) {
    updateData.assigned_technician_id = assigned_technician_id;
  }

  const updatedRequest = await prisma.maintenanceRequest.update({
    where: { id: requestId },
    data: updateData,
    include: {
      equipment: {
        select: {
          id: true,
          name: true,
          serial_number: true,
          status: true,
        },
      },
      assignedTechnician: {
        select: {
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          name: true,
        },
      },
    },
  });

  return updatedRequest;
};

/**
 * Get single request details
 * @param {string} requestId - Request ID
 * @returns {Promise<object>} Request details
 */
const getRequestById = async (requestId) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    include: {
      equipment: {
        select: {
          id: true,
          name: true,
          serial_number: true,
          department: true,
          location: true,
        },
      },
      workCenter: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      assignedTechnician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!request) {
    throw new Error('Request not found');
  }

  return request;
};

/**
 * Delete request (admin only)
 * @param {string} requestId - Request ID
 * @returns {Promise<void>}
 */
const deleteRequest = async (requestId) => {
  await prisma.maintenanceRequest.delete({
    where: { id: requestId },
  });
};

module.exports = {
  autoFillFromEquipment,
  createRequest,
  getRequestsForDashboard,
  updateRequestState,
  getRequestById,
  deleteRequest,
};


