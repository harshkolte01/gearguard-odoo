const kpiService = require('../services/kpi.service');
const maintenanceRequestService = require('../services/maintenance-request.service');

/**
 * Dashboard Controller
 * Handle HTTP requests for dashboard data
 */

/**
 * Get all KPIs for the dashboard
 * GET /api/dashboard/kpis
 */
const getKPIs = async (req, res) => {
  try {
    const kpis = await kpiService.getKPIsForUser(req.user.id);

    res.json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    console.error('Get KPIs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to calculate KPIs',
      },
    });
  }
};

/**
 * Get critical equipment details
 * GET /api/dashboard/critical-equipment
 */
const getCriticalEquipment = async (req, res) => {
  try {
    const equipment = await kpiService.getCriticalEquipmentDetails(req.user.id);

    res.json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    console.error('Get critical equipment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get critical equipment',
      },
    });
  }
};

/**
 * Get technician workload breakdown
 * GET /api/dashboard/technician-load
 */
const getTechnicianLoad = async (req, res) => {
  try {
    const workload = await kpiService.getTechnicianLoadDetails(req.user.id);

    res.json({
      success: true,
      data: workload,
    });
  } catch (error) {
    console.error('Get technician load error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to calculate technician load',
      },
    });
  }
};

/**
 * Get recent requests for dashboard table
 * GET /api/dashboard/requests
 */
const getRequests = async (req, res) => {
  try {
    const { page, limit, search, state, type, team_id, sort_by, sort_order } = req.query;

    const filters = {
      search,
      state,
      type,
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
    console.error('Get dashboard requests error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get requests',
      },
    });
  }
};

/**
 * Get equipment list with filters
 * GET /api/equipment
 */
const getEquipment = async (req, res) => {
  try {
    const prisma = require('../prisma/client');
    const { getEquipmentFilter } = require('../services/rbac.service');
    
    const { search, department, status, page = 1, limit = 100 } = req.query;

    // Get user-specific equipment filter
    const userFilter = await getEquipmentFilter(req.user.id);

    // Build where clause
    const where = {
      ...userFilter,
      ...(status && { status }),
      ...(department && { department }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { serial_number: { contains: search, mode: 'insensitive' } },
          { department: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Fetch equipment with pagination
    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        select: {
          id: true,
          name: true,
          serial_number: true,
          department: true,
          location: true,
          status: true,
          health_score: true,
          purchase_date: true,
          warranty_expiry: true,
          employee_owner_id: true,
          maintenance_team_id: true,
          default_technician_id: true,
          work_center_id: true,
          maintenanceTeam: {
            select: {
              id: true,
              name: true,
            },
          },
          defaultTechnician: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          workCenter: {
            select: {
              id: true,
              name: true,
            },
          },
          employeeOwner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.equipment.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        equipment,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get equipment',
      },
    });
  }
};

/**
 * Get single equipment details by ID
 * GET /api/equipment/:id
 */
const getEquipmentById = async (req, res) => {
  try {
    const prisma = require('../prisma/client');
    const { getEquipmentFilter } = require('../services/rbac.service');
    const { id } = req.params;

    // Get user-specific equipment filter
    const userFilter = await getEquipmentFilter(req.user.id);

    // Fetch equipment with full details
    const equipment = await prisma.equipment.findFirst({
      where: {
        id,
        ...userFilter
      },
      select: {
        id: true,
        name: true,
        serial_number: true,
        department: true,
        location: true,
        status: true,
        health_score: true,
        purchase_date: true,
        warranty_expiry: true,
        employee_owner_id: true,
        maintenance_team_id: true,
        default_technician_id: true,
        work_center_id: true,
        employeeOwner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        maintenanceTeam: {
          select: {
            id: true,
            name: true,
          },
        },
        defaultTechnician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        workCenter: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        maintenanceRequests: {
          select: {
            id: true,
            subject: true,
            state: true,
            type: true,
            created_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Equipment not found',
          details: 'The requested equipment does not exist or you do not have access to it',
        },
      });
    }

    res.json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get equipment details',
      },
    });
  }
};

/**
 * Get maintenance requests for specific equipment
 * GET /api/equipment/:id/maintenance-requests
 */
const getEquipmentMaintenanceRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const { state, page = 1, limit = 20 } = req.query;

    // Build state filter
    const stateFilter = state ? state : undefined;

    // Fetch requests for this equipment
    const result = await maintenanceRequestService.getRequestsForDashboard(
      req.user.id,
      { equipment_id: id, state: stateFilter },
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get equipment maintenance requests error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get equipment maintenance requests',
      },
    });
  }
};

module.exports = {
  getKPIs,
  getCriticalEquipment,
  getTechnicianLoad,
  getRequests,
  getEquipment,
  getEquipmentById,
  getEquipmentMaintenanceRequests,
};


