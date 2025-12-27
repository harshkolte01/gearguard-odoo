'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', type = 'text', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const isFloating = isFocused || hasValue || props.value;

    return (
      <div className="input-wrapper">
        <div className="input-container">
          <input
            ref={ref}
            type={type}
            className={`input-field ${error ? 'input-error' : ''} ${className}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <label className={`input-label ${isFloating ? 'floating' : ''}`}>
            {label}
          </label>
          <div className="input-border" />
        </div>
        {error && (
          <span className="input-error-text">{error}</span>
        )}
        {helperText && !error && (
          <span className="input-helper-text">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

