/**
 * PROFILE DROPDOWN
 * Animated profile menu with settings and logout
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useStore();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (isOpen) {
      gsap.fromTo(
        menu,
        {
          opacity: 0,
          y: -10,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      action: () => {
        router.push('/profile');
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => {
        router.push('/settings');
        setIsOpen(false);
      },
    },
    {
      icon: LogOut,
      label: 'Logout',
      action: handleLogout,
      danger: true,
    },
  ];

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center text-black font-bold text-sm">
          {user.name.charAt(0)}
        </div>
        <span className="text-sm font-medium hidden md:block">{user.name.split(' ')[0]}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-56 glass rounded-2xl p-2 shadow-2xl"
          style={{ zIndex: 1000 }}
        >
          {/* User Info */}
          <div className="px-3 py-3 border-b border-[var(--glass-border)] mb-2">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
          </div>

          {/* Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  item.danger
                    ? 'hover:bg-red-500/10 text-red-400'
                    : 'hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
