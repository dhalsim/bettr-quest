import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Activity, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChallengeCard from '@/components/ui/ChallengeCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock user data
const userData = {
  username: 'mindfulness_guru',
  displayName: 'Mindfulness Guru',
  bio: 'Meditation instructor and wellness advocate. Creating challenges to help people improve their mental health and wellbeing.',
  joinedDate: '2023-01-15T10:30:00Z',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format',
  followers: 248,
  following: 73
};

// Mock challenges created by the user
const userChallenges = [
  {
    id: '1',
    title: 'Meditate for 10 minutes',
    description: 'Meditate for at least 10 minutes to establish a mindfulness practice.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: '2023-05-15T10:30:00Z',
    category: 'Wellness',
    status: 'pending' as const,
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '2',
    title: 'Morning Gratitude',
    description: 'Write down three things you\'re grateful for this morning.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-05-01T08:45:00Z',
    dueDate: '2023-05-02T08:45:00Z',
    category: 'Wellness',
    status: 'pending' as const,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format',
    visibility: 'public' as const
  },
  {
    id: '3',
    title: 'Digital Detox Hour',
    description: 'Take a break from all digital devices for one hour.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-03-10T14:20:00Z',
    dueDate: '2023-03-10T18:20:00Z',
    category: 'Wellness',
    status: 'success' as const,
    imageUrl: 'https://images.unsplash.com/photo-1534705867302-2a41394d2a3b?q=80&w=600&auto=format',
    visibility: 'public' as const
  }
];

// Mock activities by the user
const userActivities = [
  {
    id: 'act1',
    type: 'proof_review',
    action: 'accepted',
    username: 'zen_master',
    challengeTitle: 'Meditate for 10 minutes',
    challengeId: '1',
    timestamp: '2023-04-22T15:30:00Z'
  },
  {
    id: 'act2',
    type: 'proof_review',
    action: 'rejected',
    username: 'wellness_beginner',
    challengeTitle: 'Digital Detox Hour',
    challengeId: '3',
    timestamp: '2023-03-20T09:15:00Z'
  },
  {
    id: 'act3',
    type: 'challenge_created',
    challengeTitle: 'Morning Gratitude',
    challengeId: '2',
    timestamp: '2023-05-01T08:45:00Z'
  }
];

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format the time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Explore
        </Link>
        
        <div className="glass rounded-2xl overflow-hidden mb-10">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-6">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={userData.profileImage} alt={userData.displayName} />
                <AvatarFallback className="text-2xl">
                  {userData.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-1">{userData.displayName}</h1>
                <p className="text-muted-foreground mb-3">@{userData.username}</p>
                <p className="mb-4">{userData.bio}</p>
                
                <div className="flex flex-wrap gap-4 items-center text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    Joined {formatDate(userData.joinedDate)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    {userData.followers} followers
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    {userData.following} following
                  </div>
                </div>
              </div>
              
              <Button
                variant={isFollowing ? "outline" : "primary"}
                onClick={toggleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="challenges">
          <TabsList className="glass mb-8">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Award size={16} />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity size={16} />
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenges">
            <h2 className="text-2xl font-semibold mb-6">Challenges by {userData.username}</h2>
            {userChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <p className="text-muted-foreground">No challenges created yet</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            {userActivities.length > 0 ? (
              <div className="space-y-4">
                {userActivities.map((activity) => (
                  <div key={activity.id} className="glass rounded-xl p-6">
                    {activity.type === 'proof_review' ? (
                      <div>
                        <p>
                          <span className="font-medium">{userData.username}</span>
                          {' '}
                          {activity.action === 'accepted' ? (
                            <span className="text-green-500">accepted</span>
                          ) : (
                            <span className="text-red-500">rejected</span>
                          )}
                          {' '}
                          a proof from{' '}
                          <Link to={`/profile/${activity.username}`} className="text-primary hover:underline">
                            @{activity.username}
                          </Link>
                          {' '}for the challenge{' '}
                          <Link to={`/challenge/${activity.challengeId}`} className="text-primary hover:underline">
                            {activity.challengeTitle}
                          </Link>
                        </p>
                      </div>
                    ) : activity.type === 'challenge_created' && (
                      <div>
                        <p>
                          <span className="font-medium">{userData.username}</span>
                          {' '}created a new challenge:{' '}
                          <Link to={`/challenge/${activity.challengeId}`} className="text-primary hover:underline">
                            {activity.challengeTitle}
                          </Link>
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
