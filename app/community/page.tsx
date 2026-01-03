/**
 * COMMUNITY PAGE
 * Browse trips shared by other users
 */

'use client';

import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { mockCommunityTrips, formatDate, formatCurrency, calculateTripDays } from '@/lib/mockData';
import { MapPin, Calendar, Wallet, Eye, Copy, Users } from 'lucide-react';

export default function CommunityPage() {
  const router = useRouter();

  const handleViewTrip = (id: string) => {
    router.push(`/share/${id}`);
  };

  const handleCopyTrip = (e: React.MouseEvent, tripName: string) => {
    e.stopPropagation();
    alert(`"${tripName}" has been copied to your trips!`);
  };

  return (
    <MainLayout>
      <div className="space-y-20">
        <div>
          <div className="flex items-center gap-5 mb-5">
            <Users className="w-12 h-12 text-[var(--accent-primary)]" />
            <h1 className="text-6xl font-bold mb-0">Community Trips</h1>
          </div>
          <p className="text-xl text-[var(--text-secondary)]">
            Discover and get inspired by trips shared by other travelers
          </p>
        </div>

        {/* Featured Banner */}
        <Card className="p-10 bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-primary)]/10 border-2 border-[var(--accent-blue)]">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold mb-0">🌟 Featured Trip of the Week</h2>
              <p className="text-base text-[var(--text-secondary)]">
                Explore the most popular trip shared by our community
              </p>
            </div>
          </div>
        </Card>

        {/* Community Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {mockCommunityTrips.map((trip) => {
            const days = calculateTripDays(trip.startDate, trip.endDate);
            return (
              <Card key={trip.id} className="group p-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
                      {trip.name}
                    </h3>
                    <p className="text-base text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {trip.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>{trip.cities.map((c) => c.name).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--accent-blue)]" />
                    <span>
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({days} days)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Wallet className="w-4 h-4 text-[var(--accent-blue-soft)]" />
                    <span>{formatCurrency(trip.budget)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-5 pb-5 border-b border-[var(--glass-border)] text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">Views: </span>
                    <span className="font-semibold">1.2k</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">Copied: </span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">Rating: </span>
                    <span className="font-semibold">⭐ 4.8</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    onClick={() => handleViewTrip(trip.id)}
                  >
                    <Eye className="w-4 h-4" />
                    View Trip
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="flex-1"
                    onClick={(e) => handleCopyTrip(e, trip.name)}
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State for More Content */}
        <Card className="mt-8 text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-[var(--accent-blue)]" />
          <h3 className="text-xl font-bold mb-2">More trips coming soon!</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Be the first to share your amazing trip with the community
          </p>
          <Button variant="primary" onClick={() => router.push('/trips/new')}>
            Share Your Trip
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
}
