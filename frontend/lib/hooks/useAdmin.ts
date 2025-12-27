import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { 
  TechnicianDetail, 
  AdminTeam, 
  AdminStats,
  CreateTechnicianData,
  UpdateTechnicianTeamsData
} from '../types';

export function useTechnicians(shouldFetch: boolean = true) {
  const [technicians, setTechnicians] = useState<TechnicianDetail[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnicians = useCallback(async () => {
    if (!shouldFetch) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTechnicians();
      setTechnicians(data.technicians);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch technicians');
      console.error('Error fetching technicians:', err);
    } finally {
      setLoading(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  const createTechnician = useCallback(async (data: CreateTechnicianData): Promise<TechnicianDetail> => {
    try {
      const newTechnician = await api.createTechnician(data);
      await fetchTechnicians(); // Refresh the list
      return newTechnician;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create technician');
    }
  }, [fetchTechnicians]);

  const updateTechnicianTeams = useCallback(async (
    technicianId: string, 
    teamIds: string[]
  ): Promise<TechnicianDetail> => {
    try {
      const data: UpdateTechnicianTeamsData = { teamIds };
      const updatedTechnician = await api.updateTechnicianTeams(technicianId, data);
      await fetchTechnicians(); // Refresh the list
      return updatedTechnician;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update technician teams');
    }
  }, [fetchTechnicians]);

  return {
    technicians,
    stats,
    loading,
    error,
    refetch: fetchTechnicians,
    createTechnician,
    updateTechnicianTeams,
  };
}

export function useAdminTeams(shouldFetch: boolean = true) {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    if (!shouldFetch) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAdminTeams();
      setTeams(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teams');
      console.error('Error fetching admin teams:', err);
    } finally {
      setLoading(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams,
  };
}

export function useTechnicianDetail(id: string | null, shouldFetch: boolean = true) {
  const [technician, setTechnician] = useState<TechnicianDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnician = useCallback(async () => {
    if (!id || !shouldFetch) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTechnicianById(id);
      setTechnician(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch technician');
      console.error('Error fetching technician:', err);
    } finally {
      setLoading(false);
    }
  }, [id, shouldFetch]);

  useEffect(() => {
    fetchTechnician();
  }, [fetchTechnician]);

  return {
    technician,
    loading,
    error,
    refetch: fetchTechnician,
  };
}


