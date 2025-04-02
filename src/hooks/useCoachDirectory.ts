import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockCoaches } from '@/mock/data';
import { getMinMaxRates, getSmartRating, filterCoaches } from '@/lib/coach-directory';
import { SortOption } from '@/components/coach/CoachSorting';

export const useCoachDirectory = (initialSpecializations: string[] = []) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(initialSpecializations);
  const [selectedPricingOption, setSelectedPricingOption] = useState('any');
  const { minRate, maxRate } = getMinMaxRates();
  const [rateRange, setRateRange] = useState([minRate, maxRate]);
  const [sortBy, setSortBy] = useState<SortOption>('ByRating');

  const toggleSpecialization = (tag: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpecializations(initialSpecializations);
    setSelectedPricingOption('any');
    setRateRange([minRate, maxRate]);
  };

  const filteredCoaches = filterCoaches(
    searchQuery,
    selectedSpecializations,
    selectedPricingOption,
    rateRange
  );

  // Sort the filtered coaches
  const sortedCoaches = [...filteredCoaches].sort((a, b) => {
    let smartRatingA, smartRatingB;
    
    switch (sortBy) {
      case 'ByRating':
        smartRatingA = getSmartRating(a.rating, a.reviewCount);
        smartRatingB = getSmartRating(b.rating, b.reviewCount);
        return smartRatingB - smartRatingA;
      case 'ByPriceDesc':
        return b.rateAmount - a.rateAmount;
      case 'ByPriceAsc':
        return a.rateAmount - b.rateAmount;
      default:
        return 0;
    }
  });

  const filterProps = {
    searchQuery,
    setSearchQuery,
    selectedSpecializations,
    toggleSpecialization,
    selectedPricingOption,
    setSelectedPricingOption,
    rateRange,
    setRateRange,
    minRate,
    maxRate,
    mockCoaches,
    resetFilters,
    totalCoaches: mockCoaches.length,
    filteredCoaches: filteredCoaches.length
  };

  return {
    filterProps,
    sortedCoaches,
    sortBy,
    setSortBy,
    resetFilters,
    t
  };
}; 