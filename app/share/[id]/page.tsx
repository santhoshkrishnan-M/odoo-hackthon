/**
 * SHARED ITINERARY PAGE
 * Read-only view of shared trip
 */

'use client';

import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getTripById, formatDate, formatCurrency, calculateTripDays } from '@/lib/mockData';
import { MapPin, Calendar, Wallet, Copy, Share2 } from 'lucide-react';

export default function SharedItineraryPage() {
  const params = useParams();
  const trip = getTripById(params.id as string);

  const handleCopyTrip = () => {
    alert('Trip copied to your account!');
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Share link copied to clipboard!');
  };

  if (!trip) {
    return (
      <MainLayout>
        <div className="p-8">
          <Card className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const days = calculateTripDays(trip.startDate, trip.endDate);

  return (
    <MainLayout>
      <div className="p-8">
        {/* Banner */}
        <Card className="mb-8 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Shared Itinerary</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
              <p className="text-[var(--text-secondary)]">{trip.description}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleShareLink}>
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
              <Button variant="primary" onClick={handleCopyTrip}>
                Copy Trip
              </Button>
            </div>
          </div>
        </Card>

        {/* Trip Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-[var(--accent-primary)]" />
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Destinations</p>
                <p className="font-semibold">{trip.cities.map((c) => c.name).join(', ')}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[var(--accent-blue)]" />
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Duration</p>
                <p className="font-semibold">{days} days</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-[var(--accent-blue-soft)]" />
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Budget</p>
                <p className="font-semibold">{formatCurrency(trip.budget)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Itinerary */}
        <div>
          <h2 className="section-title mb-6">Itinerary</h2>
          <div className="space-y-6">
            {trip.days.map((day, index) => (
              <Card key={index}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-neon flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4">
                      Day {index + 1} - {formatDate(day.date)}
                    </h3>
                    {day.activities.length > 0 ? (
                      <div className="space-y-3">
                        {day.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="p-4 bg-[var(--bg-elevated)] rounded-lg"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">{activity.image}</span>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{activity.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mb-2">
                                  {activity.description}
                                </p>
                                <div className="flex gap-4 text-xs">
                                  <span className="text-[var(--accent-primary)]">
                                    {activity.category}
                                  </span>
                                  <span className="text-[var(--text-secondary)]">
                                    {activity.duration}
                                  </span>
                                  <span>⭐ {activity.rating}</span>
                                </div>
                              </div>
                              <span className="font-semibold text-[var(--accent-primary)]">
                                {formatCurrency(activity.cost)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[var(--text-secondary)]">No activities planned</p>
                    )}
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
