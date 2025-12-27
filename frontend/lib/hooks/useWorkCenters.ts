import { useState, useEffect } from 'react';
import { tokenStorage } from '@/lib/auth';
import type { WorkCenterDetail } from '@/lib/types';

interface UseWorkCentersOptions {
  search?: string;
  team_id?: string;
}

interface UseWorkCentersReturn {
  workCenters: WorkCenterDetail[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useWorkCenters(options: UseWorkCentersOptions = {}): UseWorkCentersReturn {
  const [workCenters, setWorkCenters] = useState<WorkCenterDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkCenters = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = tokenStorage.get();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query params
      const params = new URLSearchParams();
      if (options.search) {
        params.append('search', options.search);
      }
      if (options.team_id) {
        params.append('team_id', options.team_id);
      }

      const url = `${API_URL}/api/work-centers${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch work centers');
      }

      const data = await response.json();
      setWorkCenters(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Fetch work centers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkCenters();
  }, [options.search, options.team_id]);

  return {
    workCenters,
    loading,
    error,
    refetch: fetchWorkCenters,
  };
}


