import { useState, useEffect } from 'react';
import { api } from '../api';
import type { EquipmentDetail, Pagination } from '../types';

interface UseEquipmentListResult {
  equipment: EquipmentDetail[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEquipmentList(params: {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
}): UseEquipmentListResult {
  const [equipment, setEquipment] = useState<EquipmentDetail[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getEquipment(params);
      setEquipment(response.equipment);
      setPagination(response.pagination || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load equipment');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [params.search, params.department, params.status, params.page, params.limit]);

  return {
    equipment,
    pagination,
    loading,
    error,
    refetch: fetchEquipment,
  };
}


