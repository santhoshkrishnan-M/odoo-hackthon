/**
 * MY TRIPS PAGE
 * Display all user trips
 */

'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate, formatCurrency, calculateTripDays } from '@/lib/mockData';
import { MapPin, Calendar, Wallet, Edit, Trash2, Eye } from 'lucide-react';

export default function TripsPage() {
  const { trips, deleteTrip } = useStore();
  const router = useRouter();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(id);
    }
  };

  return (
    <MainLayout>
      <div className="trips-content space-y-20">
        <div className="flex items-center justify-between gap-10">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold mb-0">My Trips</h1>
            <p className="text-xl text-[var(--text-secondary)]">
              Manage and view all your planned adventures
            </p>
          </div>
          <Button variant="primary" onClick={() => router.push('/trips/new')}>
            Create New Trip
          </Button>
        </div>

        {trips.length === 0 ? (
          <Card className="text-center py-24 px-8">
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              No trips yet. Start planning your first adventure!
            </p>
            <Button variant="primary" onClick={() => router.push('/trips/new')}>
              Create Your First Trip
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {trips.map((trip) => {
              const days = calculateTripDays(trip.startDate, trip.endDate);
              return (
                <Card key={trip.id} className="group p-10">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
                        {trip.name}
                      </h3>
                      <p className="text-base text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                        <span className="line-clamp-1">{trip.cities.map((c) => c.name).join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-[var(--accent-blue)] flex-shrink-0" />
                        <span>
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({days} days)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Wallet className="w-4 h-4 text-[var(--accent-blue-soft)] flex-shrink-0" />
                        <span>{formatCurrency(trip.budget)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="primary"
                        size="md"
                        className="flex-1"
                        onClick={() => router.push(`/trips/${trip.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/trips/${trip.id}/builder`)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(trip.id, e)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
