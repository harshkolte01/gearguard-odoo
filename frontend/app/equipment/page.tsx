'use client';

import { useState } from 'react';
import { useEquipmentList } from '@/lib/hooks/useEquipmentList';
import EquipmentSearch from '@/components/equipment/EquipmentSearch';
import EquipmentTable from '@/components/equipment/EquipmentTable';
import Button from '@/components/ui/Button';

export default function EquipmentPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { equipment, pagination, loading, error } = useEquipmentList({
    search,
    page: currentPage,
    limit: 20,
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Header */}
        <div className="equipment-header">
          <div className="equipment-tabs">
            <button className="equipment-tab equipment-tab-active">
              Equipment
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="equipment-content">
          {/* Search Bar */}
          <div className="equipment-search-section">
            <EquipmentSearch 
              onSearch={setSearch}
              placeholder="Search equipment by name, serial number, or department..."
            />
          </div>

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

          {/* Equipment Table */}
          <EquipmentTable equipment={equipment} loading={loading} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="equipment-pagination">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="equipment-pagination-info">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

