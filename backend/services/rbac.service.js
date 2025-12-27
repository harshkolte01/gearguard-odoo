const prisma = require('../prisma/client');

/**
 * Role-Based Access Control Service
 * Handles user permissions and team access
 */

/**
 * Get all teams a user belongs to
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} Array of team IDs
 */
const getUserTeams = async (userId) => {
  const teamMemberships = await prisma.teamMember.findMany({
    where: { user_id: userId },
    select: { team_id: true },
  });

  return teamMemberships.map((tm) => tm.team_id);
};

/**
 * Check if user can access a specific request
 * @param {string} userId - User ID
 * @param {string} requestId - Maintenance Request ID
 * @returns {Promise<boolean>}
 */
const canAccessRequest = async (userId, requestId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // Admins and managers can access all requests
  if (user.role === 'admin' || user.role === 'manager') {
    return true;
  }

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    select: { 
      team_id: true, 
      created_by: true,
    },
  });

  if (!request) {
    return false;
  }

  // Portal users can only access their own requests
  if (user.role === 'portal') {
    return request.created_by === userId;
  }

  // Technicians can access requests from their teams
  if (user.role === 'technician') {
    const userTeams = await getUserTeams(userId);
    return userTeams.includes(request.team_id);
  }

  return false;
};

/**
 * Filter query based on user role and team membership
 * @param {string} userId - User ID
 * @param {object} baseWhere - Base Prisma where clause
 * @returns {Promise<object>} Modified where clause with role-based filters
 */
const filterByUserRole = async (userId, baseWhere = {}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teamMemberships: true },
  });

  // Admins and managers see everything
  if (user.role === 'admin' || user.role === 'manager') {
    return baseWhere;
  }

  // Portal users only see their own equipment requests (not work center requests)
  if (user.role === 'portal') {
    return {
      ...baseWhere,
      created_by: userId,
      category: 'equipment', // Portal users cannot see work center requests
    };
  }

  // Technicians see requests from their teams
  if (user.role === 'technician') {
    const teamIds = user.teamMemberships.map(tm => tm.team_id);
    
    if (teamIds.length === 0) {
      // No requests if not in any team
      return {
        ...baseWhere,
        id: { in: [] },
      };
    }
    
    return {
      ...baseWhere,
      team_id: { in: teamIds },
    };
  }

  return baseWhere;
};

/**
 * Get user teams for equipment filtering
 * @param {string} userId - User ID
 * @returns {Promise<object>} Team filter for equipment queries
 */
const getEquipmentFilter = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teamMemberships: true },
  });

  // Admins and managers see all equipment
  if (user.role === 'admin' || user.role === 'manager') {
    return {};
  }

  // Portal users can see equipment assigned to them OR all active equipment
  // This allows them to create requests even if they don't own equipment
  if (user.role === 'portal') {
    return {
      OR: [
        { employee_owner_id: userId },
        { status: 'active' }, // Allow viewing all active equipment for request creation
      ],
    };
  }

  // Technicians see equipment from their teams
  if (user.role === 'technician') {
    const teamIds = user.teamMemberships.map(tm => tm.team_id);
    
    if (teamIds.length === 0) {
      // No equipment if not in any team
      return { id: { in: [] } };
    }
    
    return {
      maintenance_team_id: { in: teamIds },
    };
  }

  // Default: no equipment
  return { id: { in: [] } };
};

/**
 * Check if user can create work center requests
 * @param {object} user - User object with role
 * @returns {boolean}
 */
const canCreateWorkCenterRequest = (user) => {
  // Portal users cannot create work center requests
  // Only admin, manager, and technician can
  return ['admin', 'manager', 'technician'].includes(user.role);
};

/**
 * Check if user has specific role(s)
 * @param {object} user - User object with role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
const hasRole = (user, allowedRoles) => {
  return allowedRoles.includes(user.role);
};

/**
 * Check if user is in a specific team
 * @param {string} userId - User ID
 * @param {string} teamId - Team ID
 * @returns {Promise<boolean>}
 */
const isInTeam = async (userId, teamId) => {
  const membership = await prisma.teamMember.findFirst({
    where: {
      user_id: userId,
      team_id: teamId,
    },
  });

  return !!membership;
};

module.exports = {
  getUserTeams,
  canAccessRequest,
  canCreateWorkCenterRequest,
  filterByUserRole,
  getEquipmentFilter,
  hasRole,
  isInTeam,
};


