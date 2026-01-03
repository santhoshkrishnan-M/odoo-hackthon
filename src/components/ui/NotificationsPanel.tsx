/**
 * NOTIFICATIONS PANEL
 * Animated notification dropdown
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Bell, Check, X, Info, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Trip Confirmed',
    message: 'Your Tokyo adventure is all set!',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New Activity Available',
    message: 'Check out the Shibuya Sky observation deck',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Budget Alert',
    message: 'You\'re 80% through your dining budget',
    time: '1 day ago',
    read: true,
  },
];

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

      // Animate notification items
      gsap.from('.notification-item', {
        opacity: 0,
        x: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-[var(--accent-blue)]" />;
    }
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-primary)] text-black text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-80 max-h-[500px] overflow-y-auto glass rounded-2xl p-4 shadow-2xl"
          style={{ zIndex: 1000 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[var(--accent-primary)] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item p-3 rounded-xl transition-all cursor-pointer ${
                    notification.read
                      ? 'bg-[var(--bg-elevated)]/50'
                      : 'bg-[var(--bg-elevated)] border border-[var(--accent-primary)]/30'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
