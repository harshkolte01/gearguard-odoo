import { tokenStorage } from '../auth';
import type { ReportFilters, TeamReportData, CategoryReportData } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch requests grouped by team
 */
export const fetchRequestsByTeam = async (filters?: ReportFilters): Promise<TeamReportData[]> => {
  const token = tokenStorage.get();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Build query params
  const params = new URLSearchParams();
  if (filters?.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters?.endDate) {
    params.append('endDate', filters.endDate);
  }
  if (filters?.state && filters.state.length > 0) {
    params.append('state', filters.state.join(','));
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/reports/requests-by-team${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch team report data');
  }

  const result = await response.json();
  return result.data;
};

/**
 * Fetch requests grouped by equipment category
 */
export const fetchRequestsByCategory = async (filters?: ReportFilters): Promise<CategoryReportData[]> => {
  const token = tokenStorage.get();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Build query params
  const params = new URLSearchParams();
  if (filters?.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters?.endDate) {
    params.append('endDate', filters.endDate);
  }
  if (filters?.state && filters.state.length > 0) {
    params.append('state', filters.state.join(','));
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/reports/requests-by-category${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch category report data');
  }

  const result = await response.json();
  return result.data;
};

