'use client';

import { useState, useEffect } from 'react';

interface EquipmentSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function EquipmentSearch({ onSearch, placeholder = 'Search equipment...' }: EquipmentSearchProps) {
  const [query, setQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="equipment-search-container">
      <div className="equipment-search-wrapper">
        <svg 
          className="equipment-search-icon" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="equipment-search-input"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="equipment-search-clear"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}


