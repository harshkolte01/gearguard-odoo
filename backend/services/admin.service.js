const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');

/**
 * Admin Service
 * Business logic for admin operations: technician management and team assignments
 */

/**
 * Get all technicians and managers with their team memberships
 * @returns {Promise<Object[]>} Array of technicians with team details
 */
const getAllTechnicians = async () => {
  try {
    const technicians = await prisma.user.findMany({
      where: {
        role: {
          in: ['technician', 'manager'],
        },
      },
      include: {
        teamMemberships: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            assignedRequests: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Format the response to flatten team memberships
    const formattedTechnicians = technicians.map((tech) => ({
      id: tech.id,
      name: tech.name,
      email: tech.email,
      role: tech.role,
      created_at: tech.created_at,
      teams: tech.teamMemberships.map((tm) => tm.team),
      assignedRequestsCount: tech._count.assignedRequests,
    }));

    // Get stats
    const stats = await getAdminStats();

    return {
      technicians: formattedTechnicians,
      stats,
    };
  } catch (error) {
    throw new Error(`Error fetching technicians: ${error.message}`);
  }
};

/**
 * Get a single technician by ID with detailed information
 * @param {string} technicianId - Technician user ID
 * @returns {Promise<Object>} Technician details
 */
const getTechnicianById = async (technicianId) => {
  try {
    const technician = await prisma.user.findUnique({
      where: { id: technicianId },
      include: {
        teamMemberships: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        assignedRequests: {
          select: {
            id: true,
            title: true,
            state: true,
            priority: true,
            created_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 10, // Return latest 10 requests
        },
        _count: {
          select: {
            assignedRequests: true,
          },
        },
      },
    });

    if (!technician) {
      throw new Error('Technician not found');
    }

    // Only allow fetching technicians and managers
    if (!['technician', 'manager'].includes(technician.role)) {
      throw new Error('User is not a technician or manager');
    }

    // Format the response
    return {
      id: technician.id,
      name: technician.name,
      email: technician.email,
      role: technician.role,
      created_at: technician.created_at,
      teams: technician.teamMemberships.map((tm) => tm.team),
      assignedRequests: technician.assignedRequests,
      assignedRequestsCount: technician._count.assignedRequests,
    };
  } catch (error) {
    throw new Error(`Error fetching technician: ${error.message}`);
  }
};

/**
 * Create a new technician or manager
 * @param {Object} data - User data { name, email, password, role }
 * @returns {Promise<Object>} Created technician
 */
const createTechnician = async (data) => {
  try {
    const { name, email, password, role } = data;

    // Validate role
    if (!['technician', 'manager'].includes(role)) {
      throw new Error('Role must be technician or manager');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email Id should not be a duplicate in database');
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create technician
    const technician = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return technician;
  } catch (error) {
    throw new Error(`Error creating technician: ${error.message}`);
  }
};

/**
 * Update technician's team assignments
 * @param {string} technicianId - Technician user ID
 * @param {string[]} teamIds - Array of team IDs to assign
 * @returns {Promise<Object>} Updated technician with team memberships
 */
const updateTechnicianTeams = async (technicianId, teamIds) => {
  try {
    // Verify technician exists and has correct role
    const technician = await prisma.user.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      throw new Error('Technician not found');
    }

    if (!['technician', 'manager'].includes(technician.role)) {
      throw new Error('User is not a technician or manager');
    }

    // Verify all team IDs exist
    if (teamIds.length > 0) {
      const teams = await prisma.team.findMany({
        where: {
          id: { in: teamIds },
        },
      });

      if (teams.length !== teamIds.length) {
        throw new Error('One or more team IDs are invalid');
      }
    }

    // Use transaction to ensure atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Remove all existing team memberships
      await tx.teamMember.deleteMany({
        where: { user_id: technicianId },
      });

      // Add new team memberships
      if (teamIds.length > 0) {
        await tx.teamMember.createMany({
          data: teamIds.map((teamId) => ({
            user_id: technicianId,
            team_id: teamId,
          })),
        });
      }

      // Fetch updated technician with teams
      const updatedTechnician = await tx.user.findUnique({
        where: { id: technicianId },
        include: {
          teamMemberships: {
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return updatedTechnician;
    });

    // Format the response
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      teams: result.teamMemberships.map((tm) => tm.team),
    };
  } catch (error) {
    throw new Error(`Error updating technician teams: ${error.message}`);
  }
};

/**
 * Get all teams with member count (for admin overview)
 * @returns {Promise<Object[]>} Array of teams with statistics
 */
const getAdminTeams = async () => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: {
          select: {
            members: true,
          },
        },
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
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Format the response
    const formattedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      memberCount: team._count.members,
      members: team.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.user.role,
      })),
    }));

    return formattedTeams;
  } catch (error) {
    throw new Error(`Error fetching admin teams: ${error.message}`);
  }
};

/**
 * Get admin dashboard statistics
 * @returns {Promise<Object>} Statistics for admin dashboard
 */
const getAdminStats = async () => {
  try {
    const [technicianCount, managerCount, teamCount, unassignedCount] = await Promise.all([
      // Count technicians
      prisma.user.count({
        where: { role: 'technician' },
      }),
      // Count managers
      prisma.user.count({
        where: { role: 'manager' },
      }),
      // Count teams
      prisma.team.count(),
      // Count technicians/managers without team assignments
      prisma.user.count({
        where: {
          role: {
            in: ['technician', 'manager'],
          },
          teamMemberships: {
            none: {},
          },
        },
      }),
    ]);

    return {
      technicianCount,
      managerCount,
      teamCount,
      unassignedCount,
      totalStaff: technicianCount + managerCount,
    };
  } catch (error) {
    throw new Error(`Error fetching admin statistics: ${error.message}`);
  }
};

module.exports = {
  getAllTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnicianTeams,
  getAdminTeams,
  getAdminStats,
};


