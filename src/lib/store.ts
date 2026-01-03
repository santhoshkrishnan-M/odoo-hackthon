/**
 * GLOBAL STATE MANAGEMENT
 * Simple state store for managing trips and user data
 */

'use client';

import { create } from 'zustand';
import { Trip, mockTrips, mockUser, User } from './mockData';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  
  // Trips
  trips: Trip[];
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // User state
  user: null,
  isAuthenticated: false,
  
  login: (email: string, password: string) => {
    // Mock login - always succeeds
    set({
      user: mockUser,
      isAuthenticated: true,
    });
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      activeTrip: null,
    });
  },
  
  // Trips state
  trips: mockTrips,
  activeTrip: mockTrips[0],
  
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  
  addTrip: (trip) => set((state) => ({
    trips: [...state.trips, trip],
  })),
  
  updateTrip: (id, updates) => set((state) => ({
    trips: state.trips.map((trip) =>
      trip.id === id ? { ...trip, ...updates } : trip
    ),
  })),
  
  deleteTrip: (id) => set((state) => ({
    trips: state.trips.filter((trip) => trip.id !== id),
    activeTrip: state.activeTrip?.id === id ? null : state.activeTrip,
  })),
  
  // Theme state
  theme: 'dark',
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark',
  })),
  
  // Search state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
