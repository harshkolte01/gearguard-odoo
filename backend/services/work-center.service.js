const prisma = require('../prisma/client');

/**
 * Work Center Service
 * Business logic for work centers
 */

/**
 * Get all work centers with optional filtering
 * @param {object} filters - Filter options
 * @returns {Promise<object[]>} Array of work centers
 */
const getWorkCenters = async (filters = {}) => {
  const { search, team_id } = filters;

  const where = {};

  // Apply search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Apply team filter
  if (team_id) {
    where.default_team_id = team_id;
  }

  const workCenters = await prisma.workCenter.findMany({
    where,
    include: {
      defaultTeam: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return workCenters;
};

/**
 * Get single work center by ID
 * @param {string} workCenterId - Work Center ID
 * @returns {Promise<object>} Work center details
 */
const getWorkCenterById = async (workCenterId) => {
  const workCenter = await prisma.workCenter.findUnique({
    where: { id: workCenterId },
    include: {
      defaultTeam: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!workCenter) {
    throw new Error('Work center not found');
  }

  return workCenter;
};

/**
 * Auto-fill team from work center
 * @param {string} workCenterId - Work Center ID
 * @returns {Promise<object>} Auto-filled data
 */
const autoFillFromWorkCenter = async (workCenterId) => {
  const workCenter = await prisma.workCenter.findUnique({
    where: { id: workCenterId },
    include: {
      defaultTeam: { select: { id: true, name: true } },
    },
  });

  if (!workCenter) {
    throw new Error('Work center not found');
  }

  // Validate that work center has a default team
  if (!workCenter.default_team_id) {
    throw new Error(`Work center "${workCenter.name}" does not have a default maintenance team assigned. Please contact an administrator to configure the work center before creating requests.`);
  }

  return {
    team_id: workCenter.default_team_id,
    team: workCenter.defaultTeam,
    work_center_id: workCenter.id,
    workCenter: {
      id: workCenter.id,
      name: workCenter.name,
      code: workCenter.code,
    },
  };
};

module.exports = {
  getWorkCenters,
  getWorkCenterById,
  autoFillFromWorkCenter,
};

