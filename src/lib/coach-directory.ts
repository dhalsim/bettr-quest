import { SortOption } from '@/components/coach/CoachSorting';
import { mockCoaches } from '@/mock/data';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Get min and max rates from the mock data
export const getMinMaxRates = () => {
  const minRate = Math.min(...mockCoaches.map(coach => coach.rateAmount));
  const maxRate = Math.max(...mockCoaches.map(coach => coach.rateAmount));
  return { minRate, maxRate };
};

// Calculate smart rating using Wilson score interval
export const getSmartRating = (rating: number, reviewCount: number) => {
  if (reviewCount === 0) return 0;
  // Wilson score interval for 95% confidence
  const z = 1.96; // 95% confidence
  const p = rating / 5; // Convert to 0-1 scale
  const denominator = 1 + z * z / reviewCount;
  const center = (p + z * z / (2 * reviewCount)) / denominator;
  const interval = z * Math.sqrt((p * (1 - p) + z * z / (4 * reviewCount)) / reviewCount) / denominator;
  return center + interval; // Use upper bound of interval
};

// Filter coaches based on criteria
export const filterCoaches = (
  searchQuery: string,
  selectedSpecializations: string[],
  selectedPricingOption: string,
  rateRange: number[]
) => {
  return mockCoaches.filter((coach) => {
    // Filter by search query
    const matchesSearch = 
      coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.specializations.some(specialization => 
        specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Filter by specializations
    const matchesSpecializations = 
      selectedSpecializations.length === 0 || 
      selectedSpecializations.every(spec => coach.specializations.includes(spec));
    
    // Filter by pricing option
    const matchesPricing = 
      selectedPricingOption === 'any' ||
      (selectedPricingOption === 'hourly' && coach.pricingOption === 'hourly') ||
      (selectedPricingOption === 'one-time' && coach.pricingOption === 'one-time');

    // Filter by rate range
    const matchesRate = 
      coach.rateAmount >= rateRange[0] && 
      coach.rateAmount <= rateRange[1];

    return matchesSearch && matchesSpecializations && matchesPricing && matchesRate;
  });
}; 
