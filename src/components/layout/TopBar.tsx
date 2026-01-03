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
    <header className="fixed top-0 right-0 left-64 h-20 glass-card rounded-none border-l-0 border-t-0 border-r-0 px-8 flex items-center justify-between z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <Input
          type="text"
          placeholder="Search trips, cities, activities..."
          className="pl-12 bg-[var(--bg-elevated)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
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
