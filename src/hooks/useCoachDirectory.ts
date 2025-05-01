import { useState, useEffect } from 'react';
import { getMinMaxRates, getSmartRating, filterCoaches } from '@/lib/coach-directory';
import { SortOption } from '@/components/coach/CoachSorting';
import { Coach } from '@/types/coach';

export const useCoachDirectory = (coaches: Coach[], initialSpecializations: string[] = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(initialSpecializations);
  const [selectedPricingOption, setSelectedPricingOption] = useState('any');
  const [rateRange, setRateRange] = useState([0, 0]);
  const [sortBy, setSortBy] = useState<SortOption>('ByRating');

  // Update rate range when coaches change
  useEffect(() => {
    if (coaches.length > 0) {
      const { minRate, maxRate } = getMinMaxRates(coaches);
      setRateRange([minRate, maxRate]);
    }
  }, [coaches]);

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
    if (coaches.length > 0) {
      const { minRate, maxRate } = getMinMaxRates(coaches);
      setRateRange([minRate, maxRate]);
    }
  };

  const filteredCoaches = filterCoaches(
    searchQuery,
    selectedSpecializations,
    selectedPricingOption,
    rateRange,
    coaches
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
    minRate: coaches.length > 0 ? getMinMaxRates(coaches).minRate : 0,
    maxRate: coaches.length > 0 ? getMinMaxRates(coaches).maxRate : 0,
    coaches,
    resetFilters,
    totalCoaches: coaches.length,
    filteredCoaches: filteredCoaches.length
  };

  return {
    filterProps,
    sortedCoaches,
    sortBy,
    setSortBy,
    resetFilters,
  };
}; 