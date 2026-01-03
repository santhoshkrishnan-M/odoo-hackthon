# 🌍 Globe Trotter - Premium Trip Planning Platform

A **desktop-first, futuristic trip planning web application** built with Next.js, featuring stunning GSAP animations, smooth Lenis scrolling, and a glassmorphism design system.

---

## ✨ Features

### 🎨 Design
- **Dark-mode first** with premium glassmorphism UI
- **Neon green accents** (#C7F000) with soft blue/purple gradients
- **GSAP-powered animations** throughout the app
- **Lenis smooth scrolling** for buttery-smooth navigation
- **3D card hover effects** with mouse tracking
- **Responsive design** (desktop-first, mobile-friendly)

### 📱 13 Complete Pages

1. **Auth Page** (`/auth`) - Login & signup with demo login
2. **Dashboard** (`/dashboard`) - Hero section with active trip & quick actions
3. **My Trips** (`/trips`) - Grid view of all trips with edit/delete
4. **Create Trip** (`/trips/new`) - Form to create new trip
5. **Itinerary View** (`/trips/[id]`) - Showcase page with timeline & budget
6. **Itinerary Builder** (`/trips/[id]/builder`) - Interactive drag-and-drop builder
7. **City Search** (`/search/cities`) - Browse & filter cities
8. **Activity Search** (`/search/activities`) - Browse activities by category
9. **Budget Page** (`/budget`) - Animated budget breakdown
10. **Calendar View** (`/calendar`) - Monthly calendar with trip highlights
11. **Shared Itinerary** (`/share/[id]`) - Read-only shared trip view
12. **Settings** (`/settings`) - Profile, theme toggle, preferences
13. **Community** (`/community`) - Browse trips shared by others

### 🚀 Features

- ✅ **All buttons work** - No dead UI
- ✅ **Mock data everywhere** - No backend required
- ✅ **State management** with Zustand
- ✅ **Smooth page transitions** with GSAP
- ✅ **Glassmorphism cards** with hover animations
- ✅ **Working search** and filters
- ✅ **Budget tracking** with animated progress bars
- ✅ **Calendar integration** showing trip dates
- ✅ **Trip sharing** functionality
- ✅ **Theme toggle** (dark/light mode)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: GSAP
- **Smooth Scroll**: Lenis (@studio-freight/lenis)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Utilities**: clsx, tailwind-merge

---

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 🎯 Quick Start Guide

### First Time Setup

1. The app will redirect you to `/auth`
2. Click **"Try Demo Login"** to skip authentication
3. You'll land on the **Dashboard** with a pre-loaded active trip
4. Explore all 13 pages using the sidebar navigation

### Key Features to Try

1. **Create a Trip**
   - Click "Create Trip" in sidebar
   - Fill in trip details
   - Gets redirected to itinerary builder

2. **Build Your Itinerary**
   - Add cities from the modal
   - Add activities to each day
   - Reorder activities (visual feedback)
   - Save to view the complete timeline

3. **Explore Cities**
   - Use search and tag filters
   - Click "Add to Trip" to start planning

4. **Track Budget**
   - View animated progress bars
   - See category breakdowns
   - Get over-budget warnings

---

## 📂 Project Structure

```
globe-trotter/
├── app/                          # Next.js App Router
│   ├── auth/                     # Auth page
│   ├── dashboard/                # Dashboard
│   ├── trips/                    # Trip pages
│   ├── search/                   # Search pages
│   ├── budget/                   # Budget page
│   ├── calendar/                 # Calendar view
│   ├── share/[id]/               # Shared itinerary
│   ├── settings/                 # Settings
│   ├── community/                # Community page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Root page (redirect)
│   └── globals.css               # Global styles
│
├── src/
│   ├── components/
│   │   ├── animations/           # Animation wrappers
│   │   ├── layout/               # Layout components
│   │   └── ui/                   # UI components
│   │
│   └── lib/
│       ├── mockData.ts           # Mock data & helpers
│       ├── store.ts              # Zustand state
│       └── utils.ts              # Utility functions
```

---

## 🎨 Design System

### Color Tokens

```css
/* Background */
--bg-primary: #121212
--bg-surface: #1E1E1E
--bg-elevated: #2A2A2A

/* Accent */
--accent-primary: #C7F000 (neon green)
--accent-glow: #D6FF4D
--accent-blue: #6C7CFF
--accent-blue-soft: #8B9CFF

/* Text */
--text-primary: #FFFFFF
--text-secondary: #A1A1AA
--text-muted: #6B7280
```

---

## 🎬 Animations

### GSAP Animations

- **Page transitions**: Fade in + slide up on route change
- **Staggered reveals**: Timeline items, cards, quick actions
- **Text animations**: Hero titles with character-by-character reveal
- **Progress bars**: Animated width on budget page
- **Hover effects**: Scale, glow, transform

### Lenis Smooth Scroll

- Butter-smooth scrolling throughout the app
- Configurable duration and easing
- Works with GSAP ScrollTrigger

---

## 📝 Mock Data

All data is stored in `src/lib/mockData.ts`:

- **6 Cities**: Tokyo, Paris, Bali, New York, Barcelona, Dubai
- **8 Activities**: Culture, food, adventure, wellness
- **3 User Trips**: Pre-populated with itineraries
- **5 Budget Categories**: Accommodation, food, activities, transport, shopping
- **2 Community Trips**: Shared by other users

### Helper Functions

```typescript
getTripById(id: string): Trip | undefined
getCityById(id: string): City | undefined
getActivitiesByCity(cityId: string): Activity[]
calculateTripDays(startDate: string, endDate: string): number
formatCurrency(amount: number): string
formatDate(dateString: string): string
```

---

## 🔄 State Management

Using Zustand for global state:

```typescript
// User authentication
isAuthenticated, user, login(), logout()

// Trips
trips, activeTrip, addTrip(), updateTrip(), deleteTrip()

// Theme
theme, toggleTheme()

// Search
searchQuery, setSearchQuery()
```

---

## 💡 Tips for Beginners

1. **Start with the Dashboard**: Explore the main features
2. **Check mockData.ts**: See how data is structured
3. **Modify colors**: Change CSS variables in `globals.css`
4. **Add new cities**: Edit `mockCities` array in `mockData.ts`
5. **Customize animations**: Adjust GSAP timings in component files

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Deploy (zero configuration needed)

---

## 🎉 Enjoy Planning Your Trips!

**Demo Login** → **Explore** → **Create** → **Share**

Happy Travels! ✈️🌍
