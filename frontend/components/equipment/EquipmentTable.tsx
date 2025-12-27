'use client';

import type { EquipmentDetail } from '@/lib/types';
import EquipmentTableRow from './EquipmentTableRow';
import Skeleton from '../ui/Skeleton';

interface EquipmentTableProps {
  equipment: EquipmentDetail[];
  loading?: boolean;
}

export default function EquipmentTable({ equipment, loading }: EquipmentTableProps) {
  if (loading) {
    return (
      <div className="equipment-table-container">
        <div className="equipment-table-loading">
          <Skeleton height="3rem" className="skeleton-mb" />
          <Skeleton height="3rem" className="skeleton-mb" />
          <Skeleton height="3rem" className="skeleton-mb" />
          <Skeleton height="3rem" className="skeleton-mb" />
          <Skeleton height="3rem" />
        </div>
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="equipment-table-container">
        <div className="equipment-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <h3>No Equipment Found</h3>
          <p>No equipment matches your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="equipment-table-container">
      <div className="equipment-table-wrapper">
        <table className="equipment-table">
          <thead>
            <tr>
              <th className="equipment-table-header">Equipment Name</th>
              <th className="equipment-table-header">Employee</th>
              <th className="equipment-table-header">Department</th>
              <th className="equipment-table-header">Serial Number</th>
              <th className="equipment-table-header">Technician</th>
              <th className="equipment-table-header">Equipment Category</th>
              <th className="equipment-table-header">Company</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <EquipmentTableRow key={item.id} equipment={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


