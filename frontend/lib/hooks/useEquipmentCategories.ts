import { useState, useEffect } from 'react';
import { api, ApiError } from '../api';
import type { EquipmentCategory, CreateCategoryData, UpdateCategoryData } from '../types';

interface UseEquipmentCategoriesResult {
  categories: EquipmentCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createCategory: (data: CreateCategoryData) => Promise<EquipmentCategory>;
  updateCategory: (id: string, data: UpdateCategoryData) => Promise<EquipmentCategory>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useEquipmentCategories(): UseEquipmentCategoriesResult {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEquipmentCategories();
      setCategories(data);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load categories');
      }
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (data: CreateCategoryData): Promise<EquipmentCategory> => {
    const category = await api.createEquipmentCategory(data);
    await fetchCategories(); // Refresh list
    return category;
  };

  const updateCategory = async (id: string, data: UpdateCategoryData): Promise<EquipmentCategory> => {
    const category = await api.updateEquipmentCategory(id, data);
    await fetchCategories(); // Refresh list
    return category;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    await api.deleteEquipmentCategory(id);
    await fetchCategories(); // Refresh list
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}


