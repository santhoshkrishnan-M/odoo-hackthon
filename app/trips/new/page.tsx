/**
 * CREATE TRIP PAGE
 * Form to create a new trip
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Trip } from '@/lib/mockData';

export default function CreateTripPage() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const { addTrip } = useStore();
  const router = useRouter();

  const handleCreate = () => {
    if (!name || !startDate || !endDate || !budget) {
      alert('Please fill in all required fields');
      return;
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      name,
      startDate,
      endDate,
      budget: parseInt(budget),
      description,
      cities: [],
      days: [],
      shared: false,
      userId: 'user-1',
    };

    addTrip(newTrip);
    router.push(`/trips/${newTrip.id}/builder`);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold mb-0">Create New Trip</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Plan your next adventure with all the details
          </p>
        </div>

        <Card className="p-10">
          <div className="space-y-8">
            <div>
              <Input
                label="Trip Name"
                type="text"
                placeholder="My Amazing Adventure"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Budget (₹)"
                type="number"
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                Description
              </label>
              <textarea
                className="w-full px-5 py-4 bg-[var(--bg-surface)] border-2 border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-primary)] focus:shadow-[0_0_20px_rgba(199,240,0,0.2)] min-h-[150px] text-base"
                placeholder="Describe your trip..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-5 pt-6">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleCreate}
              >
                Create Trip
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
