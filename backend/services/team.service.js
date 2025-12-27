const prisma = require('../prisma/client');

/**
 * Team Service
 * Business logic for teams with role-based access
 */

/**
 * Get teams based on user role
 * - Admin/Manager: Returns all teams
 * - Technician: Returns only teams where user is a member
 * @param {string} userId - User ID
 * @returns {Promise<object[]>} Array of teams with members
 */
const getTeams = async (userId) => {
  // Get user with role and team memberships
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      teamMemberships: {
        select: { team_id: true },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Determine which teams to fetch based on role
  let where = {};

  if (user.role === 'technician') {
    // Technicians only see teams they belong to
    const userTeamIds = user.teamMemberships.map((tm) => tm.team_id);
    
    if (userTeamIds.length === 0) {
      // If technician is not in any team, return empty array
      return [];
    }
    
    where = {
      id: { in: userTeamIds },
    };
  }
  // Admin and manager see all teams (no filter needed)

  // Fetch teams with members
  const teams = await prisma.team.findMany({
    where,
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          user: {
            name: 'asc',
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Transform the response to flatten team members
  const formattedTeams = teams.map((team) => ({
    id: team.id,
    name: team.name,
    members: team.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.user.role,
    })),
  }));

  return formattedTeams;
};

module.exports = {
  getTeams,
};


