'use client';

import { ButtonHTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as any) || internalRef;

    const baseStyles = 'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap';
    
    const variants = {
      primary: 'bg-[var(--accent-primary)] hover:bg-[var(--accent-glow)] text-black font-semibold shadow-[var(--glow-neon)]',
      secondary: 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-white border border-[var(--glass-border)]',
      ghost: 'bg-transparent hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
      outline: 'bg-transparent hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border-2 border-[var(--glass-border)] hover:border-[var(--accent-primary)]/30',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm h-9',
      md: 'px-5 py-2.5 text-sm h-10',
      lg: 'px-6 py-3 text-base h-12',
    };

    useEffect(() => {
      const button = buttonRef.current;
      if (!button) return;

      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);

    return (
      <button
        ref={buttonRef}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

