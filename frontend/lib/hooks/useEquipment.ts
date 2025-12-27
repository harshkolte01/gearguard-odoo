import { useState, useEffect } from 'react';
import { api } from '../api';
import type { EquipmentDetail } from '../types';

interface UseEquipmentParams {
  search?: string;
  department?: string;
  status?: string;
  enabled?: boolean;
}

export function useEquipment(params: UseEquipmentParams = {}) {
  const { search = '', department = '', status = 'active', enabled = true } = params;
  
  const [equipment, setEquipment] = useState<EquipmentDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchEquipment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.getEquipment({
          search,
          department,
          status,
          limit: 100, // Get more for dropdown
        });
        
        // Handle new API response structure with data wrapper
        if (response.data && response.data.equipment) {
          setEquipment(response.data.equipment);
        } else if (response.equipment) {
          // Fallback for old structure
          setEquipment(response.equipment);
        } else {
          setEquipment([]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load equipment');
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [search, department, status, enabled]);

  return { equipment, loading, error };
}

