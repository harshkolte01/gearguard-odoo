const prisma = require('../prisma/client');
const { filterByUserRole } = require('./rbac.service');

/**
 * Calendar Service
 * Handles fetching and organizing scheduled maintenance requests for calendar view
 */

/**
 * Get scheduled maintenance requests for a specific month
 * @param {string} userId - User ID making the request
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2025)
 * @param {string} technicianId - Optional technician filter (for managers/admins)
 * @returns {Promise<object>} Scheduled requests grouped by date
 */
const getScheduledRequests = async (userId, month, year, technicianId = null) => {
  // Get user to check role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Calculate date range for the month
  const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS
  const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of month

  // Base where clause for scheduled requests
  let where = {
    scheduled_date: {
      gte: startDate,
      lte: endDate,
    },
    // Exclude scrapped and completed requests from calendar
    state: {
      notIn: ['scrap', 'repaired'],
    },
  };

  // Apply role-based filtering
  where = await filterByUserRole(userId, where);

  // If a technician filter is provided AND user is manager/admin, apply it
  if (technicianId && (user.role === 'admin' || user.role === 'manager')) {
    where.assigned_technician_id = technicianId;
  }

  // Fetch scheduled requests
  const requests = await prisma.maintenanceRequest.findMany({
    where,
    include: {
      equipment: {
        select: {
          id: true,
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
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
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
    orderBy: {
      scheduled_date: 'asc',
    },
  });

  // Group requests by date (YYYY-MM-DD format)
  const requestsByDate = {};
  
  requests.forEach((request) => {
    if (request.scheduled_date) {
      const dateKey = request.scheduled_date.toISOString().split('T')[0];
      
      if (!requestsByDate[dateKey]) {
        requestsByDate[dateKey] = [];
      }
      
      requestsByDate[dateKey].push(request);
    }
  });

  return {
    month,
    year,
    requestsByDate,
    totalRequests: requests.length,
  };
};

/**
 * Get list of technicians for filter dropdown (managers/admins only)
 * @param {string} userId - User ID making the request
 * @returns {Promise<Array>} List of technicians
 */
const getTechniciansForFilter = async (userId) => {
  // Get user to check role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Only managers and admins can get full technician list
  if (user.role !== 'admin' && user.role !== 'manager') {
    return [];
  }

  // Fetch all technicians
  const technicians = await prisma.user.findMany({
    where: {
      role: 'technician',
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return technicians;
};

module.exports = {
  getScheduledRequests,
  getTechniciansForFilter,
};

