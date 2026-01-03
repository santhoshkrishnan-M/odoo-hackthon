/**
 * PAGE TRANSITION COMPONENT
 * Cinematic GSAP page transitions with motion continuity
 */

'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Enhanced entrance animation
      gsap.fromTo(
        container,
        {
          opacity: 0,
          y: 40,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }, container);

    return () => ctx.revert();
  }, [pathname]); // Re-trigger on route change

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}
