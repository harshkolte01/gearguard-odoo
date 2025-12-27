import { useState, useEffect } from 'react';
import { api } from '../api';
import type { MaintenanceRequest } from '../types';

export function useRequestDetail(id: string | null, enabled = true) {
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await api.getMaintenanceRequest(id);
      setRequest(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load request details');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && id) {
      fetchRequest();
    }
  }, [id, enabled]);

  const updateState = async (
    state: string,
    data?: { duration_hours?: number; assigned_technician_id?: string }
  ) => {
    if (!id) throw new Error('No request ID');

    try {
      const updated = await api.updateRequestState(id, { state, ...data });
      setRequest(updated);
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteRequest = async () => {
    if (!id) throw new Error('No request ID');

    try {
      await api.deleteRequest(id);
      setRequest(null);
    } catch (err: any) {
      throw err;
    }
  };

  const refetch = () => {
    if (id) {
      fetchRequest();
    }
  };

  return {
    request,
    loading,
    error,
    updateState,
    deleteRequest,
    refetch,
  };
}

