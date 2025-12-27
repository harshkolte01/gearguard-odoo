const prisma = require('../prisma/client');

/**
 * Reports Service
 * Aggregate maintenance request data for reporting and analytics
 */

/**
 * Get maintenance requests grouped by team
 * @param {string} userId - User ID
 * @param {object} filters - Optional filters (startDate, endDate, state)
 * @returns {Promise<array>} Array of team data with request counts
 */
const getRequestsByTeam = async (userId, filters = {}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // Build where clause with filters
  const where = {};

  // Apply role-based filtering
  // Admins and managers see all requests
  if (user.role === 'technician') {
    // Technicians should not access this, but if they do, limit to their teams
    const teamMemberships = await prisma.teamMember.findMany({
      where: { user_id: userId },
      select: { team_id: true },
    });
    const teamIds = teamMemberships.map((tm) => tm.team_id);
    where.team_id = { in: teamIds };
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    where.created_at = {};
    if (filters.startDate) {
      where.created_at.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.created_at.lte = new Date(filters.endDate);
    }
  }

  // State filter
  if (filters.state && filters.state.length > 0) {
    where.state = { in: filters.state };
  }

  // Group by team and count
  const teamCounts = await prisma.maintenanceRequest.groupBy({
    by: ['team_id'],
    _count: {
      id: true,
    },
    where,
  });

  // Fetch team names
  const teamIds = teamCounts.map((tc) => tc.team_id);
  const teams = await prisma.team.findMany({
    where: {
      id: { in: teamIds },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Map team names to counts
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));

  const result = teamCounts
    .map((tc) => ({
      team_id: tc.team_id,
      team_name: teamMap.get(tc.team_id) || 'Unknown Team',
      request_count: tc._count.id,
    }))
    .sort((a, b) => b.request_count - a.request_count); // Sort by count descending

  return result;
};

/**
 * Get maintenance requests grouped by equipment category
 * @param {string} userId - User ID
 * @param {object} filters - Optional filters (startDate, endDate, state)
 * @returns {Promise<array>} Array of category data with request counts
 */
const getRequestsByEquipmentCategory = async (userId, filters = {}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // Build where clause with filters
  const where = {
    category: 'equipment', // Only include equipment requests, not work center requests
    equipment_id: { not: null }, // Must have equipment
  };

  // Apply role-based filtering
  if (user.role === 'technician') {
    // Technicians should not access this, but if they do, limit to their teams
    const teamMemberships = await prisma.teamMember.findMany({
      where: { user_id: userId },
      select: { team_id: true },
    });
    const teamIds = teamMemberships.map((tm) => tm.team_id);
    where.team_id = { in: teamIds };
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    where.created_at = {};
    if (filters.startDate) {
      where.created_at.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.created_at.lte = new Date(filters.endDate);
    }
  }

  // State filter
  if (filters.state && filters.state.length > 0) {
    where.state = { in: filters.state };
  }

  // Fetch all requests with equipment category information
  const requests = await prisma.maintenanceRequest.findMany({
    where,
    select: {
      id: true,
      equipment: {
        select: {
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Group by category manually
  const categoryCountMap = new Map();

  requests.forEach((req) => {
    const categoryId = req.equipment?.category_id || null;
    const categoryName = req.equipment?.category?.name || 'Uncategorized';
    
    if (!categoryCountMap.has(categoryId)) {
      categoryCountMap.set(categoryId, {
        category_id: categoryId,
        category_name: categoryName,
        request_count: 0,
      });
    }
    
    const categoryData = categoryCountMap.get(categoryId);
    categoryData.request_count += 1;
  });

  // Convert map to array and sort
  const result = Array.from(categoryCountMap.values())
    .sort((a, b) => b.request_count - a.request_count); // Sort by count descending

  return result;
};

module.exports = {
  getRequestsByTeam,
  getRequestsByEquipmentCategory,
};


