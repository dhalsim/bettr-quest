
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

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
const allSpecializations = Array.from(
  new Set(mockCoaches.flatMap(coach => coach.specializations))
).sort();

// Pricing options
const pricingOptions = [
  { value: 'any', label: 'Any' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'one-time', label: 'One-time Rate' }
];

// Helper to format sats to a readable format
const formatSats = (sats: number) => {
  if (sats >= 1000000) {
    return `${(sats / 1000000).toFixed(1)}M sats`;
  } else if (sats >= 1000) {
    return `${(sats / 1000).toFixed(0)}K sats`;
  }
  return `${sats} sats`;
};

const CoachDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationSearch, setSpecializationSearch] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedPricingOption, setSelectedPricingOption] = useState('any');
  const [rateRange, setRateRange] = useState([0, 100000]);
  
  // Get min and max rates from the mock data
  const minRate = Math.min(...mockCoaches.map(coach => coach.rateAmount));
  const maxRate = Math.max(...mockCoaches.map(coach => coach.rateAmount));
  
  // Filter specializations based on search
  const filteredSpecializations = useMemo(() => {
    if (!specializationSearch.trim()) return allSpecializations;
    return allSpecializations.filter(tag => 
      tag.toLowerCase().includes(specializationSearch.toLowerCase())
    );
  }, [specializationSearch]);
  
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
  
  // Add or remove specialization from the selected list
  const toggleSpecialization = (tag: string) => {
    if (selectedSpecializations.includes(tag)) {
      setSelectedSpecializations(selectedSpecializations.filter(t => t !== tag));
    } else {
      setSelectedSpecializations([...selectedSpecializations, tag]);
    }
  };
  
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
            
            {/* Specialization search and tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Specializations</label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search specializations..."
                  className="pl-9"
                  value={specializationSearch}
                  onChange={(e) => setSpecializationSearch(e.target.value)}
                />
                {specializationSearch && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSpecializationSearch('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredSpecializations.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedSpecializations.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSpecialization(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
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
          
          {/* Coaches list */}
          <div className="lg:col-span-3">
            {filteredCoaches.length > 0 ? (
              <div className="space-y-10">
                {filteredCoaches.map(coach => (
                  <div key={coach.id}>
                    <Link to={`/profile/${coach.username}`}>
                      <div className="glass rounded-xl overflow-hidden transition-all hover:shadow-md hover:bg-card/70 border-2 border-gray-300">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/20">
                              <AvatarImage src={coach.profileImage} alt={coach.name} />
                              <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="text-xl font-semibold">{coach.name}</h3>
                                  <p className="text-muted-foreground">@{coach.username}</p>
                                </div>
                                
                                <div className="flex flex-col items-end">
                                  <p className="font-semibold text-primary">
                                    {formatSats(coach.rateAmount)}
                                    <span className="text-muted-foreground text-sm ml-1">
                                      {coach.pricingOption === 'hourly' ? '/hour' : ' one-time'}
                                    </span>
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <div className="text-yellow-500">★</div>
                                    <span className="font-medium">{coach.rating}</span>
                                    <span className="text-sm text-muted-foreground">
                                      ({coach.reviewCount} reviews)
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="mb-3 line-clamp-2">{coach.bio}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {coach.specializations.map(tag => (
                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-12 text-center border-2 border-gray-300">
                <h3 className="text-xl font-semibold mb-2">No coaches found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to find more coaches
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}
          </div>
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
