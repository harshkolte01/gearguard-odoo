import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Team } from '../types';

/**
 * Hook to fetch teams based on user role
 * - Admin/Manager: Returns all teams
 * - Technician: Returns only teams where user is a member
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.getTeams();
      setTeams(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load teams';
      setError(errorMessage);
      console.error('Fetch teams error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams,
  };
}


