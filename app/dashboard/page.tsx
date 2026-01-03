/**
 * DASHBOARD PAGE
 * Custom asymmetric layout with premium GSAP animations
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/lib/store';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { mockCities } from '@/lib/mockData';
import { PlusCircle, Search, Wallet, MapPin, Calendar, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPage() {
  const { isAuthenticated, activeTrip, user } = useStore();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const ctx = gsap.context(() => {
      // Hero title animation - word by word reveal
      const heroWords = heroRef.current?.querySelectorAll('.hero-word');
      if (heroWords) {
        gsap.from(heroWords, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          duration: 1,
          stagger: 0.08,
          ease: 'power4.out',
        });
      }

      // Subtitle animation
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out',
      });

      // CTA button animation
      gsap.from('.hero-cta', {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: 1.2,
        ease: 'back.out(1.7)',
      });

      // Quick actions - staggered float entrance
      gsap.from('.quick-action-card', {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.4,
        ease: 'power3.out',
      });

      // Destination cards with parallax
      gsap.utils.toArray('.destination-card').forEach((card: any, index: number) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 80,
          rotateY: 15,
          duration: 1,
          delay: index * 0.1,
          ease: 'power3.out',
        });
      });

      // Section title animation
      gsap.from('.section-header', {
        scrollTrigger: {
          trigger: '.section-header',
          start: 'top 85%',
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isAuthenticated, router]);

  // Mouse move effect for background gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });

      if (gradientRef.current) {
        gsap.to(gradientRef.current, {
          backgroundPosition: `${x}% ${y}%`,
          duration: 2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isAuthenticated) return null;

  const popularDestinations = mockCities.filter((city) => city.popular);

  const quickActions = [
    {
      title: 'Plan Trip',
      icon: PlusCircle,
      description: 'Start your next adventure',
      href: '/trips/new',
      gradient: 'linear-gradient(135deg, rgba(199,240,0,0.15), rgba(199,240,0,0.05))',
      iconColor: '#C7F000',
    },
    {
      title: 'Explore',
      icon: Search,
      description: 'Discover destinations',
      href: '/search/cities',
      gradient: 'linear-gradient(135deg, rgba(108,124,255,0.15), rgba(108,124,255,0.05))',
      iconColor: '#6C7CFF',
    },
    {
      title: 'Budget',
      icon: Wallet,
      description: 'Track expenses',
      href: '/budget',
      gradient: 'linear-gradient(135deg, rgba(139,156,255,0.15), rgba(139,156,255,0.05))',
      iconColor: '#8B9CFF',
    },
  ];

  return (
    <MainLayout>
      <div ref={containerRef} className="relative min-h-screen">
        {/* Subtle animated background gradient */}
        <div
          ref={gradientRef}
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(199,240,0,0.08) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
            zIndex: 0,
          }}
        />

        <div className="relative px-8 py-12" style={{ zIndex: 1 }}>
          {/* HERO SECTION - Asymmetric */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 min-h-[65vh] items-center">
            <div className="lg:col-span-7">
              <div ref={heroRef} className="mb-6" style={{ perspective: '1000px' }}>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6">
                  {`Welcome back, ${user?.name.split(' ')[0]}`.split(' ').map((word, i) => (
                    <span key={i} className="hero-word inline-block mr-4">
                      {word}
                    </span>
                  ))}
                </h1>
              </div>

              <p className="hero-subtitle text-xl md:text-2xl text-[var(--text-secondary)] max-w-xl mb-8 leading-relaxed">
                Ready to explore the world? Let's craft your next unforgettable journey.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/trips/new')}
                  className="hero-cta"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Planning
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/search/cities')}
                  className="hero-cta"
                >
                  Explore Destinations
                </Button>
              </div>
            </div>

            {/* Active Trip - Floating Card */}
            {activeTrip && (
              <div className="lg:col-span-5">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => router.push(`/trips/${activeTrip.id}`)}
                >
                  <div
                    className="absolute inset-0 rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500"
                    style={{ background: 'var(--accent-primary)' }}
                  />
                  <Card
                    className="relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(42,42,42,0.9))',
                      border: '1px solid rgba(199,240,0,0.3)',
                    }}
                  >
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-primary)] text-black">
                        Active
                      </div>
                    </div>

                    <div className="mb-4">
                      <Calendar className="w-6 h-6 text-[var(--accent-primary)] mb-3" />
                      <h3 className="text-2xl font-bold mb-2">{activeTrip.name}</h3>
                      <p className="text-[var(--text-secondary)] text-sm">
                        {activeTrip.cities.map((c) => c.name).join(' • ')}
                      </p>
                    </div>

                    <div className="flex gap-6 pt-4 border-t border-[var(--glass-border)]">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-[var(--accent-blue)]" />
                        <span>{activeTrip.cities.length} cities</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wallet className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span>₹{activeTrip.budget.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] group-hover:gap-4 transition-all">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* QUICK ACTIONS - Asymmetric Layout */}
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className={`quick-action-card cursor-pointer group ${
                      index === 1 ? 'md:mt-8' : index === 2 ? 'md:mt-16' : ''
                    }`}
                    onClick={() => router.push(action.href)}
                  >
                    <div
                      className="relative rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]"
                      style={{
                        background: action.gradient,
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                        style={{ background: action.gradient }}
                      />

                      <div className="relative">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                          style={{ background: action.gradient }}
                        >
                          <Icon className="w-8 h-8" style={{ color: action.iconColor }} />
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                        <p className="text-[var(--text-secondary)]">{action.description}</p>

                        <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="text-sm font-medium" style={{ color: action.iconColor }}>
                            Get Started
                          </span>
                          <ArrowRight className="w-4 h-4" style={{ color: action.iconColor }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POPULAR DESTINATIONS - Offset Grid */}
          <div>
            <div className="section-header mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-5xl font-black mb-2">Popular Destinations</h2>
                <p className="text-lg text-[var(--text-secondary)]">
                  Handpicked places worth exploring
                </p>
              </div>
              <Button variant="ghost" onClick={() => router.push('/search/cities')}>
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularDestinations.map((city, index) => (
                <div
                  key={city.id}
                  className={`destination-card cursor-pointer group ${
                    index % 3 === 1 ? 'lg:mt-12' : index % 3 === 2 ? 'lg:-mt-6' : ''
                  }`}
                  onClick={() => router.push('/search/cities')}
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(145deg, rgba(30,30,30,0.6), rgba(42,42,42,0.6))',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(108,124,255,0.2), transparent 70%)',
                      }}
                    />

                    <div className="relative p-8">
                      {/* Icon Section */}
                      <div
                        className="mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                        style={{
                          background: 'linear-gradient(135deg, rgba(108,124,255,0.15), rgba(108,124,255,0.05))',
                          height: '200px',
                        }}
                      >
                        <DynamicIcon name={city.image} size={80} className="text-[var(--accent-blue)]" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">{city.country}</p>
                        <p className="text-sm text-[var(--text-muted)] mb-6 line-clamp-2">
                          {city.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-[var(--glass-border)]">
                        <div>
                          <p className="text-xs text-[var(--text-muted)] mb-1">Starting from</p>
                          <p className="text-xl font-bold text-[var(--accent-primary)]">
                            ₹{city.avgCost.toLocaleString()}
                            <span className="text-sm text-[var(--text-secondary)]">/day</span>
                          </p>
                        </div>
                        {city.popular && (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/10">
                            <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                            <span className="text-xs font-bold text-[var(--accent-primary)]">Hot</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPage() {
  const { isAuthenticated, activeTrip, user } = useStore();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const ctx = gsap.context(() => {
      // Floating quick actions with stagger
      gsap.from('.quick-action', {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        delay: 1.2,
        ease: 'back.out(1.7)',
      });

      // Continuous float animation for quick actions
      gsap.to('.quick-action', {
        y: -8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.3,
          repeat: -1,
        },
      });

      // Scroll-triggered animations with enhanced motion
      gsap.utils.toArray('.scroll-fade').forEach((element: any) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
          opacity: 0,
          y: 60,
          scale: 0.95,
          ease: 'power3.out',
        });
      });

      // Destination cards with parallax effect
      gsap.utils.toArray('.destination-card').forEach((element: any, index: number) => {
        // Entrance animation
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          rotateX: -15,
          duration: 0.8,
          delay: index * 0.12,
          ease: 'power3.out',
        });

        // Parallax scroll effect
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: -30,
          ease: 'none',
        });
      });
    }, heroRef);

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
      <div className="px-8 pb-20" ref={heroRef}>
        {/* HERO SECTION - Asymmetric Layout */}
        <div className="min-h-[60vh] flex items-center mb-20 relative">
          <div className="max-w-4xl">
            {/* Animated Hero Text */}
            <HeroText
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}
            >
              Welcome back, {user?.name.split(' ')[0]}
            </HeroText>
            
            <p
              className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                lineHeight: '1.6',
                opacity: 0,
                animation: 'fadeIn 1s ease-out 1.5s forwards',
              }}
            >
              Ready to explore the world? Let's make your next trip unforgettable.
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/trips/new')}
              style={{
                opacity: 0,
                animation: 'fadeIn 1s ease-out 1.8s forwards',
              }}
            >
              Start Planning <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Active Trip Card */}
        {activeTrip && (
          <Card
            className="mb-16 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)] border-2 border-[var(--accent-primary)] relative overflow-hidden"
            onClick={() => router.push(`/trips/${activeTrip.id}`)}
            style={{
              opacity: 0,
              animation: 'fadeIn 1s ease-out 2s forwards',
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-ambient opacity-50 pointer-events-none" />
            
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Active Trip</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{activeTrip.name}</h2>
                <p className="text-[var(--text-secondary)] mb-4">
                  {activeTrip.cities.map((c) => c.name).join(', ')}
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>{activeTrip.cities.length} cities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[var(--accent-blue)]" />
                    <span>₹{activeTrip.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* QUICK ACTIONS - Floating Cards */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="quick-action cursor-pointer group relative overflow-hidden"
                  onClick={() => router.push(action.href)}
                  style={{
                    background: 'var(--gradient-panel)',
                  }}
                >
                  {/* Ambient glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${action.color}15, transparent 70%)`,
                    }}
                  />
                  
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${action.color}33 0%, ${action.color}11 100%)`,
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: action.color }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {action.title}
                    </h3>
                    <p className="text-[var(--text-secondary)]">{action.description}</p>
                    
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span style={{ color: action.color }}>Get Started</span>
                      <ArrowRight className="w-4 h-4" style={{ color: action.color }} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* POPULAR DESTINATIONS - Asymmetric Grid */}
        <div ref={sectionsRef}>
          <div className="scroll-fade mb-10">
            <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Popular Destinations
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
              Discover the world's most amazing places
            </p>
          </div>
          
          {/* Offset grid for visual interest */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((city, index) => (
              <Card
                key={city.id}
                className={`destination-card group cursor-pointer overflow-hidden ${
                  index % 3 === 1 ? 'md:mt-12' : ''
                }`}
                onClick={() => router.push('/search/cities')}
                style={{
                  background: 'var(--gradient-panel)',
                }}
              >
                <div className="relative mb-6">
                  <div
                    className="w-full h-48 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                    style={{
                      background: 'var(--gradient-blue-wash)',
                    }}
                  >
                    <DynamicIcon name={city.image} size={80} className="text-[var(--accent-blue)]" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {city.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{city.country}</p>
                <p className="text-sm text-[var(--text-muted)] mb-6 line-clamp-2">
                  {city.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block mb-1">From</span>
                    <span className="text-lg font-bold text-[var(--accent-primary)]">
                      ₹{city.avgCost.toLocaleString()}/day
                    </span>
                  </div>
                  {city.popular && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-[var(--accent-primary)]/10 rounded-full">
                      <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span className="text-xs font-medium text-[var(--accent-primary)]">Trending</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

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
      <div className="p-8" ref={heroRef}>
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="hero-text text-5xl md:text-6xl font-bold mb-4">
            Welcome back, <span className="neon-text">{user?.name.split(' ')[0]}</span>
          </h1>
          <p className="hero-text text-xl text-[var(--text-secondary)]">
            Ready to explore the world? Let's make your next trip unforgettable.
          </p>
        </div>

        {/* Active Trip Card */}
        {activeTrip && (
          <Card
            className="mb-12 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)] border-2 border-[var(--accent-primary)]"
            onClick={() => router.push(`/trips/${activeTrip.id}`)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Active Trip</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{activeTrip.name}</h2>
                <p className="text-[var(--text-secondary)] mb-4">
                  {activeTrip.cities.map((c) => c.name).join(', ')}
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>{activeTrip.cities.length} cities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[var(--accent-blue)]" />
                    <span>₹{activeTrip.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="section-title">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="quick-action cursor-pointer group"
                  onClick={() => router.push(action.href)}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${action.color}33 0%, ${action.color}11 100%)`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                  <p className="text-[var(--text-secondary)]">{action.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Destinations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Popular Destinations</h2>
            <Button variant="ghost" onClick={() => router.push('/search/cities')}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((city) => (
              <Card
                key={city.id}
                className="group cursor-pointer overflow-hidden"
                onClick={() => router.push('/search/cities')}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {city.image}
                </div>
                <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{city.country}</p>
                <p className="text-sm text-[var(--text-muted)] mb-4">{city.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--accent-primary)] font-medium">
                    From ₹{city.avgCost.toLocaleString()}/day
                  </span>
                  <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
