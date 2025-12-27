'use client';

import { useState } from 'react';
import type { ReportFilters } from '@/lib/types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ReportFiltersProps {
  filters: ReportFilters;
  onFilterChange: (filters: ReportFilters) => void;
  onReset: () => void;
}

const stateOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'repaired', label: 'Repaired' },
  { value: 'scrap', label: 'Scrapped' },
];

export default function ReportFilters({ filters, onFilterChange, onReset }: ReportFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ReportFilters>(filters);

  const handleStateToggle = (state: string) => {
    const currentStates = localFilters.state || [];
    const newStates = currentStates.includes(state)
      ? currentStates.filter((s) => s !== state)
      : [...currentStates, state];
    
    const newFilters = { ...localFilters, state: newStates };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { startDate: undefined, endDate: undefined, state: [] };
    setLocalFilters(resetFilters);
    onReset();
  };

  const hasActiveFilters = 
    localFilters.startDate || 
    localFilters.endDate || 
    (localFilters.state && localFilters.state.length > 0);

  return (
    <div className="report-filters">
      <div className="report-filters-row">
        <div className="filter-group">
          <label className="filter-label">Date Range</label>
          <div className="filter-date-range">
            <Input
              type="date"
              value={localFilters.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              placeholder="Start Date"
              className="filter-date-input"
            />
            <span className="filter-date-separator">to</span>
            <Input
              type="date"
              value={localFilters.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              placeholder="End Date"
              className="filter-date-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Request State</label>
          <div className="filter-state-chips">
            {stateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStateToggle(option.value)}
                className={`filter-chip ${
                  localFilters.state?.includes(option.value) ? 'filter-chip-active' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="filter-reset-btn"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}


