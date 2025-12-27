'use client';

import { useState, useEffect } from 'react';
import type { EquipmentCategory } from '@/lib/types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface CategoryFormProps {
  category?: EquipmentCategory | null;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined });
      // Reset form
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <h3 className="category-form-title">
        {category ? 'Edit Category' : 'Create New Category'}
      </h3>

      {error && (
        <div className="category-form-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <Input
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Computers, Machinery"
        required
        disabled={loading}
      />

      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description of this category"
        disabled={loading}
      />

      <div className="category-form-actions">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          {category ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
}


