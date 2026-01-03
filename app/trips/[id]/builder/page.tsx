/**
 * ITINERARY BUILDER PAGE
 * Interactive builder for trip itinerary
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { getTripById, mockCities, getActivitiesByCity, Activity } from '@/lib/mockData';
import { Plus, Trash2, Save, GripVertical, Star } from 'lucide-react';

export default function ItineraryBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { updateTrip } = useStore();
  const trip = getTripById(params.id as string);
  
  const [showCityModal, setShowCityModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

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

  const handleAddCity = (cityId: string) => {
    const city = mockCities.find((c) => c.id === cityId);
    if (city && !trip.cities.find((c) => c.id === cityId)) {
      updateTrip(trip.id, {
        cities: [...trip.cities, city],
      });
    }
    setShowCityModal(false);
  };

  const handleAddActivity = (activity: Activity) => {
    if (selectedDayIndex === null) return;
    
    const updatedDays = [...trip.days];
    if (!updatedDays[selectedDayIndex]) {
      updatedDays[selectedDayIndex] = {
        date: new Date(new Date(trip.startDate).getTime() + selectedDayIndex * 86400000).toISOString().split('T')[0],
        activities: [],
      };
    }
    
    updatedDays[selectedDayIndex].activities.push(activity);
    updateTrip(trip.id, { days: updatedDays });
    setShowActivityModal(false);
    setSelectedDayIndex(null);
  };

  const handleRemoveActivity = (dayIndex: number, activityId: string) => {
    const updatedDays = [...trip.days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (a) => a.id !== activityId
    );
    updateTrip(trip.id, { days: updatedDays });
  };

  const handleSave = () => {
    router.push(`/trips/${trip.id}`);
  };

  // Generate days array
  const tripDays = [];
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= dayCount; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    tripDays.push({
      index: i,
      date: date.toISOString().split('T')[0],
      dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }

  const availableActivities = trip.cities.flatMap((city) => getActivitiesByCity(city.id));

  return (
    <MainLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title mb-2">Build Your Itinerary</h1>
            <p className="text-[var(--text-secondary)]">{trip.name}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push(`/trips/${trip.id}`)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save & View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h3 className="font-bold mb-4">Cities</h3>
              <div className="space-y-2 mb-4">
                {trip.cities.map((city) => (
                  <div
                    key={city.id}
                    className="p-3 bg-[var(--bg-elevated)] rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{city.image}</span>
                      <span>{city.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowCityModal(true)}
              >
                <Plus className="w-4 h-4" />
                Add City
              </Button>
            </Card>
          </div>

          {/* Days Timeline */}
          <div className="lg:col-span-3 space-y-6">
            {tripDays.map((day) => {
              const dayData = trip.days[day.index];
              
              return (
                <Card key={day.index}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-neon flex items-center justify-center text-black font-bold">
                        {day.index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-4">
                        Day {day.index + 1} - {day.dateLabel}
                      </h3>

                      {dayData?.activities && dayData.activities.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {dayData.activities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] rounded-lg group"
                            >
                              <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-move" />
                              <span className="text-2xl">{activity.image}</span>
                              <div className="flex-1">
                                <p className="font-medium">{activity.title}</p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  {activity.duration} • {activity.category}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveActivity(day.index, activity.id)}
                                className="p-2 hover:bg-[var(--bg-surface)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--text-secondary)] mb-4 text-sm">
                          No activities added yet
                        </p>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDayIndex(day.index);
                          setShowActivityModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Activity
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* City Modal */}
        <Modal
          isOpen={showCityModal}
          onClose={() => setShowCityModal(false)}
          title="Add City"
        >
          <div className="grid grid-cols-2 gap-4">
            {mockCities.map((city) => (
              <Card
                key={city.id}
                onClick={() => handleAddCity(city.id)}
                hoverable
                className="cursor-pointer"
              >
                <div className="text-4xl mb-2">{city.image}</div>
                <h4 className="font-bold">{city.name}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{city.country}</p>
              </Card>
            ))}
          </div>
        </Modal>

        {/* Activity Modal */}
        <Modal
          isOpen={showActivityModal}
          onClose={() => {
            setShowActivityModal(false);
            setSelectedDayIndex(null);
          }}
          title="Add Activity"
        >
          {availableActivities.length === 0 ? (
            <p className="text-center text-[var(--text-secondary)] py-8">
              Add cities first to see available activities
            </p>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {availableActivities.map((activity) => (
                <Card
                  key={activity.id}
                  onClick={() => handleAddActivity(activity)}
                  hoverable
                  className="cursor-pointer"
                >
                  <div className="flex gap-3">
                    <span className="text-3xl">{activity.image}</span>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{activity.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">
                        {activity.description}
                      </p>
                      <div className="flex gap-3 text-xs">
                        <span className="text-[var(--accent-primary)]">{activity.category}</span>
                        <span className="text-[var(--text-secondary)]">{activity.duration}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[var(--accent-primary)] fill-current" />
                          {activity.rating}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-[var(--accent-primary)]">
                      ₹{activity.cost}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
