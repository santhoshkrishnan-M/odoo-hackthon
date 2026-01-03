/**
 * THEME TOGGLE
 * Animated dark/light mode switcher
 */

'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      applyTheme(savedTheme === 'dark');
    }
  }, []);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;

    if (dark) {
      root.style.setProperty('--bg-primary', '#121212');
      root.style.setProperty('--bg-surface', '#1E1E1E');
      root.style.setProperty('--bg-elevated', '#2A2A2A');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--text-secondary', '#A1A1AA');
      root.style.setProperty('--text-muted', '#6B7280');
    } else {
      root.style.setProperty('--bg-primary', '#FFFFFF');
      root.style.setProperty('--bg-surface', '#F5F5F5');
      root.style.setProperty('--bg-elevated', '#E5E5E5');
      root.style.setProperty('--text-primary', '#121212');
      root.style.setProperty('--text-secondary', '#52525B');
      root.style.setProperty('--text-muted', '#A1A1AA');
    }

    // Animate color transition
    gsap.to(root, {
      duration: 0.5,
      ease: 'power2.inOut',
    });
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');

    // Animate the toggle
    gsap.to('.theme-icon', {
      scale: 0,
      rotation: 180,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to('.theme-icon', {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      },
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] transition-all relative overflow-hidden"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="theme-icon">
        {isDark ? (
          <Moon className="w-5 h-5 text-[var(--accent-blue)]" />
        ) : (
          <Sun className="w-5 h-5 text-[var(--accent-primary)]" />
        )}
      </div>
    </button>
  );
}
