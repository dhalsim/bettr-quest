import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestCard from '@/components/ui/QuestCard';
import { useSearchParams } from 'react-router-dom';
import TagsSelector, { TagItem } from '@/components/TagsSelector';

// Mock data for quests with updated examples
const allQuests = [
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
    id: '2',
    title: 'Learn 10 new Spanish words',
    description: 'I will learn and memorize 10 new Spanish words by the end of this week.',
    userId: 'user2',
    username: 'language_lover',
    createdAt: '2023-04-10T15:45:00Z',
    dueDate: '2023-04-17T15:45:00Z',
    category: 'Learning',
    status: 'pending' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546500840-ae38253aba9b?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '3',
    title: 'Go for a 5K run',
    description: 'I will complete a 5K run this weekend to improve my cardiovascular health.',
    userId: 'user3',
    username: 'fitness_enthusiast',
    createdAt: '2023-04-05T08:20:00Z',
    dueDate: '2023-04-09T08:20:00Z',
    category: 'Fitness',
    status: 'success' as const,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '4',
    title: 'Build a simple calculator app',
    description: 'I will code a basic calculator app using JavaScript to practice my coding skills.',
    userId: 'user4',
    username: 'code_master',
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
    userId: 'user5',
    username: 'mindful_writer',
    createdAt: '2023-03-15T11:30:00Z',
    dueDate: '2023-03-16T11:30:00Z',
    category: 'Wellness',
    status: 'success' as const,
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '6',
    title: 'Have a zero-waste day',
    description: 'I will attempt to produce zero waste for an entire day by avoiding single-use products.',
    userId: 'user6',
    username: 'eco_warrior',
    createdAt: '2023-03-01T14:15:00Z',
    dueDate: '2023-03-02T14:15:00Z',
    category: 'Sustainability',
    status: 'failed' as const,
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format',
    visibility: 'public' as const
  }
];

// Categories converted to tags with popularity
const availableTags: TagItem[] = [
  { name: "Wellness", popularity: 90 },
  { name: "Fitness", popularity: 85 },
  { name: "Learning", popularity: 80 },
  { name: "Sustainability", popularity: 75 },
  { name: "Productivity", popularity: 70 },
  { name: "Technology", popularity: 65 },
  { name: "Music", popularity: 60 },
  { name: "Art", popularity: 55 },
  { name: "Writing", popularity: 50 },
  { name: "Finance", popularity: 45 },
  { name: "Travel", popularity: 40 },
  { name: "Food", popularity: 35 },
  { name: "Photography", popularity: 30 },
  { name: "Reading", popularity: 25 },
  { name: "Gaming", popularity: 20 },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    categoryParam && categoryParam !== 'All' ? [categoryParam] : []
  );
  const [filteredQuests, setFilteredQuests] = useState(allQuests);
  
  useEffect(() => {
    const filtered = allQuests.filter(quest => {
      const matchesQuery = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.includes(quest.category);
      
      return matchesQuery && matchesTags;
    });
    
    setFilteredQuests(filtered);
    
    if (selectedTags.length === 1) {
      setSearchParams({ category: selectedTags[0] });
    } else {
      setSearchParams({});
    }
  }, [selectedTags, searchQuery, setSearchParams]);
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Explore Quests</h1>
          <p className="text-muted-foreground">
            Discover quests created by users and follow their journeys
          </p>
        </div>
        
        <div className="glass rounded-2xl p-6 mb-10">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="pl-10 px-4 py-3 w-full bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Search quests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <TagsSelector
              selectedTags={selectedTags}
              availableTags={availableTags}
              onTagToggle={toggleTag}
              allowCustomTags={false}
              maxVisibleTags={5}
              searchPlaceholder="Search by typing"
            />
            
            <Button type="submit" className="w-full md:w-auto">
              Search
            </Button>
          </form>
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
