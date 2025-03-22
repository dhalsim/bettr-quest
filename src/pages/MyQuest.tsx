import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestCard from '@/components/ui/QuestCard';

// Mock data for user quests
const userQuests = [
  {
    id: '1',
    title: 'Meditate for 20 minutes tomorrow',
    description: 'I want to begin my meditation practice by dedicating 20 minutes tomorrow to mindful meditation.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: '2023-04-16T10:30:00Z',
    category: 'Wellness',
    status: 'pending' as const,
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '4',
    title: 'Build a simple calculator app',
    description: 'I will code a basic calculator app using JavaScript to practice my coding skills.',
    userId: 'current-user',
    username: 'you',
    createdAt: '2023-04-01T09:00:00Z',
    dueDate: '2023-04-05T09:00:00Z',
    category: 'Learning',
    status: 'on_review' as const,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '5',
    title: 'Write a reflection journal entry',
    description: 'I will write a detailed journal entry reflecting on my personal growth this month.',
    userId: 'current-user',
    username: 'you',
    createdAt: '2023-03-15T11:30:00Z',
    dueDate: '2023-03-16T11:30:00Z',
    category: 'Wellness',
    status: 'success' as const,
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format',
    visibility: 'private' as const
  }
];

const MyQuest = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'on_review' | 'success' | 'failed'>('all');
  
  const filteredQuests = userQuests.filter(quest => {
    if (filter === 'all') return true;
    return quest.status === filter;
  });
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Quests</h1>
            <p className="text-muted-foreground">
              Track and manage all your personal quests
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'on_review' | 'success' | 'failed')}
              >
                <option value="all">All Quests</option>
                <option value="pending">Pending</option>
                <option value="on_review">On Review</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            
            <Link to="/create">
              <Button className="flex items-center gap-2">
                <PlusCircle size={18} />
                Create Quest
              </Button>
            </Link>
          </div>
        </div>
        
        {filteredQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl">
            <h3 className="text-xl font-medium mb-2">No quests found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? "You haven't created any quests yet." 
                : filter === 'pending'
                  ? "You don't have any pending quests."
                  : filter === 'on_review'
                    ? "You don't have any quests under review."
                    : filter === 'success'
                      ? "You haven't completed any quests successfully yet."
                      : "You don't have any failed quests."}
            </p>
            <Link to="/create">
              <Button className="flex items-center gap-2">
                <PlusCircle size={18} />
                Create Your First Quest
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuest;
