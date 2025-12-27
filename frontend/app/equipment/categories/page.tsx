'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEquipmentCategories } from '@/lib/hooks/useEquipmentCategories';
import { userStorage } from '@/lib/auth';
import CategoryTable from '@/components/equipment/CategoryTable';
import CategoryForm from '@/components/equipment/CategoryForm';
import Button from '@/components/ui/Button';
import type { EquipmentCategory } from '@/lib/types';
import { useToast } from '@/lib/contexts/ToastContext';

export default function EquipmentCategoriesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'new' | 'categories'>('categories');
  const [editingCategory, setEditingCategory] = useState<EquipmentCategory | null>(null);
  
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, refetch } = useEquipmentCategories();

  // Check if user is admin
  const user = userStorage.get();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin && !loading) {
      showToast('Access denied. Admin privileges required.', 'error');
      router.push('/equipment');
    }
  }, [isAdmin, loading, router, showToast]);

  if (!isAdmin) {
    return null;
  }

  const handleCreate = async (data: { name: string; description?: string }) => {
    try {
      await createCategory(data);
      showToast('Category created successfully', 'success');
      setActiveTab('categories');
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
      throw err;
    }
  };

  const handleUpdate = async (data: { name: string; description?: string }) => {
    if (!editingCategory) return;
    
    try {
      await updateCategory(editingCategory.id, data);
      showToast('Category updated successfully', 'success');
      setEditingCategory(null);
      setActiveTab('categories');
    } catch (err: any) {
      showToast(err.message || 'Failed to update category', 'error');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      showToast('Category deleted successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  const handleEdit = (category: EquipmentCategory) => {
    setEditingCategory(category);
    setActiveTab('new');
  };

  const handleCancelForm = () => {
    setEditingCategory(null);
    setActiveTab('categories');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Header with Tabs */}
        <div className="equipment-header">
          <Button variant="ghost" onClick={() => router.push('/equipment')} className="back-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Equipment
          </Button>
        </div>

        <div className="equipment-tabs">
          <button
            className={`equipment-tab ${activeTab === 'new' ? 'equipment-tab-active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            {editingCategory ? 'Edit' : 'New'}
          </button>
          <button
            className={`equipment-tab ${activeTab === 'categories' ? 'equipment-tab-active' : ''}`}
            onClick={() => {
              setEditingCategory(null);
              setActiveTab('categories');
            }}
          >
            Equipment Categories
          </button>
        </div>

        {/* Content */}
        {activeTab === 'categories' ? (
          <div className="equipment-content">
            {/* Error State */}
            {error && (
              <div className="equipment-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Categories Table */}
            <CategoryTable
              categories={categories}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div className="equipment-new-tab">
            <CategoryForm
              category={editingCategory}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={handleCancelForm}
            />
          </div>
        )}
      </div>
    </div>
  );
}


