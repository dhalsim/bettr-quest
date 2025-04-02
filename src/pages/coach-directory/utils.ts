import { mockCoaches } from "@/mock/data";

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