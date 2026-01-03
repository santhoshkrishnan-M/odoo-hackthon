/**
 * THEME TOGGLE
 * Animated dark/light mode switcher
 */

'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ThemeToggle() {
  const { theme, toggleTheme: storeToggleTheme } = useStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Apply theme on mount
    applyTheme(isDark);
    // Persist to localStorage
    localStorage.setItem('globe-trotter-theme', theme);
  }, [isDark, theme]);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;

    if (dark) {
      // Dark mode - deeper, more refined
      root.style.setProperty('--bg-primary', '#0F0F0F');
      root.style.setProperty('--bg-surface', '#1A1A1A');
      root.style.setProperty('--bg-elevated', '#252525');
      root.style.setProperty('--bg-hover', '#2F2F2F');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--text-secondary', '#A1A1AA');
      root.style.setProperty('--text-muted', '#71717A');
      root.style.setProperty('--glass-bg', 'rgba(26, 26, 26, 0.6)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
    } else {
      // Light mode - soft, premium, calm
      root.style.setProperty('--bg-primary', '#F8F9FA');
      root.style.setProperty('--bg-surface', '#FFFFFF');
      root.style.setProperty('--bg-elevated', '#F1F3F5');
      root.style.setProperty('--bg-hover', '#E9ECEF');
      root.style.setProperty('--text-primary', '#1A1A1A');
      root.style.setProperty('--text-secondary', '#52525B');
      root.style.setProperty('--text-muted', '#71717A');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.06)');
    }
  };

  const toggleTheme = () => {
    storeToggleTheme();
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
