/**
 * CALENDAR VIEW PAGE
 * Monthly calendar view of trips
 */

'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export default function CalendarPage() {
  const { trips } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTripForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return trips.find((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <MainLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title mb-0">Trip Calendar</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold min-w-[200px] text-center">
              {monthNames[month]} {year}
            </h2>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Card className="p-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-[var(--text-secondary)]">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {days.map((day, index) => {
              if (typeof day !== 'number') return day;

              const trip = getTripForDate(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`h-24 p-3 rounded-xl transition-all ${
                    trip
                      ? 'bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-blue)]/10 border-2 border-[var(--accent-primary)] hover:scale-105 cursor-pointer'
                      : isToday
                      ? 'bg-[var(--bg-elevated)] border-2 border-[var(--accent-blue)]'
                      : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-[var(--accent-blue)]' : ''
                    }`}
                  >
                    {day}
                  </div>
                  {trip && (
                    <div className="text-xs">
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                        <span className="font-medium truncate">{trip.name}</span>
                      </div>
                      <p className="text-[var(--text-muted)] truncate text-[10px]">
                        {trip.cities.map((c) => c.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Trips */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Upcoming Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <Card key={trip.id}>
                <h3 className="font-bold mb-2">{trip.name}</h3>
                <div className="text-sm space-y-1">
                  <p className="text-[var(--text-secondary)]">
                    {new Date(trip.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    -{' '}
                    {new Date(trip.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-[var(--text-muted)]">
                    {trip.cities.map((c) => c.name).join(', ')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
