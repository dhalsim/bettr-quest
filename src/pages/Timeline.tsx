
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';
import ChallengeCard from '@/components/ui/ChallengeCard';
import { Button } from '@/components/ui/button';
import { useNostrAuth } from '@/hooks/useNostrAuth';

// Mock data for timeline quests (from people you follow)
const timelineQuests = [
  {
    id: '1',
    title: 'Meditate for 20 minutes tomorrow',
    description: 'I want to begin my meditation practice by dedicating 20 minutes tomorrow to mindful meditation.',
    userId: 'npub1abc123',
    username: 'meditation_master',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: '2023-04-16T10:30:00Z',
    category: 'Wellness',
    status: 'pending' as const,
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '2',
    title: 'Learn 5 phrases in Italian',
    description: 'I will learn and memorize 5 useful Italian phrases for my upcoming trip.',
    userId: 'npub2def456',
    username: 'polyglot_learner',
    createdAt: '2023-04-08T14:20:00Z',
    dueDate: '2023-04-12T14:20:00Z',
    category: 'Learning',
    status: 'on_review' as const,
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '3',
    title: 'Run 5km in under 30 minutes',
    description: 'I want to improve my running pace and complete a 5km run in under 30 minutes.',
    userId: 'npub3ghi789',
    username: 'runner_joe',
    createdAt: '2023-04-10T09:15:00Z',
    dueDate: '2023-04-20T09:15:00Z',
    category: 'Fitness',
    status: 'success' as const,
    imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '4',
    title: 'Write a short story in one day',
    description: 'Challenge myself to write a 1000-word short story in a single day.',
    userId: 'npub4jkl012',
    username: 'storyteller',
    createdAt: '2023-04-12T16:45:00Z',
    dueDate: '2023-04-13T16:45:00Z',
    category: 'Creativity',
    status: 'failed' as const,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '5',
    title: 'Complete a challenging coding problem',
    description: 'I will solve a difficult algorithm problem from LeetCode.',
    userId: 'npub5mno345',
    username: 'code_ninja',
    createdAt: '2023-04-14T11:30:00Z',
    dueDate: '2023-04-18T11:30:00Z',
    category: 'Technology',
    status: 'in_dispute' as const,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format',
    visibility: 'public' as const
  }
];

// Mock data for people you might want to follow
const suggestedUsers = [
  {
    id: 'npub3ghi789',
    username: 'fitness_fanatic',
    bio: 'Daily fitness quests and nutrition tips',
    following: false
  },
  {
    id: 'npub4jkl012',
    username: 'book_worm',
    bio: 'Reading quests and book recommendations',
    following: false
  },
  {
    id: 'npub5mno345',
    username: 'code_ninja',
    bio: 'Coding quests for developers of all levels',
    following: true
  }
];

const Timeline = () => {
  const [users, setUsers] = useState(suggestedUsers);
  const { isLoggedIn } = useNostrAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connect');
    }
  }, [isLoggedIn, navigate]);

  const toggleFollow = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, following: !user.following } 
        : user
    ));
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main timeline content */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Your Timeline</h1>
            <p className="text-muted-foreground mb-10">
              Quests from people you follow
            </p>
            
            {timelineQuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {timelineQuests.map((quest) => (
                  <Link key={quest.id} to={`/quest/${quest.id}`}>
                    <ChallengeCard challenge={quest} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-2xl">
                <h3 className="text-xl font-medium mb-2">Your timeline is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start following people to see their quests here
                </p>
                <Link to="/explore">
                  <Button>
                    Explore Quests
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Sidebar with suggested follows */}
          <div className="lg:w-1/3">
            <div className="glass rounded-2xl p-6 sticky top-32">
              <h2 className="text-xl font-semibold mb-4">Suggested Follows</h2>
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <h3 className="font-medium">@{user.username}</h3>
                      <p className="text-sm text-muted-foreground">{user.bio}</p>
                    </div>
                    <Button
                      variant={user.following ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleFollow(user.id)}
                      className="flex items-center gap-1"
                    >
                      {user.following ? <UserCheck size={16} /> : <UserPlus size={16} />}
                      <span>{user.following ? 'Following' : 'Follow'}</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
