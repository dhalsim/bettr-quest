
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ChallengeCard, { Challenge } from '@/components/ui/ChallengeCard';

// Mock data for challenges
const allChallenges: Challenge[] = [
  {
    id: '1',
    title: '30 Days of Meditation',
    description: 'Meditate for at least 10 minutes every day for 30 days to build a consistent practice.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: '2023-05-15T10:30:00Z',
    category: 'Wellness',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format'
  },
  {
    id: '2',
    title: 'Read 12 Books in a Year',
    description: 'Challenge yourself to read one book per month for an entire year to expand your knowledge.',
    userId: 'user2',
    username: 'bookworm',
    createdAt: '2023-03-01T08:15:00Z',
    dueDate: '2024-03-01T08:15:00Z',
    category: 'Learning',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600&auto=format'
  },
  {
    id: '3',
    title: 'Zero Waste Challenge',
    description: 'Minimize your waste production for a month by refusing, reducing, reusing, recycling, and composting.',
    userId: 'user3',
    username: 'eco_warrior',
    createdAt: '2023-04-22T14:45:00Z',
    dueDate: '2023-05-22T14:45:00Z',
    category: 'Environment',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format'
  },
  {
    id: '4',
    title: 'Couch to 5K Running Challenge',
    description: 'Transform from a couch potato to a 5K runner in 8 weeks with this gradual training program.',
    userId: 'user4',
    username: 'fitness_fan',
    createdAt: '2023-04-05T09:20:00Z',
    dueDate: '2023-05-31T09:20:00Z',
    category: 'Fitness',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format'
  },
  {
    id: '5',
    title: 'Learn a New Language Basics',
    description: 'Learn the basics of a new language in 30 days by practicing for 20 minutes each day.',
    userId: 'user5',
    username: 'language_lover',
    createdAt: '2023-03-15T11:10:00Z',
    dueDate: '2023-04-15T11:10:00Z',
    category: 'Learning',
    status: 'failed',
    imageUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=600&auto=format'
  },
  {
    id: '6',
    title: 'Digital Detox Weekend',
    description: 'Spend a weekend without digital devices to reset your relationship with technology.',
    userId: 'user6',
    username: 'digital_minimalist',
    createdAt: '2023-04-18T16:30:00Z',
    dueDate: '2023-04-23T16:30:00Z',
    category: 'Wellness',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1499377193864-82682aefed04?q=80&w=600&auto=format'
  },
  {
    id: '7',
    title: '100 Days of Code',
    description: 'Code for at least an hour every day for 100 days to build your programming skills.',
    userId: 'user7',
    username: 'code_ninja',
    createdAt: '2023-02-01T13:45:00Z',
    dueDate: '2023-05-12T13:45:00Z',
    category: 'Learning',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format'
  },
  {
    id: '8',
    title: 'Declutter Your Home in 30 Days',
    description: 'Systematically declutter your entire living space over the course of a month.',
    userId: 'user8',
    username: 'tidy_home',
    createdAt: '2023-04-01T10:00:00Z',
    dueDate: '2023-05-01T10:00:00Z',
    category: 'Lifestyle',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=600&auto=format'
  }
];

// Extract unique categories
const categories = Array.from(new Set(allChallenges.map(challenge => challenge.category)));

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>(allChallenges);
  
  // Filter challenges based on search term, categories, and status
  useEffect(() => {
    let filtered = [...allChallenges];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        challenge => 
          challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(challenge => 
        selectedCategories.includes(challenge.category)
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(challenge => challenge.status === selectedStatus);
    }
    
    setFilteredChallenges(filtered);
  }, [searchTerm, selectedCategories, selectedStatus]);
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedStatus('all');
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Explore Challenges</h1>
        <p className="text-muted-foreground max-w-3xl mb-12">
          Discover challenges created by our community. Filter by category, search for specific topics, or browse through all the inspiring ways people are bettering themselves.
        </p>
        
        {/* Search and Filters */}
        <div className="glass rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {/* Status filter */}
            <div className="min-w-36">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          {/* Category filters */}
          <div>
            <div className="flex items-center mb-3">
              <Filter size={16} className="mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
              {(searchTerm || selectedCategories.length > 0 || selectedStatus !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-full text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {filteredChallenges.length} {filteredChallenges.length === 1 ? 'Challenge' : 'Challenges'} Found
            </h2>
          </div>
          
          {filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl">
              <h3 className="text-xl font-medium mb-2">No challenges found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
