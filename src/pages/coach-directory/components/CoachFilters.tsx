import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { allSpecializations, formatSats, pricingOptions } from '../utils';
import { Coach } from '..';
import TagsSelector, { TagItem } from '@/components/TagsSelector';

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
  resetFilters: () => void;
  mockCoaches: Coach[];
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
  mockCoaches
}) => {
  // Calculate popularity based on how many coaches have each specialization
  const specializationTags: TagItem[] = useMemo(() => {
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

  return (
    <div className="glass rounded-xl p-6 h-fit lg:sticky lg:top-32 border-2 border-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="text-sm"
        >
          Reset
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search coaches..."
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
      
      {/* Specialization tags using TagsSelector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Specializations</label>
        <TagsSelector
          selectedTags={selectedSpecializations}
          availableTags={specializationTags}
          onTagToggle={toggleSpecialization}
          allowCustomTags={false}
          maxVisibleTags={5}
        />
      </div>
      
      {/* Pricing option */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Pricing Option</label>
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
          <label className="block text-sm font-medium">Rate Range</label>
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
    </div>
  );
};

export default CoachFilters;
