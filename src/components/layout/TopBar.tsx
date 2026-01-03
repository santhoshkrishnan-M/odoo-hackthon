/**
 * TOP BAR COMPONENT
 * Premium header with functional components
 */

'use client';

import { Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import Input from '../ui/Input';
import ProfileDropdown from '../ui/ProfileDropdown';
import NotificationsPanel from '../ui/NotificationsPanel';
import ThemeToggle from '../ui/ThemeToggle';

export default function TopBar() {
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <header className="sticky top-0 h-20 glass-card border-b border-[var(--glass-border)] px-8 flex items-center justify-between z-40 bg-[var(--glass-bg)]">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <Input
          type="text"
          placeholder="Search trips, cities, activities..."
          className="pl-12 bg-[var(--bg-elevated)] border-[var(--glass-border)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationsPanel />

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
