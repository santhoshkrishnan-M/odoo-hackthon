/**
 * BUTTON COMPONENT
 * Premium animated button with smooth hover effects
 */

'use client';

import { ButtonHTMLAttributes, ReactNode, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const glow = glowRef.current;
    if (!button) return;

    // Smooth hover animation
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
      
      if (glow) {
        gsap.to(glow, {
          opacity: 1,
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      
      if (glow) {
        gsap.to(glow, {
          opacity: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    // Click animation
    const handleMouseDown = () => {
      gsap.to(button, {
        scale: 0.98,
        duration: 0.1,
        ease: 'power2.in',
      });
    };

    const handleMouseUp = () => {
      gsap.to(button, {
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const baseStyles = 'relative rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-gradient-neon text-black',
    secondary: 'bg-gradient-blue text-white',
    outline: 'border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <div className="relative inline-block">
      {/* Glow effect */}
      {(variant === 'primary' || variant === 'secondary') && (
        <div
          ref={glowRef}
          className={`absolute inset-0 rounded-full opacity-0 blur-lg ${
            variant === 'primary' ? 'bg-[var(--accent-primary)]' : 'bg-[var(--accent-blue)]'
          }`}
          style={{ zIndex: -1 }}
        />
      )}
      
      <button
        ref={buttonRef}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
