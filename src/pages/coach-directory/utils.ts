// Mock coaches data
export const mockCoaches = [
  {
    id: 'coach1',
    name: 'Alex Thompson',
    username: 'coach_alex',
    profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    bio: 'Certified fitness coach with 8+ years experience. Specializing in strength training and habit formation.',
    specializations: ['Fitness', 'Nutrition', 'Wellness'],
    pricingOption: 'hourly',
    rateAmount: 25000,
    rating: 4.9,
    reviewCount: 127
  },
  {
    id: 'coach2',
    name: 'Maya Williams',
    username: 'mindful_maya',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    bio: 'Mindfulness expert and meditation teacher. I help people reduce stress and build healthy mental habits.',
    specializations: ['Wellness', 'Meditation', 'Productivity'],
    pricingOption: 'one-time',
    rateAmount: 50000,
    rating: 4.8,
    reviewCount: 93
  },
  {
    id: 'coach3',
    name: 'Daniel Chen',
    username: 'tech_daniel',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    bio: 'Software engineer and coding mentor. Specialized in helping people build coding habits and learn new programming skills.',
    specializations: ['Coding', 'Technology', 'Education'],
    pricingOption: 'hourly',
    rateAmount: 35000,
    rating: 4.7,
    reviewCount: 81
  },
  {
    id: 'coach4',
    name: 'Sarah Johnson',
    username: 'finance_sarah',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
    bio: 'Financial advisor helping people develop better money habits and reach their financial goals.',
    specializations: ['Finance', 'Productivity', 'Education'],
    pricingOption: 'one-time',
    rateAmount: 45000,
    rating: 4.6,
    reviewCount: 62
  }
];

// All unique specializations from the mock data
export const allSpecializations = Array.from(
  new Set(mockCoaches.flatMap(coach => coach.specializations))
).sort();

// Pricing options
export const pricingOptions = [
  { value: 'any', label: 'Any' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'one-time', label: 'One-time Rate' }
];

// Helper to format sats to a readable format
export const formatSats = (sats: number) => {
  if (sats >= 1000000) {
    return `${(sats / 1000000).toFixed(1)}M sats`;
  } else if (sats >= 1000) {
    return `${(sats / 1000).toFixed(0)}K sats`;
  }
  return `${sats} sats`;
};

export type Coach = typeof mockCoaches[0];

// Helper function to check if user is logged in
export const isLoggedIn = () => {
  return localStorage.getItem('nostr_logged_in') === 'true';
}; 