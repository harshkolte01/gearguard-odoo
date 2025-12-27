'use client';

import { useState } from 'react';
import type { EquipmentCategory } from '@/lib/types';
import Button from '../ui/Button';

interface CategoryRowProps {
  category: EquipmentCategory;
  onEdit: (category: EquipmentCategory) => void;
  onDelete: (id: string) => void;
}

export default function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(category.id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const equipmentCount = category._count?.equipment || 0;

  return (
    <tr className="category-table-row">
      <td className="category-table-cell">{category.name}</td>
      <td className="category-table-cell">{category.description || 'No description'}</td>
      <td className="category-table-cell">{equipmentCount} items</td>
      <td className="category-table-cell category-table-actions">
        <Button
          variant="ghost"
          onClick={() => onEdit(category)}
          disabled={isDeleting}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </Button>
        <Button
          variant="ghost"
          onClick={handleDelete}
          disabled={isDeleting || equipmentCount > 0}
          title={equipmentCount > 0 ? 'Cannot delete category with equipment' : 'Delete category'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </Button>
      </td>
    </tr>
  );
}


