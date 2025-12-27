import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { CalendarData, Technician } from '../types';

interface UseCalendarDataResult {
  data: CalendarData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch scheduled maintenance requests for calendar view
 * @param month - Month (1-12)
 * @param year - Year (e.g., 2025)
 * @param technicianId - Optional technician filter
 */
export function useCalendarData(
  month: number,
  year: number,
  technicianId?: string
): UseCalendarDataResult {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.getCalendarScheduled({
        month,
        year,
        technician_id: technicianId,
      });

      setData(result);
    } catch (err: any) {
      console.error('Error fetching calendar data:', err);
      setError(err.message || 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [month, year, technicianId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

interface UseTechniciansResult {
  technicians: Technician[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch list of technicians for filtering
 * Only returns data for managers/admins
 */
export function useTechnicians(): UseTechniciansResult {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await api.getCalendarTechnicians();
        setTechnicians(result);
      } catch (err: any) {
        console.error('Error fetching technicians:', err);
        setError(err.message || 'Failed to load technicians');
        setTechnicians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  return {
    technicians,
    loading,
    error,
  };
}


