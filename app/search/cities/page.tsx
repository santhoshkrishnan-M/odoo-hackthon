/**
 * CITY SEARCH PAGE
 * Search and browse cities with scroll animations
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { mockCities } from '@/lib/mockData';
import { Search, MapPin, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CitySearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();
  const cardsRef = useRef<HTMLDivElement>(null);

  const allTags = Array.from(new Set(mockCities.flatMap((city) => city.tags)));

  const filteredCities = mockCities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => city.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    if (cardsRef.current) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.city-card').forEach((element: any, index: number) => {
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
  }, [filteredCities]);

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="section-title mb-8">Explore Cities</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search cities, countries..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-3 text-[var(--text-secondary)]">Filter by Interest</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-[var(--accent-primary)] text-black font-medium'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-4 py-2 rounded-full text-sm text-red-400 hover:bg-[var(--bg-elevated)]"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-[var(--text-secondary)]">
            Found {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={cardsRef}>
          {filteredCities.map((city) => (
            <Card key={city.id} className="city-card group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                <DynamicIcon name={city.image} size={64} />
              </div>
              <h3 className="text-xl font-bold mb-1">{city.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {city.country}
              </p>
              <p className="text-sm text-[var(--text-muted)] mb-4">{city.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {city.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-[var(--bg-elevated)] rounded-full text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                <span className="text-sm font-medium text-[var(--accent-primary)]">
                  From ₹{city.avgCost.toLocaleString()}/day
                </span>
                {city.popular && (
                  <div className="flex items-center gap-1 text-xs text-[var(--accent-blue)]">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full mt-4"
                onClick={() => router.push('/trips/new')}
              >
                Add to Trip
              </Button>
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
        <h1 className="section-title mb-8">Explore Cities</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search cities, countries..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-3 text-[var(--text-secondary)]">Filter by Interest</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-[var(--accent-primary)] text-black font-medium'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-4 py-2 rounded-full text-sm text-red-400 hover:bg-[var(--bg-elevated)]"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-[var(--text-secondary)]">
            Found {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <Card key={city.id} className="group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {city.image}
              </div>
              <h3 className="text-xl font-bold mb-1">{city.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {city.country}
              </p>
              <p className="text-sm text-[var(--text-muted)] mb-4">{city.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {city.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-[var(--bg-elevated)] rounded-full text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                <span className="text-sm font-medium text-[var(--accent-primary)]">
                  From ₹{city.avgCost.toLocaleString()}/day
                </span>
                {city.popular && (
                  <div className="flex items-center gap-1 text-xs text-[var(--accent-blue)]">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full mt-4"
                onClick={() => router.push('/trips/new')}
              >
                Add to Trip
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
