/**
 * MAIN LAYOUT COMPONENT
 * Wraps authenticated pages with Sidebar, TopBar, and animated background
 */

'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PageTransition from '../animations/PageTransition';
import AnimatedBackground from '../animations/AnimatedBackground';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen relative">
      {/* Animated Background Layer */}
      <AnimatedBackground />
      
      {/* Content Layer */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Sidebar />
        <div className="ml-64">
          <TopBar />
          <main className="pt-20 min-h-screen">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
