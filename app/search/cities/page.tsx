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
    // Simple entry animation
    gsap.from('.cities-content', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
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
  }, [filteredCities]);

  return (
    <MainLayout>
      <div className="cities-content space-y-20">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold mb-0">Explore Cities</h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Discover amazing destinations around the world
          </p>
        </div>

        {/* Search Bar */}
        <div>
          <div className="relative max-w-5xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search cities, countries..."
              className="pl-14 py-4 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div>
          <h3 className="text-sm font-medium mb-5 text-[var(--text-secondary)] uppercase tracking-wider">Filter by Interest</h3>
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-5 py-2.5 rounded-full text-sm transition-all ${
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
        <div className="mb-6">
          <p className="text-base text-[var(--text-secondary)]">
            Found {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" ref={cardsRef}>
          {filteredCities.map((city) => (
            <Card key={city.id} className="city-card group p-10">
              <div className="text-7xl mb-6 group-hover:scale-110 transition-transform flex items-center justify-center">
                <DynamicIcon name={city.image} size={72} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {city.country}
              </p>
              <p className="text-base text-[var(--text-muted)] mb-5 leading-relaxed">{city.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {city.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 bg-[var(--bg-elevated)] rounded-full text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-[var(--glass-border)]">
                <span className="text-base font-semibold text-[var(--accent-primary)]">
                  From ₹{city.avgCost.toLocaleString()}/day
                </span>
                {city.popular && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--accent-blue)]">
                    <TrendingUp className="w-4 h-4" />
                    Popular
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full mt-5"
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
