/**
 * ITINERARY VIEW PAGE
 * Main showcase page for viewing trip itinerary
 */

'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useStore } from '@/lib/store';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getTripById, formatDate, formatCurrency, calculateTripDays } from '@/lib/mockData';
import { MapPin, Calendar, Wallet, Edit, Share2, Users, Clock } from 'lucide-react';

export default function ItineraryViewPage() {
  const params = useParams();
  const router = useRouter();
  const timelineRef = useRef<HTMLDivElement>(null);
  const trip = getTripById(params.id as string);

  useEffect(() => {
    if (timelineRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.timeline-item', {
          opacity: 0,
          x: -50,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }, timelineRef);

      return () => ctx.revert();
    }
  }, []);

  if (!trip) {
    return (
      <MainLayout>
        <div className="p-8">
          <Card className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
            <Button onClick={() => router.push('/trips')}>Back to Trips</Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const days = calculateTripDays(trip.startDate, trip.endDate);
  const totalActivities = trip.days.reduce((acc, day) => acc + day.activities.length, 0);
  const avgCostPerDay = Math.round(trip.budget / days);

  return (
    <MainLayout>
      <div className="p-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">{trip.name}</h1>
              <p className="text-xl text-[var(--text-secondary)] mb-6">{trip.description}</p>
              
              {/* Smart Summary */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-full">
                  <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>{days} Days</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-full">
                  <MapPin className="w-4 h-4 text-[var(--accent-blue)]" />
                  <span>{trip.cities.length} Cities</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-full">
                  <Wallet className="w-4 h-4 text-[var(--accent-blue-soft)]" />
                  <span>{formatCurrency(avgCostPerDay)}/day</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-full">
                  <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Moderate pace</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/trips/${trip.id}/builder`)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push(`/share/${trip.id}`)}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2" ref={timelineRef}>
            <h2 className="section-title mb-6">Itinerary Timeline</h2>
            
            {trip.days.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-[var(--text-secondary)] mb-4">
                  No activities added yet. Start building your itinerary!
                </p>
                <Button onClick={() => router.push(`/trips/${trip.id}/builder`)}>
                  Add Activities
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {trip.days.map((day, index) => (
                  <Card key={index} className="timeline-item">
                    <div className="flex gap-4">
                      {/* Day Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-neon flex items-center justify-center text-black font-bold">
                          {index + 1}
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          Day {index + 1} - {formatDate(day.date)}
                        </h3>
                        
                        {day.activities.length === 0 ? (
                          <p className="text-[var(--text-secondary)]">No activities planned</p>
                        ) : (
                          <div className="space-y-3">
                            {day.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="p-4 bg-[var(--bg-elevated)] rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-3">
                                    <span className="text-3xl">{activity.image}</span>
                                    <div>
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
                                        <span className="text-[var(--accent-blue)]">
                                          ⭐ {activity.rating}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-[var(--accent-primary)]">
                                    {formatCurrency(activity.cost)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Summary */}
            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[var(--accent-primary)]" />
                Budget Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Total Budget</span>
                  <span className="font-semibold">{formatCurrency(trip.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Per Day</span>
                  <span className="font-semibold">{formatCurrency(avgCostPerDay)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => router.push('/budget')}
                >
                  View Detailed Budget
                </Button>
              </div>
            </Card>

            {/* Trip Details */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Trip Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[var(--text-secondary)]">Start Date</span>
                  <p className="font-medium">{formatDate(trip.startDate)}</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">End Date</span>
                  <p className="font-medium">{formatDate(trip.endDate)}</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Duration</span>
                  <p className="font-medium">{days} days</p>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Total Activities</span>
                  <p className="font-medium">{totalActivities}</p>
                </div>
              </div>
            </Card>

            {/* Community Tips */}
            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--accent-blue)]" />
                Community Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                  <p className="text-[var(--text-secondary)]">
                    "Book accommodation in advance for better deals!"
                  </p>
                  <span className="text-xs text-[var(--accent-primary)] mt-2 block">
                    - Travel Pro
                  </span>
                </div>
                <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                  <p className="text-[var(--text-secondary)]">
                    "Try local street food for authentic experience"
                  </p>
                  <span className="text-xs text-[var(--accent-primary)] mt-2 block">
                    - Foodie Explorer
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
