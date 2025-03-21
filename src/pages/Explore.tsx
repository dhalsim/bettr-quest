
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import ChallengeCard from '@/components/ui/ChallengeCard';

// Mock data for challenges
const allChallenges = [
  {
    id: '1',
    title: '30 Days of Meditation',
    description: 'Meditate for at least 10 minutes every day for 30 days to build a consistent practice.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: '2023-05-15T10:30:00Z',
    category: 'Wellness',
    status: 'active' as const,
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format'
  },
  {
    id: '2',
    title: 'Learn a New Language',
    description: 'Study a new language for at least 15 minutes every day for 60 days.',
    userId: 'user2',
    username: 'language_lover',
    createdAt: '2023-04-10T15:45:00Z',
    dueDate: '2023-06-10T15:45:00Z',
    category: 'Learning',
    status: 'active' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546500840-ae38253aba9b?q=80&w=600&auto=format'
  },
  {
    id: '3',
    title: 'Daily Exercise Challenge',
    description: 'Complete at least 30 minutes of physical activity every day for 21 days.',
    userId: 'user3',
    username: 'fitness_enthusiast',
    createdAt: '2023-04-05T08:20:00Z',
    dueDate: '2023-04-26T08:20:00Z',
    category: 'Fitness',
    status: 'completed' as const,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format'
  },
  {
    id: '4',
    title: 'Learn to Code in 30 Days',
    description: 'Build a small project every day for 30 days to improve your coding skills.',
    userId: 'user4',
    username: 'code_master',
    createdAt: '2023-04-01T09:00:00Z',
    dueDate: '2023-05-01T09:00:00Z',
    category: 'Learning',
    status: 'active' as const,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format'
  },
  {
    id: '5',
    title: 'Daily Journaling',
    description: 'Write in your journal every day for 30 days to reflect on your thoughts and experiences.',
    userId: 'user5',
    username: 'mindful_writer',
    createdAt: '2023-03-15T11:30:00Z',
    dueDate: '2023-04-15T11:30:00Z',
    category: 'Wellness',
    status: 'completed' as const,
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format'
  },
  {
    id: '6',
    title: 'Zero Waste Week',
    description: 'Try to produce zero waste for 7 days by avoiding single-use products and packaging.',
    userId: 'user6',
    username: 'eco_warrior',
    createdAt: '2023-03-01T14:15:00Z',
    dueDate: '2023-03-08T14:15:00Z',
    category: 'Sustainability',
    status: 'completed' as const,
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format'
  }
];

const categories = ['All', 'Wellness', 'Fitness', 'Learning', 'Sustainability'];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredChallenges, setFilteredChallenges] = useState(allChallenges);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter challenges based on search query and selected category
    const filtered = allChallenges.filter(challenge => {
      const matchesQuery = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;
      
      return matchesQuery && matchesCategory;
    });
    
    setFilteredChallenges(filtered);
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Explore Challenges</h1>
          <p className="text-muted-foreground">
            Discover challenges created by the community and join them
          </p>
        </div>
        
        <div className="glass rounded-2xl p-6 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="pl-10 px-4 py-3 w-full bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-5 w-5 text-muted-foreground" />
              </div>
              <select
                className="pl-10 px-4 py-3 w-full bg-background border border-border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <Button type="submit" className="md:w-auto">
              Search
            </Button>
          </form>
        </div>
        
        {filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl">
            <h3 className="text-xl font-medium mb-2">No challenges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
