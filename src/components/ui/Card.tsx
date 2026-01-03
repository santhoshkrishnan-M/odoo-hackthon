/**
 * CARD COMPONENT
 * Premium glassmorphism card with advanced 3D hover animations
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
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hoverable || !cardRef.current) return;

    const card = cardRef.current;
    const glow = glowRef.current;

    // Smooth hover lift animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.01,
        duration: 0.4,
        ease: 'power3.out',
      });
      
      if (glow) {
        gsap.to(glow, {
          opacity: 0.6,
          scale: 1.05,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
      
      if (glow) {
        gsap.to(glow, {
          opacity: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
        });
      }
    };

    // Subtle 3D tilt on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3; // Reduced from 5 to 3
      const rotateY = ((x - centerX) / centerX) * 3;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mousemove', handleMouseMove);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoverable]);

  return (
    <div className="relative">
      {/* Glow effect on hover */}
      {hoverable && (
        <div
          ref={glowRef}
          className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-blue)] rounded-[20px] opacity-0 blur-xl"
          style={{ zIndex: -1 }}
        />
      )}
      
      <div
        ref={cardRef}
        className={cn(
          'glass-card p-6 transition-all duration-300 will-change-transform',
          hoverable && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
}
