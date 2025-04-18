import React, { useMemo, useState } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { allSpecializations, formatSats, pricingOptions } from '@/pages/coach-directory/utils';
import { Coach } from '@/pages/coach-directory/utils';
import TagsSelector from '@/components/TagsSelector';
import { TagItem } from '@/types/quest';
import { useTranslation } from 'react-i18next';

interface CoachFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSpecializations: string[];
  toggleSpecialization: (tag: string) => void;
  selectedPricingOption: string;
  setSelectedPricingOption: (option: string) => void;
  rateRange: number[];
  setRateRange: (range: number[]) => void;
  minRate: number;
  maxRate: number;
  resetFilters?: () => void;
  mockCoaches: Coach[];
  totalCoaches?: number;
  filteredCoaches?: number;
}

const CoachFilters: React.FC<CoachFiltersProps> = ({
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
  resetFilters,
  mockCoaches,
  totalCoaches,
  filteredCoaches
}) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  
  // Calculate popularity based on how many coaches have each specialization
  const specializationTags = useMemo(() => {
    const specializationCounts = new Map<string, number>();
    
    mockCoaches.forEach(coach => {
      coach.specializations.forEach(spec => {
        const count = specializationCounts.get(spec) || 0;
        specializationCounts.set(spec, count + 1);
      });
    });
    
    return allSpecializations.map(spec => ({
      name: spec,
      popularity: specializationCounts.get(spec) || 0
    }));
  }, [mockCoaches]);

  // Convert specializationTags array to a Map for TagsSelector
  const specializationTagsMap = useMemo(() => {
    const map = new Map<string, TagItem>();
    specializationTags.forEach(tag => {
      map.set(tag.name, tag);
    });
    return map;
  }, [specializationTags]);

  // Handle resetting all filters
  const handleResetFilters = () => {
    if (resetFilters) {
      resetFilters();
    }
  };

  const isAnyFilterApplied = 
    searchQuery || 
    selectedSpecializations.length > 0 || 
    selectedPricingOption !== 'any' || 
    rateRange[0] !== minRate || 
    rateRange[1] !== maxRate;

  return (
    <div className="glass rounded-xl p-6 h-fit border-2 border-gray-300 mb-4">
      {/* Show total items vs filtered items if provided */}
      {totalCoaches !== undefined && filteredCoaches !== undefined && (
        <div className="text-sm text-muted-foreground mb-4">
          {t('coach-directory.filters.Showing {{count}} of {{total}} coaches', { count: filteredCoaches, total: totalCoaches })}
        </div>
      )}
      
      {/* Header with show/hide filters button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('coach-directory.filters.Title')}</h2>
        <div className="flex items-center gap-2">
          {resetFilters && isAnyFilterApplied && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters}
              className="text-sm"
              type="button"
            >
              {t('coach-directory.filters.Reset')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm flex items-center gap-1"
            type="button"
          >
            {showFilters ? (
              <>
                {t('coach-directory.filters.Hide')} <ChevronUp size={16} />
              </>
            ) : (
              <>
                {t('coach-directory.filters.Show')} <ChevronDown size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Search */}
      {showFilters && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">{t('coach-directory.filters.Search')}</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('coach-directory.filters.Search placeholder')}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Specialization tags using TagsSelector with title passed through props */}
      {showFilters && (
        <div className="mb-6">
          <TagsSelector
            title={t('coach-directory.filters.Specializations')}
            selectedTags={selectedSpecializations}
            availableTags={specializationTagsMap}
            onTagToggle={toggleSpecialization}
            allowCustomTags={false}
            maxVisibleTags={5}
            searchPlaceholder={t('coach-directory.filters.Search by typing')}
            totalItems={totalCoaches}
            filteredItems={filteredCoaches}
            onReset={() => selectedSpecializations.forEach(tag => toggleSpecialization(tag))}
          />
        </div>
      )}
      
      {/* Advanced filters (collapsible) */}
      {showFilters && (
        <>
          {/* Pricing option */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('coach-directory.filters.Pricing option')}</label>
            <RadioGroup 
              value={selectedPricingOption} 
              onValueChange={setSelectedPricingOption}
              className="flex flex-col space-y-2"
            >
              {pricingOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`pricing-${option.value}`} />
                  <Label htmlFor={`pricing-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Rate range slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('coach-directory.filters.Rate range')}</label>
              <span className="text-xs text-muted-foreground">
                {formatSats(rateRange[0])} - {formatSats(rateRange[1])}
              </span>
            </div>
            
            <Slider
              value={rateRange}
              min={minRate}
              max={maxRate}
              step={1000}
              onValueChange={setRateRange}
              className="mb-6"
            />
            
            {/* Rate histogram visualization */}
            <div className="flex h-16 space-x-1 items-end mt-2">
              {[...Array(10)].map((_, i) => {
                const rangeStart = minRate + (i * (maxRate - minRate) / 10);
                const rangeEnd = minRate + ((i + 1) * (maxRate - minRate) / 10);
                const coachesInRange = mockCoaches.filter(
                  coach => coach.rateAmount >= rangeStart && coach.rateAmount <= rangeEnd
                ).length;
                const maxHeight = 64; // 16px * 4
                const height = coachesInRange ? (coachesInRange / mockCoaches.length) * maxHeight : 4;
                
                return (
                  <div 
                    key={i}
                    className={`flex-1 bg-primary/30 rounded-t-sm`}
                    style={{ height: `${height}px` }}
                    title={`${coachesInRange} coaches between ${formatSats(rangeStart)} and ${formatSats(rangeEnd)}`}
                  ></div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoachFilters; 