const prisma = require('../prisma/client');
const { getUserTeams, getEquipmentFilter } = require('./rbac.service');

/**
 * KPI Service
 * Calculate dashboard KPI values based on user role
 */

/**
 * Calculate critical equipment count
 * @param {string} userId - User ID
 * @returns {Promise<object>} Critical equipment data
 */
const calculateCriticalEquipment = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teamMemberships: true },
  });

  let where = {
    OR: [
      { health_score: { lt: 30, not: null } },
      { status: 'scrapped' },
    ],
  };

  // Apply role-based filtering
  const equipmentFilter = await getEquipmentFilter(userId);
  where = { ...where, ...equipmentFilter };

  const count = await prisma.equipment.count({ where });

  return {
    count,
    threshold: 30,
    description: 'Units (Health < 30%)',
    teamOnly: user.role === 'technician',
  };
};

/**
 * Calculate technician workload
 * @param {string} userId - User ID
 * @returns {Promise<object>} Workload data
 */
const calculateTechnicianLoad = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teamMemberships: true },
  });

  const AVAILABLE_HOURS_PER_WEEK = 40;

  // Get all technicians based on role
  let technicianIds = [];

  if (user.role === 'admin' || user.role === 'manager') {
    // Get all technicians
    const allTechs = await prisma.user.findMany({
      where: {
        role: { in: ['technician', 'manager'] },
      },
      select: { id: true },
    });
    technicianIds = allTechs.map((t) => t.id);
  } else if (user.role === 'technician') {
    // Technicians only see their own load
    technicianIds = [userId];
  }

  if (technicianIds.length === 0) {
    return {
      percentage: 0,
      status: 'low',
      description: 'No Load',
    };
  }

  // Calculate total assigned hours
  const requests = await prisma.maintenanceRequest.findMany({
    where: {
      assigned_technician_id: { in: technicianIds },
      state: { in: ['new', 'in_progress'] },
      duration_hours: { not: null },
    },
    select: {
      duration_hours: true,
    },
  });

  const totalAssignedHours = requests.reduce(
    (sum, req) => sum + (req.duration_hours || 0),
    0
  );

  const totalAvailableHours = technicianIds.length * AVAILABLE_HOURS_PER_WEEK;
  const loadPercentage = Math.round((totalAssignedHours / totalAvailableHours) * 100);

  // Determine status
  let status = 'low';
  let description = 'Good Capacity';
  
  if (loadPercentage >= 80) {
    status = 'high';
    description = 'Assign Carefully';
  } else if (loadPercentage >= 60) {
    status = 'medium';
    description = 'Moderate Load';
  }

  const result = {
    percentage: loadPercentage,
    status,
    description,
  };

  return result;
};

/**
 * Calculate open and overdue requests
 * @param {string} userId - User ID
 * @returns {Promise<object>} Requests data
 */
const calculateOpenRequests = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teamMemberships: true },
  });

  let where = {};

  // Apply role-based filtering
  if (user.role === 'portal') {
    where.created_by = userId;
  } else if (user.role === 'technician') {
    // Technicians only see their assigned requests
    where.assigned_technician_id = userId;
  }

  // Count pending (new + in_progress)
  const pending = await prisma.maintenanceRequest.count({
    where: {
      ...where,
      state: { in: ['new', 'in_progress'] },
    },
  });

  // Count overdue preventive maintenance
  const overdue = await prisma.maintenanceRequest.count({
    where: {
      ...where,
      type: 'preventive',
      scheduled_date: { lt: new Date() },
      state: { not: 'repaired' },
    },
  });

  return {
    pending,
    overdue,
    teamOnly: user.role === 'technician',
  };
};

/**
 * Get all KPIs for a user
 * @param {string} userId - User ID
 * @returns {Promise<object>} All KPI data
 */
const getKPIsForUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // Portal users get different KPIs
  if (user.role === 'portal') {
    const myRequests = await prisma.maintenanceRequest.groupBy({
      by: ['state'],
      where: {
        created_by: userId,
      },
      _count: true,
    });

    const counts = {
      total: 0,
      new: 0,
      in_progress: 0,
      completed: 0,
    };

    myRequests.forEach((group) => {
      counts.total += group._count;
      if (group.state === 'new') counts.new = group._count;
      if (group.state === 'in_progress') counts.in_progress = group._count;
      if (group.state === 'repaired') counts.completed = group._count;
    });

    return {
      myRequests: counts,
    };
  }

  // Admin, manager, technician get full dashboard
  const [criticalEquipment, technicianLoad, openRequests] = await Promise.all([
    calculateCriticalEquipment(userId),
    calculateTechnicianLoad(userId),
    calculateOpenRequests(userId),
  ]);

  return {
    criticalEquipment,
    technicianLoad,
    openRequests,
  };
};

