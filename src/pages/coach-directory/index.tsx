import { useState } from 'react';
import { Link } from 'react-router-dom';
import CoachFilters from './components/CoachFilters';
import CoachList from './components/CoachList';
import { mockCoaches, isLoggedIn } from './utils';

export type Coach = typeof mockCoaches[0];

const CoachDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationSearch, setSpecializationSearch] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedPricingOption, setSelectedPricingOption] = useState('any');
  const [rateRange, setRateRange] = useState([0, 100000]);
  
  // Get min and max rates from the mock data
  const minRate = Math.min(...mockCoaches.map(coach => coach.rateAmount));
  const maxRate = Math.max(...mockCoaches.map(coach => coach.rateAmount));
  
  // Filter coaches based on selected filters
  const filteredCoaches = mockCoaches.filter(coach => {
    // Filter by search query
    const matchesSearch = 
      coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by specializations
    const matchesSpecializations = 
      selectedSpecializations.length === 0 || 
      selectedSpecializations.some(tag => coach.specializations.includes(tag));
    
    // Filter by pricing option
    const matchesPricingOption = 
      selectedPricingOption === 'any' || 
      coach.pricingOption === selectedPricingOption;
    
    // Filter by rate range
    const matchesRateRange = 
      coach.rateAmount >= rateRange[0] && 
      coach.rateAmount <= rateRange[1];
    
    return matchesSearch && matchesSpecializations && matchesPricingOption && matchesRateRange;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSpecializationSearch('');
    setSelectedSpecializations([]);
    setSelectedPricingOption('any');
    setRateRange([minRate, maxRate]);
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Coach Directory</h1>
            <p className="text-muted-foreground mb-4">
              Find the perfect coach to help you achieve your goals
            </p>
          </div>
          
          {isLoggedIn() && (
            <Link to="/register-coach" className="btn-primary">
              Register as a Coach
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <CoachFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            specializationSearch={specializationSearch}
            setSpecializationSearch={setSpecializationSearch}
            selectedSpecializations={selectedSpecializations}
            toggleSpecialization={(tag) => {
              if (selectedSpecializations.includes(tag)) {
                setSelectedSpecializations(selectedSpecializations.filter(t => t !== tag));
              } else {
                setSelectedSpecializations([...selectedSpecializations, tag]);
              }
            }}
            selectedPricingOption={selectedPricingOption}
            setSelectedPricingOption={setSelectedPricingOption}
            rateRange={rateRange}
            setRateRange={setRateRange}
            minRate={minRate}
            maxRate={maxRate}
            resetFilters={resetFilters}
            mockCoaches={mockCoaches}
          />
          
          {/* Coaches list */}
          <CoachList 
            coaches={filteredCoaches} 
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default CoachDirectory;
