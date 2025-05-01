import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataFetcher } from '@/lib/fetcher';
import CoachList from '@/components/coach/CoachList';
import CoachFilters from '@/components/coach/CoachFilters';
import CoachSorting, { SortOption } from '@/components/coach/CoachSorting';
import { getMinMaxRates, getSmartRating, filterCoaches } from '@/lib/coach-directory';
import type { Coach } from '@/types/coach';

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
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rateRange, setRateRange] = useState([0, 0]);
  const [sortBy, setSortBy] = useState<SortOption>('ByRating');

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        const fetchedCoaches = await dataFetcher.getCoaches();
        setCoaches(fetchedCoaches);
        const { minRate, maxRate } = getMinMaxRates(fetchedCoaches);
        setRateRange([minRate, maxRate]);
      } catch (error) {
        console.error('Failed to load coaches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCoaches();
  }, []);

  useEffect(() => {
    if (questTags.length > 0 && coaches.length > 0) {
      const validSpecializations = questTags.filter(tag => 
        coaches.some(coach => coach.specializations.includes(tag))
      );
      
      if (validSpecializations.length > 0) {
        setSelectedSpecializations(validSpecializations);
      }
    }
  }, [questTags, coaches]);

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
    setRateRange([0, 0]);
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

  if (isLoading) {
    return <div>Loading coaches...</div>;
  }

  const filterProps = {
    searchQuery,
    setSearchQuery,
    selectedSpecializations,
    toggleSpecialization,
    selectedPricingOption,
    setSelectedPricingOption,
    rateRange,
    setRateRange,
    minRate: rateRange[0],
    maxRate: rateRange[1],
    mockCoaches: coaches,
    resetFilters,
    totalCoaches: coaches.length,
    filteredCoaches: filteredCoaches.length
  };

  return (
    <div className="space-y-6">
      <CoachFilters {...filterProps} coaches={coaches} />
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