/**
 * Get critical equipment details
 * @param {string} userId - User ID
 * @returns {Promise<array>} Critical equipment list
 */
const getCriticalEquipmentDetails = async (userId) => {
  const equipmentFilter = await getEquipmentFilter(userId);

  const criticalEquipment = await prisma.equipment.findMany({
    where: {
      ...equipmentFilter,
      OR: [
        { health_score: { lt: 30, not: null } },
        { status: 'scrapped' },
      ],
    },
    include: {
      maintenanceTeam: {
        select: {
          name: true,
        },
      },
      maintenanceRequests: {
        where: {
          type: 'corrective',
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 1,
        select: {
          created_at: true,
        },
      },
    },
    orderBy: {
      health_score: 'asc',
    },
  });

  // Add recent issues count
  const equipmentWithIssues = await Promise.all(
    criticalEquipment.map(async (equip) => {
      const issueCount = await prisma.maintenanceRequest.count({
        where: {
          equipment_id: equip.id,
          type: 'corrective',
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      return {
        id: equip.id,
        name: equip.name,
        serial_number: equip.serial_number,
        department: equip.department,
        health_score: equip.health_score,
        status: equip.status,
        location: equip.location,
        maintenanceTeam: equip.maintenanceTeam,
        recentIssues: issueCount,
        lastMaintenance: equip.maintenanceRequests[0]?.created_at || null,
      };
    })
  );

  return equipmentWithIssues;
};

/**
 * Get technician workload breakdown
 * @param {string} userId - User ID
 * @returns {Promise<object>} Detailed workload data
 */
const getTechnicianLoadDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teamMemberships: true },
  });

  const AVAILABLE_HOURS_PER_WEEK = 40;

  // Get technicians based on role
  let technicians = [];

  if (user.role === 'admin' || user.role === 'manager') {
    technicians = await prisma.user.findMany({
      where: {
        role: { in: ['technician', 'manager'] },
      },
      include: {
        teamMemberships: {
          include: {
            team: true,
          },
        },
      },
    });
  } else if (user.role === 'technician') {
    const teamIds = user.teamMemberships.map((tm) => tm.team_id);
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        team_id: { in: teamIds },
      },
      include: {
        user: {
          select: {
            id: true,
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

    technicians = teamMembers.map((tm) => ({
      ...tm.user,
      teamMemberships: [{ team: tm.team }],
    }));
  }

  // Calculate load for each technician
  const byTechnician = await Promise.all(
    technicians.map(async (tech) => {
      const requests = await prisma.maintenanceRequest.findMany({
        where: {
          assigned_technician_id: tech.id,
          state: { in: ['new', 'in_progress'] },
        },
        select: {
          duration_hours: true,
        },
      });

      const assignedHours = requests.reduce(
        (sum, req) => sum + (req.duration_hours || 0),
        0
      );

      const loadPercentage = Math.round(
        (assignedHours / AVAILABLE_HOURS_PER_WEEK) * 100
      );

      const activeRequests = requests.length;

      return {
        id: tech.id,
        name: tech.name,
        team: tech.teamMemberships[0]?.team?.name || 'No Team',
        assignedHours,
        availableHours: AVAILABLE_HOURS_PER_WEEK,
        loadPercentage,
        activeRequests,
      };
    })
  );

  // Calculate by team
  const teamMap = new Map();

  byTechnician.forEach((tech) => {
    if (!teamMap.has(tech.team)) {
      teamMap.set(tech.team, { totalLoad: 0, count: 0 });
    }
    const teamData = teamMap.get(tech.team);
    teamData.totalLoad += tech.loadPercentage;
    teamData.count += 1;
  });

  const byTeam = Array.from(teamMap.entries()).map(([teamName, data]) => ({
    teamName,
    averageLoad: Math.round(data.totalLoad / data.count),
    members: data.count,
  }));

  // Overall stats
  const totalTechnicians = byTechnician.length;
  const averageLoad =
    totalTechnicians > 0
      ? Math.round(
          byTechnician.reduce((sum, t) => sum + t.loadPercentage, 0) /
            totalTechnicians
        )
      : 0;

  const availableCapacity = byTechnician.filter((t) => t.loadPercentage < 80).length;

  return {
    overall: {
      averageLoad,
      totalTechnicians,
      availableCapacity,
    },
    byTechnician,
    byTeam,
  };
};

module.exports = {
  calculateCriticalEquipment,
  calculateTechnicianLoad,
  calculateOpenRequests,
  getKPIsForUser,
  getCriticalEquipmentDetails,
  getTechnicianLoadDetails,
};


