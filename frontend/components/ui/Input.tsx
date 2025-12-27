'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', type = 'text', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setInternalValue(e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      props.onChange?.(e);
    };

    // Derive isFloating from current state - works for both controlled and uncontrolled inputs
    const currentValue = props.value !== undefined && props.value !== null 
      ? String(props.value) 
      : internalValue;
    const isFloating = isFocused || (currentValue && currentValue.length > 0);

    return (
      <div className="input-wrapper">
        <div className="input-container">
          <input
            ref={ref}
            type={type}
            className={`input-field ${error ? 'input-error' : ''} ${className}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {label && (
            <label className={`input-label ${isFloating ? 'floating' : ''}`}>
              {label}
            </label>
          )}
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

