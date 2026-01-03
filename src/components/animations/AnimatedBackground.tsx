/**
 * ANIMATED BACKGROUND
 * Cinematic gradient blobs with mouse parallax
 * This is the WOW factor - subtle, alive, always moving
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const blob1 = blob1Ref.current;
    const blob2 = blob2Ref.current;
    const blob3 = blob3Ref.current;

    if (!container || !blob1 || !blob2 || !blob3) return;

    // Infinite drift animation for blobs
    const createDriftAnimation = (element: HTMLElement, duration: number, x: number, y: number) => {
      gsap.to(element, {
        x: `+=${x}`,
        y: `+=${y}`,
        duration: duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    };

    // Each blob drifts at different speeds and directions
    createDriftAnimation(blob1, 20, 100, 150);
    createDriftAnimation(blob2, 25, -120, 100);
    createDriftAnimation(blob3, 18, 80, -130);

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate distance from center (normalized -1 to 1)
      const deltaX = (clientX - centerX) / centerX;
      const deltaY = (clientY - centerY) / centerY;

      // Move blobs with different intensities for depth
      gsap.to(blob1, {
        x: `+=${deltaX * 30}`,
        y: `+=${deltaY * 30}`,
        duration: 2,
        ease: 'power2.out',
      });

      gsap.to(blob2, {
        x: `+=${deltaX * -20}`,
        y: `+=${deltaY * -20}`,
        duration: 2.5,
        ease: 'power2.out',
      });

      gsap.to(blob3, {
        x: `+=${deltaX * 40}`,
        y: `+=${deltaY * 40}`,
        duration: 1.8,
        ease: 'power2.out',
      });
    };

    // Throttle mouse move for performance
    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafId = 0;
      });
    };

    window.addEventListener('mousemove', throttledMouseMove);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Blob 1 - Neon Green */}
      <div
        ref={blob1Ref}
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #C7F000 0%, transparent 70%)',
          top: '10%',
          left: '20%',
        }}
      />

      {/* Blob 2 - Blue */}
      <div
        ref={blob2Ref}
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #6C7CFF 0%, transparent 70%)',
          top: '50%',
          right: '15%',
        }}
      />

      {/* Blob 3 - Soft Blue */}
      <div
        ref={blob3Ref}
        className="absolute w-[700px] h-[700px] rounded-full opacity-10 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, #8B9CFF 0%, transparent 70%)',
          bottom: '10%',
          left: '40%',
        }}
      />

      {/* Ambient grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
