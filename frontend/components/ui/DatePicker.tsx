'use client';

import { useState, forwardRef } from 'react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  minDate?: string;
  disabled?: boolean;
  showTime?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      minDate,
      disabled = false,
      showTime = true,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    const inputType = showTime ? 'datetime-local' : 'date';

    // Get minimum date/time (default to current time)
    const getMinDateTime = () => {
      if (minDate) return minDate;
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Convert to ISO 8601 format for backend
      const dateValue = e.target.value;
      if (dateValue) {
        const isoDate = new Date(dateValue).toISOString();
        onChange(isoDate);
      } else {
        onChange('');
      }
    };

    // Convert ISO date to datetime-local format for input
    const getInputValue = () => {
      if (!value) return '';
      try {
        const date = new Date(value);
        const offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset);
        return date.toISOString().slice(0, 16);
      } catch {
        return '';
      }
    };

    return (
      <div className="input-wrapper">
        <div className="input-container">
          <input
            ref={ref}
            type={inputType}
            className={`input-field ${error ? 'input-error' : ''}`}
            value={getInputValue()}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            min={getMinDateTime()}
            disabled={disabled}
          />
          <label
            className={`input-label ${
              isFocused || hasValue ? 'floating' : ''
            }`}
          >
            {label}
          </label>
        </div>

        {error && <span className="input-error-text">{error}</span>}
        {!error && helperText && (
          <span className="input-helper-text">{helperText}</span>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;

