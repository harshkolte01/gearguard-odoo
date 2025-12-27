import { RequestFilters } from '@/lib/types';
import { useState } from 'react';

interface FilterBarProps {
  filters: RequestFilters;
  onFilterChange: (key: keyof RequestFilters, value: any) => void;
  onReset?: () => void;
  userRole?: 'admin' | 'manager' | 'technician' | 'portal';
}

const stateOptions = [
  { value: 'new', label: 'New', icon: '●' },
  { value: 'in_progress', label: 'In Progress', icon: '◐' },
  { value: 'repaired', label: 'Repaired', icon: '✓' },
  { value: 'scrap', label: 'Scrap', icon: '✕' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'corrective', label: 'Corrective' },
  { value: 'preventive', label: 'Preventive' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'work_center', label: 'Work Center' },
];

export default function FilterBar({ filters, onFilterChange, onReset, userRole = 'portal' }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleStateToggle = (stateValue: string) => {
    const currentStates = filters.state || [];
    const newStates = currentStates.includes(stateValue)
      ? currentStates.filter((s) => s !== stateValue)
      : [...currentStates, stateValue];
    onFilterChange('state', newStates);
  };

  // Calculate active filter count
  const activeFilterCount = 
    (filters.search ? 1 : 0) + 
    (filters.state?.length || 0) + 
    (filters.type ? 1 : 0) + 
    (filters.category ? 1 : 0);

  const isPortalUser = userRole === 'portal';
  const titleText = isPortalUser ? 'My Maintenance Requests' : 'Maintenance Reports';
  const subtitleText = isPortalUser 
    ? 'Track your submitted requests' 
    : 'For requests to track the process';

  return (
    <div className="filter-bar-v2">
      {/* Header Section */}
      <div className="filter-bar-header">
        <div className="filter-bar-title-section">
          <div className="filter-bar-title-wrapper">
            <h3 className="filter-bar-title">{titleText}</h3>
            {activeFilterCount > 0 && (
              <span className="filter-bar-badge">{activeFilterCount}</span>
            )}
          </div>
          <p className="filter-bar-subtitle">{subtitleText}</p>
        </div>
        
        <button 
          className="filter-bar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={isExpanded ? 'rotate-180' : ''}
          >
            <path d="M3 7h18M3 12h12M3 17h6" />
          </svg>
          <span className="filter-bar-toggle-text">
            {isExpanded ? 'Hide' : 'Show'} Filters
          </span>
        </button>
      </div>

      {/* Filters Section */}
      <div className={`filter-bar-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Search Bar */}
        <div className="filter-bar-search-wrapper">
          <div className="filter-bar-search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="filter-bar-search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by ID, subject, description..."
              className="filter-bar-search-input"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
            {filters.search && (
              <button
                className="filter-bar-search-clear"
                onClick={() => onFilterChange('search', '')}
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* State Filter Pills */}
        <div className="filter-bar-group">
          <label className="filter-bar-group-label">Request State</label>
          <div className="filter-bar-pills">
            {stateOptions.map((option) => (
              <button
                key={option.value}
                className={`filter-bar-pill ${
                  filters.state?.includes(option.value) ? 'active' : ''
                }`}
                onClick={() => handleStateToggle(option.value)}
              >
                <span className="filter-bar-pill-icon">{option.icon}</span>
                <span className="filter-bar-pill-text">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="filter-bar-dropdowns">
          {/* Category Filter - Hidden for portal users */}
          {!isPortalUser && (
            <div className="filter-bar-dropdown-group">
              <label htmlFor="category-select-v2" className="filter-bar-dropdown-label">
                Category
              </label>
              <div className="filter-bar-dropdown-wrapper">
                <select
                  id="category-select-v2"
                  className="filter-bar-dropdown"
                  value={filters.category}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg className="filter-bar-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          )}

          {/* Type Filter */}
          <div className="filter-bar-dropdown-group">
            <label htmlFor="type-select-v2" className="filter-bar-dropdown-label">
              Type
            </label>
            <div className="filter-bar-dropdown-wrapper">
              <select
                id="type-select-v2"
                className="filter-bar-dropdown"
                value={filters.type}
                onChange={(e) => onFilterChange('type', e.target.value)}
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg className="filter-bar-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="filter-bar-dropdown-group">
            <label htmlFor="sort-select-v2" className="filter-bar-dropdown-label">
              Sort By
            </label>
            <div className="filter-bar-sort-controls">
              <div className="filter-bar-dropdown-wrapper">
                <select
                  id="sort-select-v2"
                  className="filter-bar-dropdown"
                  value={filters.sort_by}
                  onChange={(e) => onFilterChange('sort_by', e.target.value)}
                >
                  <option value="created_at">Date Created</option>
                  <option value="subject">Subject</option>
                  <option value="state">State</option>
                </select>
                <svg className="filter-bar-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <button
                className="filter-bar-sort-button"
                onClick={() =>
                  onFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')
                }
                title={filters.sort_order === 'asc' ? 'Ascending' : 'Descending'}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {filters.sort_order === 'asc' ? (
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  ) : (
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Actions Row */}
        {onReset && activeFilterCount > 0 && (
          <div className="filter-bar-actions">
            <button className="filter-bar-reset" onClick={onReset}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


