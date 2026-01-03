/**
 * SIDEBAR COMPONENT
 * Persistent navigation sidebar
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  PlusCircle, 
  Search, 
  Wallet, 
  Users, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Trips', href: '/trips', icon: Map },
  { name: 'Create Trip', href: '/trips/new', icon: PlusCircle },
  { name: 'Explore', href: '/search/cities', icon: Search },
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass p-6 flex flex-col z-40">
      {/* Logo */}
      <Link href="/dashboard" className="mb-12">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="neon-text">Global</span>
          <span className="text-white"> Trotter</span>
        </h1>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                isActive
                  ? 'bg-[var(--accent-primary)] text-black font-medium shadow-[0_0_20px_rgba(199,240,0,0.3)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-[var(--glass-border)]">
        <p className="text-xs text-[var(--text-muted)] text-center">
          © 2026 Global Trotter
        </p>
      </div>
    </aside>
  );
}
