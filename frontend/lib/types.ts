// Authentication Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'portal';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  email?: string;
}

export interface ErrorResponse {
  success: false;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type ApiResponse<T = AuthResponse> = T | ErrorResponse;

// Dashboard Types

export interface Equipment {
  id: string;
  name: string;
  serial_number: string;
  department: string;
  health_score: number;
  status: string;
  location?: string;
  maintenanceTeam?: {
    id: string;
    name: string;
  };
  defaultTechnician?: {
    id: string;
    name: string;
    email: string;
  };
  workCenter?: {
    id: string;
    name: string;
  };
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'portal';
}

export interface Technician {
  id: string;
  name: string;
  email: string;
}

export interface WorkCenter {
  id: string;
  name: string;
  code?: string;
  defaultTeam?: {
    id: string;
    name: string;
  };
}

export interface WorkCenterDetail extends WorkCenter {
  cost_per_hour?: number;
  capacity_efficiency?: number;
  oee_target?: number;
  default_team_id?: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: 'corrective' | 'preventive';
  state: 'new' | 'in_progress' | 'repaired' | 'scrap';
  category: 'equipment' | 'work_center';
  equipment?: {
    id: string;
    name: string;
    serial_number: string;
    department: string;
    location?: string;
  } | null;
  assignedTechnician?: {
    id: string;
    name: string;
    email: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  };
  team?: {
    id: string;
    name: string;
  };
  workCenter?: {
    id: string;
    name: string;
    code?: string;
  };
  scheduled_date?: string | null;
  duration_hours?: number | null;
  created_at: string;
}

// KPI Types

export interface CriticalEquipmentKPI {
  count: number;
  threshold: number;
  description?: string;
  teamOnly: boolean;
}

export interface TechnicianLoadKPI {
  percentage: number;
  status: 'low' | 'medium' | 'high';
  description?: string;
  myLoad?: number;
  teamAverage?: number;
}

export interface OpenRequestsKPI {
  pending: number;
  overdue: number;
  teamOnly: boolean;
}

export interface MyRequestsKPI {
  total: number;
  new: number;
  in_progress: number;
  completed: number;
}

export interface DashboardKPIs {
  criticalEquipment?: CriticalEquipmentKPI;
  technicianLoad?: TechnicianLoadKPI;
  openRequests?: OpenRequestsKPI;
  myRequests?: MyRequestsKPI;
}

// Critical Equipment Detail

export interface CriticalEquipmentDetail extends Equipment {
  maintenanceTeam?: {
    id: string;
    name: string;
  };
  recentIssues?: number;
  lastMaintenance?: string;
}

// Technician Workload

export interface TechnicianWorkload {
  id: string;
  name: string;
  team: string;
  assignedHours: number;
  availableHours: number;
  loadPercentage: number;
  activeRequests: number;
}

export interface TeamWorkload {
  teamName: string;
  averageLoad: number;
  members: number;
}

export interface TechnicianLoadData {
  overall: {
    averageLoad: number;
    totalTechnicians: number;
    availableCapacity: number;
  };
  byTechnician: TechnicianWorkload[];
  byTeam: TeamWorkload[];
}

// Filters and Pagination

export interface RequestFilters {
  search: string;
  state: string[];
  type: string;
  category: string;
  team_id: string;
  equipment_id?: string;
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardRequestsResponse {
  requests: MaintenanceRequest[];
  pagination: Pagination;
}

// Request Creation Types

export interface CreateRequestData {
  subject: string;
  description?: string;
  category?: 'equipment' | 'work_center';
  equipment_id?: string;
  work_center_id?: string;
  type: 'corrective' | 'preventive';
  scheduled_date?: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  _count?: {
    equipment: number;
  };
}

export interface EquipmentDetail {
  id: string;
  name: string;
  serial_number: string;
  department: string;
  location: string;
  status: 'active' | 'scrapped';
  health_score?: number;
  purchase_date?: string;
  warranty_expiry?: string;
  employee_owner_id?: string | null;
  category_id?: string | null;
  employeeOwner?: {
    id: string;
    name: string;
    email: string;
  } | null;
  maintenanceTeam?: {
    id: string;
    name: string;
  };
  defaultTechnician?: {
    id: string;
    name: string;
    email: string;
  } | null;
  workCenter?: {
    id: string;
    name: string;
    code?: string;
  } | null;
  category?: {
    id: string;
    name: string;
    description?: string;
  } | null;
  maintenanceRequests?: Array<{
    id: string;
    subject: string;
    state: string;
    type: string;
    created_at: string;
  }>;
}

export interface EquipmentListResponse {
  equipment: EquipmentDetail[];
  pagination?: Pagination;
}

export interface WorkCenterListResponse {
  workCenters: WorkCenterDetail[];
  pagination?: Pagination;
}

// Calendar Types

export interface ScheduledRequestsByDate {
  [date: string]: MaintenanceRequest[];
}

export interface CalendarData {
  month: number;
  year: number;
  requestsByDate: ScheduledRequestsByDate;
  totalRequests: number;
}

// Equipment Category Types
export interface CategoryListResponse {
  categories: EquipmentCategory[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

// Report Types

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  state?: string[];
}

export interface TeamReportData {
  team_id: string;
  team_name: string;
  request_count: number;
}

export interface CategoryReportData {
  category_id: string | null;
  category_name: string;
  request_count: number;
}

export interface TeamReportResponse {
  success: boolean;
  data: TeamReportData[];
}

export interface CategoryReportResponse {
  success: boolean;
  data: CategoryReportData[];
}

// Admin Types

export interface TechnicianDetail extends User {
  teams: Team[];
  assignedRequestsCount?: number;
  created_at: string;
}

export interface CreateTechnicianData {
  name: string;
  email: string;
  password: string;
  role: 'technician' | 'manager';
}

export interface UpdateTechnicianTeamsData {
  teamIds: string[];
}

export interface AdminTeam extends Team {
  memberCount: number;
}

export interface AdminStats {
  totalTechnicians: number;
  totalManagers: number;
  activeTeams: number;
  unassignedTechnicians: number;
}

export interface AdminTechnicianListResponse {
  technicians: TechnicianDetail[];
  stats: AdminStats;
}

