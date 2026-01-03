/**
 * MOCK DATA FOR GLOBE TROTTER
 * All data used throughout the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  avgCost: number;
  tags: string[];
  popular: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  cost: number;
  cityId: string;
  image: string;
  rating: number;
}

export interface TripDay {
  date: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  cities: City[];
  days: TripDay[];
  shared: boolean;
  userId: string;
}

export interface BudgetCategory {
  name: string;
  spent: number;
  allocated: number;
  color: string;
}

// MOCK USER
export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Rivera',
  email: 'alex@globetrotter.com',
  avatar: 'User',
};

// MOCK CITIES
export const mockCities: City[] = [
  {
    id: 'city-1',
    name: 'Tokyo',
    country: 'Japan',
    description: 'A blend of tradition and futuristic innovation',
    image: 'Building2',
    avgCost: 8500,
    tags: ['Culture', 'Food', 'Technology'],
    popular: true,
  },
  {
    id: 'city-2',
    name: 'Paris',
    country: 'France',
    description: 'The city of lights and romance',
    image: 'Landmark',
    avgCost: 12000,
    tags: ['Art', 'History', 'Food'],
    popular: true,
  },
  {
    id: 'city-3',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Tropical paradise with spiritual vibes',
    image: 'Palmtree',
    avgCost: 4000,
    tags: ['Beach', 'Nature', 'Wellness'],
    popular: true,
  },
  {
    id: 'city-4',
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps',
    image: 'Building',
    avgCost: 15000,
    tags: ['Urban', 'Culture', 'Shopping'],
    popular: true,
  },
  {
    id: 'city-5',
    name: 'Barcelona',
    country: 'Spain',
    description: 'Architecture, beaches, and vibrant nightlife',
    image: 'Waves',
    avgCost: 9000,
    tags: ['Architecture', 'Beach', 'Food'],
    popular: false,
  },
  {
    id: 'city-6',
    name: 'Dubai',
    country: 'UAE',
    description: 'Luxury and modern marvels',
    image: 'Building',
    avgCost: 18000,
    tags: ['Luxury', 'Shopping', 'Desert'],
    popular: true,
  },
];

// MOCK ACTIVITIES
export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Senso-ji Temple Visit',
    description: 'Ancient Buddhist temple in Asakusa',
    category: 'Culture',
    duration: '2 hours',
    cost: 0,
    cityId: 'city-1',
    image: 'Church',
    rating: 4.8,
  },
  {
    id: 'act-2',
    title: 'Sushi Making Class',
    description: 'Learn from master chefs',
    category: 'Food',
    duration: '3 hours',
    cost: 5500,
    cityId: 'city-1',
    image: 'ChefHat',
    rating: 4.9,
  },
  {
    id: 'act-3',
    title: 'Robot Restaurant Show',
    description: 'Futuristic dinner show experience',
    category: 'Entertainment',
    duration: '2.5 hours',
    cost: 8000,
    cityId: 'city-1',
    image: 'Sparkles',
    rating: 4.6,
  },
  {
    id: 'act-4',
    title: 'Eiffel Tower Visit',
    description: 'Iconic landmark with city views',
    category: 'Sightseeing',
    duration: '3 hours',
    cost: 2800,
    cityId: 'city-2',
    image: 'Landmark',
    rating: 4.7,
  },
  {
    id: 'act-5',
    title: 'Louvre Museum Tour',
    description: 'World-famous art museum',
    category: 'Culture',
    duration: '4 hours',
    cost: 1500,
    cityId: 'city-2',
    image: 'Palette',
    rating: 4.9,
  },
  {
    id: 'act-6',
    title: 'Seine River Cruise',
    description: 'Romantic evening cruise',
    category: 'Leisure',
    duration: '2 hours',
    cost: 3500,
    cityId: 'city-2',
    image: 'Ship',
    rating: 4.5,
  },
  {
    id: 'act-7',
    title: 'Yoga Retreat',
    description: 'Morning yoga in rice terraces',
    category: 'Wellness',
    duration: '2 hours',
    cost: 1200,
    cityId: 'city-3',
    image: 'Heart',
    rating: 4.8,
  },
  {
    id: 'act-8',
    title: 'Beach Surfing Lesson',
    description: 'Learn to surf at Kuta Beach',
    category: 'Adventure',
    duration: '3 hours',
    cost: 2000,
    cityId: 'city-3',
    image: 'Waves',
    rating: 4.7,
  },
];

// MOCK TRIPS
export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    name: 'Tokyo Culture Explorer',
    startDate: '2026-03-15',
    endDate: '2026-03-21',
    budget: 85000,
    description: 'A week immersed in Japanese culture, food, and technology',
    cities: [mockCities[0]],
    days: [
      {
        date: '2026-03-15',
        activities: [mockActivities[0], mockActivities[1]],
      },
      {
        date: '2026-03-16',
        activities: [mockActivities[2]],
      },
      {
        date: '2026-03-17',
        activities: [],
      },
    ],
    shared: false,
    userId: 'user-1',
  },
  {
    id: 'trip-2',
    name: 'Paris Art & Romance',
    startDate: '2026-05-01',
    endDate: '2026-05-07',
    budget: 120000,
    description: 'Experience the magic of Paris',
    cities: [mockCities[1]],
    days: [
      {
        date: '2026-05-01',
        activities: [mockActivities[3]],
      },
      {
        date: '2026-05-02',
        activities: [mockActivities[4]],
      },
    ],
    shared: true,
    userId: 'user-1',
  },
  {
    id: 'trip-3',
    name: 'Bali Wellness Escape',
    startDate: '2026-06-10',
    endDate: '2026-06-17',
    budget: 45000,
    description: 'Rejuvenate in paradise',
    cities: [mockCities[2]],
    days: [
      {
        date: '2026-06-10',
        activities: [mockActivities[6]],
      },
      {
        date: '2026-06-11',
        activities: [mockActivities[7]],
      },
    ],
    shared: true,
    userId: 'user-1',
  },
];

// MOCK BUDGET DATA
export const mockBudgetCategories: BudgetCategory[] = [
  {
    name: 'Accommodation',
    spent: 25000,
    allocated: 30000,
    color: '#C7F000',
  },
  {
    name: 'Food & Dining',
    spent: 18000,
    allocated: 20000,
    color: '#6C7CFF',
  },
  {
    name: 'Activities',
    spent: 15000,
    allocated: 15000,
    color: '#8B9CFF',
  },
  {
    name: 'Transportation',
    spent: 12000,
    allocated: 10000,
    color: '#D6FF4D',
  },
  {
    name: 'Shopping',
    spent: 8000,
    allocated: 10000,
    color: '#A1A1AA',
  },
];

// MOCK COMMUNITY TRIPS (shared by others)
export const mockCommunityTrips: Trip[] = [
  {
    id: 'trip-comm-1',
    name: 'Barcelona Summer Adventure',
    startDate: '2026-07-01',
    endDate: '2026-07-10',
    budget: 95000,
    description: 'Beach, architecture, and nightlife',
    cities: [mockCities[4]],
    days: [],
    shared: true,
    userId: 'user-2',
  },
  {
    id: 'trip-comm-2',
    name: 'Dubai Luxury Experience',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    budget: 250000,
    description: 'Live like royalty in Dubai',
    cities: [mockCities[5]],
    days: [],
    shared: true,
    userId: 'user-3',
  },
];

// HELPER FUNCTIONS
export function getTripById(id: string): Trip | undefined {
  return mockTrips.find((trip) => trip.id === id);
}

export function getCityById(id: string): City | undefined {
  return mockCities.find((city) => city.id === id);
}

export function getActivitiesByCity(cityId: string): Activity[] {
  return mockActivities.filter((activity) => activity.cityId === cityId);
}

export function calculateTripDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
