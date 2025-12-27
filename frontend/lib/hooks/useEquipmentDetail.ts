import { useState, useEffect } from 'react';
import { api, ApiError } from '../api';
import type { EquipmentDetail } from '../types';

interface UseEquipmentDetailResult {
  equipment: EquipmentDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEquipmentDetail(id: string): UseEquipmentDetailResult {
  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEquipmentById(id);
      setEquipment(data);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load equipment details');
      }
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEquipment();
    }
  }, [id]);

  return {
    equipment,
    loading,
    error,
    refetch: fetchEquipment,
  };
}


