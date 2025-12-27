'use client';

import type { EquipmentCategory } from '@/lib/types';
import CategoryRow from './CategoryRow';
import Skeleton from '../ui/Skeleton';

interface CategoryTableProps {
  categories: EquipmentCategory[];
  loading?: boolean;
  onEdit: (category: EquipmentCategory) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ categories, loading, onEdit, onDelete }: CategoryTableProps) {
  if (loading) {
    return (
      <div className="category-table-container">
        <div className="category-table-loading">
          <Skeleton height="3rem" className="skeleton-mb" />
          <Skeleton height="3rem" className="skeleton-mb" />
          <Skeleton height="3rem" />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="category-table-container">
        <div className="category-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <h3>No Categories Found</h3>
          <p>Create your first equipment category to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-table-container">
      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th className="category-table-header">Name</th>
              <th className="category-table-header">Responsible</th>
              <th className="category-table-header">Company</th>
              <th className="category-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


