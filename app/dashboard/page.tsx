/**
 * DASHBOARD PAGE
 * Custom asymmetric layout with premium GSAP animations
 */

'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/lib/store';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { mockCities } from '@/lib/mockData';
import { PlusCircle, Search, Wallet, MapPin, Calendar, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPage() {
  const { isAuthenticated, activeTrip, user } = useStore();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const ctx = gsap.context(() => {
      // Simple page entry
      gsap.from('.dashboard-content', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const popularDestinations = mockCities.filter((city) => city.popular);

  const quickActions = [
    {
      title: 'Plan New Trip',
      icon: PlusCircle,
      description: 'Start planning your next adventure',
      href: '/trips/new',
      color: 'var(--accent-primary)',
    },
    {
      title: 'Explore Cities',
      icon: Search,
      description: 'Discover amazing destinations',
      href: '/search/cities',
      color: 'var(--accent-blue)',
    },
    {
      title: 'View Budget',
      icon: Wallet,
      description: 'Track your travel expenses',
      href: '/budget',
      color: 'var(--accent-blue-soft)',
    },
  ];

  return (
    <MainLayout>
      <div className="dashboard-content space-y-24" ref={heroRef}>
        {/* Hero Section */}
        <div className="space-y-8 pt-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Welcome back, <span className="neon-text">{user?.name.split(' ')[0]}</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Ready to explore the world? Let's make your next trip unforgettable.
          </p>
        </div>

        {/* Active Trip Card */}
        {activeTrip && (
          <Card
            className="bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)] border-2 border-[var(--accent-primary)]/30 cursor-pointer hover:border-[var(--accent-primary)]/60 hover:scale-[1.01] transition-all p-10"
            onClick={() => router.push(`/trips/${activeTrip.id}`)}
          >
            <div className="flex items-start justify-between gap-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-[var(--accent-primary)]" />
                  <span className="text-base font-semibold text-[var(--accent-primary)] uppercase tracking-wide">Active Trip</span>
                </div>
                <h2 className="text-4xl font-bold mb-0 leading-tight">{activeTrip.name}</h2>
                <p className="text-xl text-[var(--text-secondary)]">
                  {activeTrip.cities.map((c) => c.name).join(', ')}
                </p>
                <div className="flex gap-10 text-base pt-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
                    <span>{activeTrip.cities.length} cities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-[var(--accent-blue)]" />
                    <span>₹{activeTrip.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                View Details
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="space-y-10">
          <h2 className="text-4xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer group hover:scale-[1.02] transition-all p-10"
                  onClick={() => router.push(action.href)}
                >
                  <div className="space-y-8">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${action.color}22 0%, ${action.color}11 100%)`,
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: action.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">{action.title}</h3>
                      <p className="text-lg text-[var(--text-secondary)] leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold mb-0">Popular Destinations</h2>
            <Button variant="ghost" onClick={() => router.push('/search/cities')} className="group">
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {popularDestinations.map((city) => (
              <Card
                key={city.id}
                className="group cursor-pointer overflow-hidden hover:scale-[1.02] transition-all p-0"
                onClick={() => router.push('/search/cities')}
              >
                <div className="space-y-0">
                  {/* City Image */}
                  {city.imageUrl ? (
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={city.imageUrl} 
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-5 left-5 text-white">
                        <div className="text-5xl mb-2">{city.image}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-6xl p-8 group-hover:scale-110 transition-transform duration-500">
                      {city.image}
                    </div>
                  )}
                  
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{city.country}</p>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {city.description}
                    </p>
                  
                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-[var(--glass-border)]">
                      <div>
                        <span className="text-xs text-[var(--text-muted)] block mb-1">From</span>
                        <span className="text-lg font-bold text-[var(--accent-primary)]">
                          ₹{city.avgCost.toLocaleString()}/day
                        </span>
                      </div>
                      {city.popular && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent-primary)]/10 rounded-full">
                          <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          <span className="text-xs font-medium text-[var(--accent-primary)]">Trending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
