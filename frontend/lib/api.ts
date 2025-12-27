import { tokenStorage } from './auth';
import type { 
  DashboardKPIs, 
  CriticalEquipmentDetail, 
  TechnicianLoadData, 
  DashboardRequestsResponse,
  MaintenanceRequest,
  User,
  EquipmentListResponse,
  CalendarData,
  Technician,
  EquipmentDetail,
  EquipmentCategory,
  CreateCategoryData,
  UpdateCategoryData,
  Team,
  TechnicianDetail,
  CreateTechnicianData,
  UpdateTechnicianTeamsData,
  AdminTeam,
  AdminTechnicianListResponse
} from './types';

// Re-export tokenStorage for convenience
export { tokenStorage };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  public errors?: Array<{ field: string; message: string }>;
  
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: string,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    // Handle 401 - redirect to login
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        tokenStorage.remove();
        window.location.href = '/login';
      }
      throw new ApiError(401, 'UNAUTHORIZED', 'Session expired. Please login again.');
    }

    // Handle other errors
    if (!response.ok || !data.success) {
      const error = data.error || { code: 'UNKNOWN_ERROR', message: 'An error occurred' };
      throw new ApiError(
        response.status,
        error.code,
        error.message,
        error.details
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Unable to connect to server. Please check your connection.',
      error instanceof Error ? error.message : undefined
    );
  }
}

// Auth API (no token required)
async function fetchNoAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data.error || data;
      throw new ApiError(
        response.status,
        error.code || 'ERROR',
        error.message || data.message || 'An error occurred',
        error.details,
        data.errors // Pass validation errors if present
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Unable to connect to server. Please check your connection.',
      error instanceof Error ? error.message : undefined
    );
  }
}

// Auth API Client (no authentication required)
export const authApi = {
  login: (data: { email: string; password: string }) =>
    fetchNoAuth<{ success: boolean; message: string; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  signup: (data: { name: string; email: string; password: string }) =>
    fetchNoAuth<{ success: boolean; message: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: { email: string }) =>
    fetchNoAuth<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Dashboard API Client (requires authentication)
export const api = {
  // Dashboard KPIs
  getDashboardKPIs: () => 
    fetchWithAuth<DashboardKPIs>('/api/dashboard/kpis'),

  // Critical Equipment
  getCriticalEquipment: () => 
    fetchWithAuth<CriticalEquipmentDetail[]>('/api/dashboard/critical-equipment'),

  // Technician Load
  getTechnicianLoad: () => 
    fetchWithAuth<TechnicianLoadData>('/api/dashboard/technician-load'),

  // Dashboard Requests
  getDashboardRequests: (params: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
    type?: string;
    team_id?: string;
    equipment_id?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/dashboard/requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchWithAuth<DashboardRequestsResponse>(endpoint);
  },

  // Maintenance Requests
  getMaintenanceRequests: (params: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
    type?: string;
    equipment_id?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/maintenance-requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchWithAuth<DashboardRequestsResponse>(endpoint);
  },

  createMaintenanceRequest: (data: {
    subject: string;
    description?: string;
    category?: 'equipment' | 'work_center';
    equipment_id?: string;
    work_center_id?: string;
    type: 'corrective' | 'preventive';
    scheduled_date?: string;
  }) =>
    fetchWithAuth<MaintenanceRequest>('/api/maintenance-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMaintenanceRequest: (id: string) =>
    fetchWithAuth<MaintenanceRequest>(`/api/maintenance-requests/${id}`),

  updateRequestState: (
    id: string,
    data: {
      state: string;
      assigned_technician_id?: string;
      duration_hours?: number;
    }
  ) =>
    fetchWithAuth<MaintenanceRequest>(`/api/maintenance-requests/${id}/state`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteRequest: (id: string) =>
    fetchWithAuth<void>(`/api/maintenance-requests/${id}`, {
      method: 'DELETE',
    }),

  // Equipment
  getEquipment: (params: {
    search?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/equipment${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchWithAuth<EquipmentListResponse>(endpoint);
  },

  getEquipmentById: (id: string) =>
    fetchWithAuth<EquipmentDetail>(`/api/equipment/${id}`),

  // Equipment Categories
  getEquipmentCategories: () =>
    fetchWithAuth<EquipmentCategory[]>('/api/equipment-categories'),

  getEquipmentCategoryById: (id: string) =>
    fetchWithAuth<EquipmentCategory>(`/api/equipment-categories/${id}`),

  createEquipmentCategory: (data: CreateCategoryData) =>
    fetchWithAuth<EquipmentCategory>('/api/equipment-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEquipmentCategory: (id: string, data: UpdateCategoryData) =>
    fetchWithAuth<EquipmentCategory>(`/api/equipment-categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteEquipmentCategory: (id: string) =>
    fetchWithAuth<{ success: boolean; message: string }>(`/api/equipment-categories/${id}`, {
      method: 'DELETE',
    }),

  // Calendar
  getCalendarScheduled: (params: {
    month: number;
    year: number;
    technician_id?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/api/calendar/scheduled?${queryParams.toString()}`;
    return fetchWithAuth<CalendarData>(endpoint);
  },

  getCalendarTechnicians: () =>
    fetchWithAuth<Technician[]>('/api/calendar/technicians'),

  // Teams
  getTeams: () =>
    fetchWithAuth<Team[]>('/api/teams'),

  // Admin APIs
  getTechnicians: () =>
    fetchWithAuth<AdminTechnicianListResponse>('/api/admin/technicians'),

  createTechnician: (data: CreateTechnicianData) =>
    fetchWithAuth<TechnicianDetail>('/api/admin/technicians', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTechnicianById: (id: string) =>
    fetchWithAuth<TechnicianDetail>(`/api/admin/technicians/${id}`),

  updateTechnicianTeams: (id: string, data: UpdateTechnicianTeamsData) =>
    fetchWithAuth<TechnicianDetail>(`/api/admin/technicians/${id}/teams`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getAdminTeams: () =>
    fetchWithAuth<AdminTeam[]>('/api/admin/teams'),
};
