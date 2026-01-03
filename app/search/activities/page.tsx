/**
 * ACTIVITY SEARCH PAGE
 * Browse and search activities with scroll animations
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { mockActivities } from '@/lib/mockData';
import { Search, Star, Clock, DollarSign } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ActivitySearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const categories = Array.from(new Set(mockActivities.map((a) => a.category)));

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || activity.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (cardsRef.current) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.activity-card').forEach((element: any, index: number) => {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 30,
            scale: 0.95,
            duration: 0.6,
            delay: index * 0.05,
            ease: 'power2.out',
          });
        });
      }, cardsRef);

      return () => ctx.revert();
    }
  }, [filteredActivities]);

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="section-title mb-8">Browse Activities</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search activities..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-3 text-[var(--text-secondary)]">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                !selectedCategory
                  ? 'bg-[var(--accent-primary)] text-black font-medium'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-[var(--accent-primary)] text-black font-medium'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-[var(--text-secondary)]">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={cardsRef}>
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="activity-card group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                <DynamicIcon name={activity.image} size={64} />
              </div>
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-[var(--accent-primary)] text-black rounded-full font-medium">
                  {activity.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">{activity.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[var(--accent-blue)]" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>₹{activity.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{activity.rating} / 5.0</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="section-title mb-8">Browse Activities</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search activities..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-3 text-[var(--text-secondary)]">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                !selectedCategory
                  ? 'bg-[var(--accent-primary)] text-black font-medium'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-[var(--accent-primary)] text-black font-medium'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-[var(--text-secondary)]">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {activity.image}
              </div>
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-[var(--accent-primary)] text-black rounded-full font-medium">
                  {activity.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">{activity.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[var(--accent-blue)]" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>₹{activity.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{activity.rating} / 5.0</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
