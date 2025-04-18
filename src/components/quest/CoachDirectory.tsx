import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockCoaches } from '@/mock/data';
import CoachList from '@/components/coach/CoachList';
import CoachFilters from '@/components/coach/CoachFilters';
import CoachSorting, { SortOption } from '@/components/coach/CoachSorting';
import { getMinMaxRates, getSmartRating, filterCoaches } from '@/lib/coach-directory';

interface CoachDirectoryProps {
  onSelectCoach?: (coachId: string) => void;
  selectedCoachId?: string;
  questTags?: string[];
}

const CoachDirectory: React.FC<CoachDirectoryProps> = ({ 
  onSelectCoach,
  selectedCoachId,
  questTags = []
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedPricingOption, setSelectedPricingOption] = useState('any');
  const { minRate, maxRate } = getMinMaxRates();
  const [rateRange, setRateRange] = useState([minRate, maxRate]);
  const [sortBy, setSortBy] = useState<SortOption>('ByRating');

  useEffect(() => {
    if (questTags.length > 0) {
      const validSpecializations = questTags.filter(tag => 
        mockCoaches.some(coach => coach.specializations.includes(tag))
      );
      
      if (validSpecializations.length > 0) {
        setSelectedSpecializations(validSpecializations);
      }
    }
  }, [questTags]);

  const toggleSpecialization = (tag: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpecializations([]);
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

  return (
    <div className="space-y-6">
      <CoachFilters {...filterProps} />
      <div className="flex justify-end">
        <CoachSorting sortBy={sortBy} onSortChange={setSortBy} />
      </div>
      <CoachList 
        coaches={sortedCoaches}
        mode="select"
        selectedCoachId={selectedCoachId}
        onSelectCoach={onSelectCoach}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default CoachDirectory; 