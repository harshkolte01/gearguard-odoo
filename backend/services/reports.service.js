const prisma = require('../prisma/client');

/**
 * Reports Service
 * Aggregate maintenance request data for reporting and analytics
 */

/**
 * Get maintenance requests grouped by team
 * @param {string|object} userOrUserId - User object or User ID string
 * @param {object} filters - Optional filters (startDate, endDate, state)
 * @returns {Promise<array>} Array of team data with request counts
 */
const getRequestsByTeam = async (userOrUserId, filters = {}) => {
  // Get user to check role (use cached if provided)
  let user = userOrUserId;
  
  // Otherwise fetch user (backward compatibility)
  if (typeof userOrUserId === 'string') {
    user = await prisma.user.findUnique({
      where: { id: userOrUserId },
      select: { role: true, id: true },
    });
  }

  // Build where clause with filters
  const where = {};

  // Apply role-based filtering
  // Admins and managers see all requests
  if (user.role === 'technician') {
    // Technicians should not access this, but if they do, limit to their teams
    // Use cached teamMemberships if available, otherwise fetch
    let teamIds;
    if (user.teamMemberships) {
      teamIds = user.teamMemberships.map((tm) => tm.team_id);
    } else {
      const teamMemberships = await prisma.teamMember.findMany({
        where: { user_id: user.id },
        select: { team_id: true },
      });
      teamIds = teamMemberships.map((tm) => tm.team_id);
    }
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
 * @param {string|object} userOrUserId - User object or User ID string
 * @param {object} filters - Optional filters (startDate, endDate, state)
 * @returns {Promise<array>} Array of category data with request counts
 */
const getRequestsByEquipmentCategory = async (userOrUserId, filters = {}) => {
  // Get user to check role (use cached if provided)
  let user = userOrUserId;
  
  // Otherwise fetch user (backward compatibility)
  if (typeof userOrUserId === 'string') {
    user = await prisma.user.findUnique({
      where: { id: userOrUserId },
      select: { role: true, id: true },
    });
  }

  // Build where clause with filters
  const where = {
    category: 'equipment', // Only include equipment requests, not work center requests
    equipment_id: { not: null }, // Must have equipment
  };

  // Apply role-based filtering
  if (user.role === 'technician') {
    // Technicians should not access this, but if they do, limit to their teams
    // Use cached teamMemberships if available, otherwise fetch
    let teamIds;
    if (user.teamMemberships) {
      teamIds = user.teamMemberships.map((tm) => tm.team_id);
    } else {
      const teamMemberships = await prisma.teamMember.findMany({
        where: { user_id: user.id },
        select: { team_id: true },
      });
      teamIds = teamMemberships.map((tm) => tm.team_id);
    }
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

  // Build dynamic SQL query for efficient aggregation
  // This is much more efficient than loading all records into memory
  let sql = `
    SELECT 
      e.category_id,
      COALESCE(ec.name, 'Uncategorized') as category_name,
      COUNT(mr.id)::int as request_count
    FROM maintenance_requests mr
    INNER JOIN equipment e ON mr.equipment_id = e.id
    LEFT JOIN equipment_categories ec ON e.category_id = ec.id
    WHERE mr.category = 'equipment'
      AND mr.equipment_id IS NOT NULL
  `;

  const params = [];

  // Add role-based team filter
  if (user.role === 'technician' && where.team_id?.in) {
    sql += ` AND mr.team_id = ANY($${params.length + 1})`;
    params.push(where.team_id.in);
  }

  // Add date filters
  if (where.created_at?.gte) {
    sql += ` AND mr.created_at >= $${params.length + 1}`;
    params.push(where.created_at.gte);
  }

  if (where.created_at?.lte) {
    sql += ` AND mr.created_at <= $${params.length + 1}`;
    params.push(where.created_at.lte);
  }

  // Add state filter
  if (where.state?.in) {
    sql += ` AND mr.state = ANY($${params.length + 1})`;
    params.push(where.state.in);
  }

  sql += `
    GROUP BY e.category_id, ec.name
    ORDER BY request_count DESC
  `;

  const result = await prisma.$queryRawUnsafe(sql, ...params);

  return result;
};

module.exports = {
  getRequestsByTeam,
  getRequestsByEquipmentCategory,
};


