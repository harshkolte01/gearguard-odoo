import { useState, useEffect, useCallback } from 'react';
import { fetchRequestsByTeam, fetchRequestsByCategory } from '../api/reports';
import type { ReportFilters, TeamReportData, CategoryReportData } from '../types';

/**
 * Hook to fetch requests grouped by team
 */
export const useRequestsByTeam = (filters?: ReportFilters, enabled = true) => {
  const [data, setData] = useState<TeamReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await fetchRequestsByTeam(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team report');
      console.error('Error fetching team report:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

/**
 * Hook to fetch requests grouped by equipment category
 */
export const useRequestsByCategory = (filters?: ReportFilters, enabled = true) => {
  const [data, setData] = useState<CategoryReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await fetchRequestsByCategory(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category report');
      console.error('Error fetching category report:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};


