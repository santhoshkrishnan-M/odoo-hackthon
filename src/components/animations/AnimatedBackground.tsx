'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/store';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { theme } = useStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const blobs: HTMLDivElement[] = [];

    // Create 2 simple animated blobs
    for (let i = 0; i < 2; i++) {
      const blob = document.createElement('div');
      blob.className = 'absolute rounded-full blur-3xl opacity-20';
      
      const size = 300 + Math.random() * 200;
      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      
      // Position blobs
      blob.style.left = `${20 + i * 60}%`;
      blob.style.top = `${30 + i * 40}%`;
      
      // Theme-aware colors
      if (theme === 'dark') {
        blob.style.background = i === 0 
          ? 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)';
      } else {
        blob.style.background = i === 0
          ? 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)';
      }

      container.appendChild(blob);
      blobs.push(blob);

      // Simple floating animation
      gsap.to(blob, {
        x: `${(Math.random() - 0.5) * 100}`,
        y: `${(Math.random() - 0.5) * 100}`,
        duration: 20 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    return () => {
      blobs.forEach(blob => blob.remove());
    };
  }, [theme]);

  return (
    <div 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}
