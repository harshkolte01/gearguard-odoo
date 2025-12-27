'use client';

import { TextareaHTMLAttributes, forwardRef, useState } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = false,
      maxLength,
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const currentLength = value?.toString().length || 0;
    const hasValue = value && value.toString().length > 0;

    return (
      <div className={`textarea-wrapper ${className}`}>
        <div className="textarea-container">
          <textarea
            ref={ref}
            className={`textarea-field ${error ? 'textarea-error' : ''}`}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            {...props}
          />
          <label
            className={`textarea-label ${
              isFocused || hasValue ? 'textarea-label-floating' : ''
            }`}
          >
            {label}
          </label>
        </div>

        <div className="textarea-footer">
          <div className="textarea-helper">
            {error && <span className="textarea-error-text">{error}</span>}
            {!error && helperText && (
              <span className="textarea-helper-text">{helperText}</span>
            )}
          </div>
          {showCharCount && maxLength && (
            <span className="textarea-char-count">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

