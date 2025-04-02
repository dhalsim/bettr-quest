import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockCoaches } from '@/mock/data';
import CoachList from '@/components/coach/CoachList';
import CoachFilters from '@/components/coach/CoachFilters';
import { Coach } from '@/types/coach';
import { isLoggedIn } from '@/pages/coach-directory/utils';

interface CoachDirectoryProps {
  onSelectCoach?: (coachId: string) => void;
  selectedCoachId?: string;
  questTags?: string[];
  showRegisterButton?: boolean;
  mode?: 'link' | 'select';
}

const CoachDirectory: React.FC<CoachDirectoryProps> = ({ 
  onSelectCoach,
  selectedCoachId,
  questTags = [],
  showRegisterButton = false,
  mode = 'link'
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedPricingOption, setSelectedPricingOption] = useState('any');
  const [rateRange, setRateRange] = useState([0, 1000000]);

  // Get min and max rates from the mock data
  const minRate = Math.min(...mockCoaches.map(coach => coach.rateAmount));
  const maxRate = Math.max(...mockCoaches.map(coach => coach.rateAmount));

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

  const filteredCoaches = mockCoaches.filter((coach: Coach) => {
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

  return (
    <div className={showRegisterButton ? "min-h-screen pt-32 pb-20 px-6" : "space-y-6"}>
      <div className={showRegisterButton ? "max-w-7xl mx-auto" : ""}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className={`${showRegisterButton ? "text-3xl" : "text-2xl"} font-bold mb-2`}>
              {t('coach-directory.Title')}
            </h1>
            <p className="text-muted-foreground mb-4">
              {t('coach-directory.Description')}
            </p>
          </div>
          
          {showRegisterButton && isLoggedIn() && (
            <Link to="/register-coach" className="btn-primary">
              {t('coach-directory.Register as Coach')}
            </Link>
          )}
        </div>
        
        <div className={showRegisterButton ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : ""}>
          {/* Filters sidebar */}
          <div className="mb-5">
            <CoachFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSpecializations={selectedSpecializations}
              toggleSpecialization={toggleSpecialization}
              selectedPricingOption={selectedPricingOption}
              setSelectedPricingOption={setSelectedPricingOption}
              rateRange={rateRange}
              setRateRange={setRateRange}
              minRate={minRate}
              maxRate={maxRate}
              mockCoaches={mockCoaches}
              resetFilters={resetFilters}
              totalCoaches={mockCoaches.length}
              filteredCoaches={filteredCoaches.length}
            />
          </div>
          
          {/* Coaches list */}
          <CoachList 
            coaches={filteredCoaches}
            mode={mode}
            selectedCoachId={selectedCoachId}
            onSelectCoach={onSelectCoach}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default CoachDirectory; 