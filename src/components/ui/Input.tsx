/**
 * INPUT COMPONENT
 * Styled input with floating label
 */

'use client';

import { InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value !== '');
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--glass-border)] rounded-xl',
          'text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-300',
          'focus:border-[var(--accent-primary)] focus:shadow-[0_0_20px_rgba(199,240,0,0.2)]',
          error && 'border-red-500',
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
