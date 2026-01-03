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
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-8 h-8 text-[var(--accent-primary)]" />
            <h1 className="section-title mb-0">Community Trips</h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            Discover and get inspired by trips shared by other travelers
          </p>
        </div>

        {/* Featured Banner */}
        <Card className="mb-8 bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-primary)]/10 border-2 border-[var(--accent-blue)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🌟 Featured Trip of the Week</h2>
              <p className="text-[var(--text-secondary)]">
                Explore the most popular trip shared by our community
              </p>
            </div>
          </div>
        </Card>

        {/* Community Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommunityTrips.map((trip) => {
            const days = calculateTripDays(trip.startDate, trip.endDate);
            return (
              <Card key={trip.id} className="group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                      {trip.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                      {trip.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>{trip.cities.map((c) => c.name).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--accent-blue)]" />
                    <span>
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({days} days)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wallet className="w-4 h-4 text-[var(--accent-blue-soft)]" />
                    <span>{formatCurrency(trip.budget)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-4 pb-4 border-b border-[var(--glass-border)] text-sm">
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

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewTrip(trip.id)}
                  >
                    <Eye className="w-4 h-4" />
                    View Trip
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
