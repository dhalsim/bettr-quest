
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CoachFilters from './components/CoachFilters';
import CoachList from './components/CoachList';

// Mock coaches data
const mockCoaches = [
  {
    id: 'coach1',
    name: 'Alex Thompson',
    username: 'coach_alex',
    profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    bio: 'Certified fitness coach with 8+ years experience. Specializing in strength training and habit formation.',
    specializations: ['Fitness', 'Nutrition', 'Wellness'],
    pricingOption: 'hourly',
    rateAmount: 25000,
    rating: 4.9,
    reviewCount: 127
  },
  {
    id: 'coach2',
    name: 'Maya Williams',
    username: 'mindful_maya',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    bio: 'Mindfulness expert and meditation teacher. I help people reduce stress and build healthy mental habits.',
    specializations: ['Wellness', 'Meditation', 'Productivity'],
    pricingOption: 'one-time',
    rateAmount: 50000,
    rating: 4.8,
    reviewCount: 93
  },
  {
    id: 'coach3',
    name: 'Daniel Chen',
    username: 'tech_daniel',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    bio: 'Software engineer and coding mentor. Specialized in helping people build coding habits and learn new programming skills.',
    specializations: ['Coding', 'Technology', 'Education'],
    pricingOption: 'hourly',
    rateAmount: 35000,
    rating: 4.7,
    reviewCount: 81
  },
  {
    id: 'coach4',
    name: 'Sarah Johnson',
    username: 'finance_sarah',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
    bio: 'Financial advisor helping people develop better money habits and reach their financial goals.',
    specializations: ['Finance', 'Productivity', 'Education'],
    pricingOption: 'one-time',
    rateAmount: 45000,
    rating: 4.6,
    reviewCount: 62
  }
];

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

// Helper function to check if user is logged in
const isLoggedIn = () => {
  return localStorage.getItem('nostr_logged_in') === 'true';
};

export default CoachDirectory;
