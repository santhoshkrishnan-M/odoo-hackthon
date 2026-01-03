/**
 * CURSOR FOLLOW EFFECT
 * Subtle cursor-aware motion using GSAP
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CursorFollow() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorInner = cursorInnerRef.current;
    if (!cursor || !cursorInner) return;

    // Smooth cursor follow with GSAP
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
      
      gsap.to(cursorInner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power3.out',
      });
    };

    // Expand cursor on hover over interactive elements
    const expandCursor = () => {
      gsap.to(cursorInner, {
        scale: 2,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const contractCursor = () => {
      gsap.to(cursorInner, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select'
    );
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', expandCursor);
      el.addEventListener('mouseleave', contractCursor);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', expandCursor);
        el.removeEventListener('mouseleave', contractCursor);
      });
    };
  }, []);

  return (
    <>
      {/* Outer cursor ring - smooth lag */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{ left: '-16px', top: '-16px' }}
      >
        <div className="w-full h-full border border-white/40 rounded-full"></div>
      </div>
      
      {/* Inner cursor dot - fast response */}
      <div
        ref={cursorInnerRef}
        className="fixed w-1.5 h-1.5 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{ left: '-3px', top: '-3px' }}
      >
        <div className="w-full h-full bg-white rounded-full"></div>
      </div>
    </>
  );
}
