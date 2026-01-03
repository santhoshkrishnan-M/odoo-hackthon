/**
 * CARD COMPONENT
 * Premium glassmorphism card with subtle hover animations
 */

'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hoverable = true, onClick }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hoverable || !cardRef.current) return;

    const card = cardRef.current;

    // Simple hover lift
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -4,
        scale: 1.005,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hoverable]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={cn(
        'relative glass-card shadow-[var(--shadow-md)]',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {children}
    </div>
  );
}
