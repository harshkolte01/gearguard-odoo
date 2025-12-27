'use client';

import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  placeholder = 'Select an option',
  searchable = false,
  disabled = false,
  loading = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opt.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          setSearchTerm('');
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
  };

  const toggleOpen = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div
      className={`select-wrapper ${error ? 'select-error' : ''} ${
        disabled ? 'select-disabled' : ''
      }`}
      ref={containerRef}
    >
      <div className="select-container" onClick={toggleOpen} onKeyDown={handleKeyDown}>
        <div className="select-display">
          <label className={`select-label ${value || isOpen ? 'select-label-floating' : ''}`}>
            {label}
          </label>
          {!isOpen && (
            <div className="select-value">
              {loading ? (
                <span className="select-loading">Loading...</span>
              ) : selectedOption ? (
                <>
                  <span className="select-value-text">{selectedOption.label}</span>
                  {selectedOption.description && (
                    <span className="select-value-desc">{selectedOption.description}</span>
                  )}
                </>
              ) : (
                <span className="select-placeholder">{placeholder}</span>
              )}
            </div>
          )}
          {isOpen && searchable && (
            <input
              ref={inputRef}
              type="text"
              className="select-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              onKeyDown={handleKeyDown}
            />
          )}
          <div className="select-arrow">
            {isOpen ? '▲' : '▼'}
          </div>
        </div>

        {isOpen && (
          <div className="select-dropdown">
            {filteredOptions.length === 0 ? (
              <div className="select-option select-option-empty">No options found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`select-option ${
                    option.value === value ? 'select-option-selected' : ''
                  } ${index === highlightedIndex ? 'select-option-highlighted' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="select-option-label">{option.label}</div>
                  {option.description && (
                    <div className="select-option-desc">{option.description}</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <span className="select-error-text">{error}</span>}
      {helperText && !error && <span className="select-helper-text">{helperText}</span>}
    </div>
  );
}

