import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type {
  DashboardKPIs,
  CriticalEquipmentDetail,
  TechnicianLoadData,
  DashboardRequestsResponse,
  RequestFilters,
} from '../types';

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook for Dashboard KPIs with auto-refresh
export function useDashboardKPIs(enabled = true, autoRefresh = true, interval = 60000): UseDataResult<DashboardKPIs> {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const result = await api.getDashboardKPIs();
      setData(result);
    } catch (err: any) {
      // Only set error for non-permission issues
      if (err.code !== 'FORBIDDEN') {
        setError(err.message || 'Failed to fetch KPIs');
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    fetchData();

    if (autoRefresh) {
      const intervalId = setInterval(fetchData, interval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, autoRefresh, interval, enabled]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for Critical Equipment
export function useCriticalEquipment(): UseDataResult<CriticalEquipmentDetail[]> {
  const [data, setData] = useState<CriticalEquipmentDetail[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getCriticalEquipment();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch critical equipment');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for Technician Load
export function useTechnicianLoad(): UseDataResult<TechnicianLoadData> {
  const [data, setData] = useState<TechnicianLoadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getTechnicianLoad();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch technician load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for Dashboard Requests with filtering
export function useDashboardRequests(
  filters: Partial<RequestFilters>,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseDataResult<DashboardRequestsResponse> & { setPage: (page: number) => void } {
  const [data, setData] = useState<DashboardRequestsResponse | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await api.getDashboardRequests({
        page: currentPage,
        limit,
        search: filters.search,
        state: filters.state?.join(','),
        type: filters.type,
        team_id: filters.team_id,
        equipment_id: filters.equipment_id,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });
      setData(result);
    } catch (err: any) {
      // Only set error for non-permission issues
      if (err.code !== 'FORBIDDEN') {
        setError(err.message || 'Failed to fetch requests');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, limit, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setPage: setCurrentPage,
  };
}

// Hook for Portal Users - fetch their own maintenance requests  
export function useMyMaintenanceRequests(
  filters: Partial<RequestFilters>,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseDataResult<DashboardRequestsResponse> & { setPage: (page: number) => void } {
  const [data, setData] = useState<DashboardRequestsResponse | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await api.getMaintenanceRequests({
        page: currentPage,
        limit,
        search: filters.search,
        state: filters.state?.join(','),
        type: filters.type,
        equipment_id: filters.equipment_id,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });
      setData(result);
    } catch (err: any) {
      // Only set error for non-permission issues
      if (err.code !== 'FORBIDDEN') {
        setError(err.message || 'Failed to fetch your requests');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, limit, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setPage: setCurrentPage,
  };
}

// Hook for managing request filters
export function useRequestFilters() {
  const [filters, setFilters] = useState<RequestFilters>({
    search: '',
    state: [],
    type: '',
    category: '',
    team_id: '',
    equipment_id: undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const updateFilter = useCallback((key: keyof RequestFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      state: [],
      type: '',
      category: '',
      team_id: '',
      equipment_id: undefined,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  }, []);

  return { filters, updateFilter, resetFilters };
}

// Hook for updating request state (for Kanban drag-and-drop)
export function useUpdateRequestState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback(async (requestId: string, newState: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateRequestState(requestId, { state: newState });
    } catch (err: any) {
      setError(err.message || 'Failed to update request state');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateState, loading, error };
}

