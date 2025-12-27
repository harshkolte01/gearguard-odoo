import { useState } from 'react';
import { api } from '../api';
import type { CreateRequestData, MaintenanceRequest } from '../types';

export function useCreateRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<MaintenanceRequest | null>(null);

  const createRequest = async (data: CreateRequestData): Promise<MaintenanceRequest> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const request = await api.createMaintenanceRequest(data);
      setCreatedRequest(request);
      setSuccess(true);
      return request;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create request';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setCreatedRequest(null);
  };

  return {
    createRequest,
    loading,
    error,
    success,
    createdRequest,
    reset,
  };
}

