/**
 * HERO TEXT ANIMATOR
 * Cinematic word-by-word text reveal
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Note: SplitText is a GSAP premium plugin. If not available, we'll split manually
const splitTextManually = (text: string) => {
  return text.split(' ').map((word, i) => (
    <span
      key={i}
      className="inline-block word-reveal"
      style={{ opacity: 0, transform: 'translateY(30px)' }}
    >
      {word}&nbsp;
    </span>
  ));
};

interface HeroTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export default function HeroText({ children, className = '', delay = 0 }: HeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll('.word-reveal');

    // Cinematic word reveal animation
    gsap.fromTo(
      words,
      {
        opacity: 0,
        y: 30,
        rotateX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.08,
        delay: delay,
        ease: 'power4.out',
      }
    );
  }, [delay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ perspective: '1000px' }}
    >
      {splitTextManually(children)}
    </div>
  );
}
