/**
 * MAIN LAYOUT COMPONENT
 * Wraps authenticated pages with Sidebar, TopBar, and animated background
 */

'use client';

import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PageTransition from '../animations/PageTransition';
import AnimatedBackground from '../animations/AnimatedBackground';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(280);

  useEffect(() => {
    const checkSidebarState = () => {
      const saved = sessionStorage.getItem('sidebar-expanded');
      setSidebarWidth(saved === 'false' ? 80 : 280);
    };

    checkSidebarState();
    
    // Listen for storage changes
    const interval = setInterval(checkSidebarState, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Background layer - isolated */}
      <AnimatedBackground />
      
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div 
        className="flex-1 flex flex-col transition-all duration-400"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <PageTransition>
            <div className="max-w-[1600px] mx-auto px-16 py-20">
              {children}
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
