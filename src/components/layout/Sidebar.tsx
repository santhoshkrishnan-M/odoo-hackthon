/**
 * SIDEBAR COMPONENT
 * Collapsible navigation sidebar with GSAP animation
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { 
  LayoutDashboard, 
  Map, 
  PlusCircle, 
  Search, 
  Wallet, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
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
  const [isExpanded, setIsExpanded] = useState(true);
  const sidebarRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Load saved state
    const saved = sessionStorage.getItem('sidebar-expanded');
    if (saved !== null) {
      setIsExpanded(saved === 'true');
    }
  }, []);

  useEffect(() => {
    // Save state
    sessionStorage.setItem('sidebar-expanded', String(isExpanded));

    // Animate sidebar
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: isExpanded ? 280 : 80,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    // Animate text elements
    textRefs.current.forEach((el) => {
      if (el) {
        gsap.to(el, {
          opacity: isExpanded ? 1 : 0,
          x: isExpanded ? 0 : -10,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside 
      ref={sidebarRef}
      className="fixed left-0 top-0 h-screen glass flex flex-col border-r border-[var(--glass-border)] z-50 overflow-hidden"
      style={{ width: '280px' }}
    >
      <div className={cn('flex flex-col h-full', isExpanded ? 'px-8 py-12' : 'px-4 py-10')}>
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between mb-20">
          <Link href="/dashboard" className={cn('transition-opacity overflow-visible', !isExpanded && 'opacity-0 pointer-events-none')}>
            <h1 className="text-3xl font-bold whitespace-nowrap leading-none" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="neon-text">Globe</span>
              <span className="text-white"> Trotter</span>
            </h1>
          </Link>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors flex-shrink-0"
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative',
                  isActive
                    ? 'bg-[var(--accent-primary)] text-black font-medium shadow-[0_0_20px_rgba(199,240,0,0.2)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                )}
                title={!isExpanded ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span 
                  ref={(el) => { textRefs.current[index] = el; }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn('pt-6 border-t border-[var(--glass-border)] transition-opacity', !isExpanded && 'opacity-0')}>
          <p className="text-xs text-[var(--text-muted)] text-center whitespace-nowrap">
            © 2026 Globe Trotter
          </p>
        </div>
      </div>
    </aside>
  );
}
