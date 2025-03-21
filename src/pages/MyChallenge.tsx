
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import ChallengeCard from '@/components/ui/ChallengeCard';

// Mock data for user challenges
const userChallenges = [
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
    id: '4',
    title: 'Learn to Code in 30 Days',
    description: 'Build a small project every day for 30 days to improve your coding skills.',
    userId: 'current-user',
    username: 'you',
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
    userId: 'current-user',
    username: 'you',
    createdAt: '2023-03-15T11:30:00Z',
    dueDate: '2023-04-15T11:30:00Z',
    category: 'Wellness',
    status: 'completed' as const,
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format'
  }
];

const MyChallenge = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const filteredChallenges = userChallenges.filter(challenge => {
    if (filter === 'all') return true;
    return challenge.status === filter;
  });
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Challenges</h1>
            <p className="text-muted-foreground">
              Track and manage all your personal challenges
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
              >
                <option value="all">All Challenges</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            
            <Link to="/create">
              <Button leftIcon={<PlusCircle size={18} />}>
                Create Challenge
              </Button>
            </Link>
          </div>
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
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? "You haven't created or joined any challenges yet." 
                : filter === 'active'
                  ? "You don't have any active challenges."
                  : "You haven't completed any challenges yet."}
            </p>
            <Link to="/create">
              <Button leftIcon={<PlusCircle size={18} />}>
                Create Your First Challenge
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChallenge;
