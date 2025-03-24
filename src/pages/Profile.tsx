import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Activity, Award, MessageSquare, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import QuestCard from '@/components/ui/QuestCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/ui/StarRating';

// Mock user data
const userData = {
  username: 'mindfulness_guru',
  displayName: 'Mindfulness Guru',
  bio: 'Meditation instructor and wellness advocate. Creating challenges to help people improve their mental health and wellbeing.',
  joinedDate: '2023-01-15T10:30:00Z',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format',
  followers: 248,
  following: 73,
  isCoach: true,
  rating: 4.7,
  reviewCount: 32
};

// User profiles for coaches
const coachProfiles = {
  'coach_alex': {
    username: 'coach_alex',
    displayName: 'Coach Alex',
    bio: 'Certified fitness trainer with 7+ years of experience. Specializing in strength training and nutrition planning.',
    joinedDate: '2022-05-10T08:20:00Z',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format',
    followers: 1240,
    following: 86,
    isCoach: true,
    rating: 4.9,
    reviewCount: 124
  },
  'mindfulness_guru': userData
};

// Mock quests created by the user
const userQuests = [
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

// Mock reviews data
const mockReviews = {
  'coach_alex': [
    {
      id: 'rev1',
      reviewerUsername: 'fitness_enthusiast',
      reviewerDisplayName: 'Emma Wilson',
      reviewerImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=300&auto=format',
      rating: 5,
      content: 'Coach Alex completely transformed my approach to fitness. The personalized training plan was exactly what I needed!',
      date: '2023-11-15T14:30:00Z'
    },
    {
      id: 'rev2',
      reviewerUsername: 'wellness_seeker',
      reviewerDisplayName: 'Mark Johnson',
      reviewerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format',
      rating: 4.5,
      content: 'Great coach who really knows his stuff. Very responsive and supportive throughout my fitness journey.',
      date: '2023-10-22T09:15:00Z'
    },
    {
      id: 'rev3',
      reviewerUsername: 'health_first',
      reviewerDisplayName: 'Sarah Miller',
      reviewerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format',
      rating: 5,
      content: 'The nutrition advice alone was worth every penny. I\'ve lost 15 pounds and feel amazing!',
      date: '2023-09-05T16:45:00Z'
    }
  ],
  'mindfulness_guru': [
    {
      id: 'rev4',
      reviewerUsername: 'zen_student',
      reviewerDisplayName: 'David Chen',
      reviewerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format',
      rating: 5,
      content: 'The meditation techniques I learned have truly changed my daily life. Highly recommend!',
      date: '2023-08-12T11:20:00Z'
    },
    {
      id: 'rev5',
      reviewerUsername: 'stress_free',
      reviewerDisplayName: 'Olivia Parker',
      reviewerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format',
      rating: 4,
      content: 'Great guidance and very patient with beginners. Would have liked a bit more personalized feedback.',
      date: '2023-07-28T13:10:00Z'
    }
  ]
};

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileData, setProfileData] = useState(userData);
  const [reviews, setReviews] = useState<any[]>([]);
  
  useEffect(() => {
    // If we have a username and it exists in our coach profiles, use that data
    if (username && coachProfiles[username as keyof typeof coachProfiles]) {
      setProfileData(coachProfiles[username as keyof typeof coachProfiles]);
      
      // Set reviews if available
      if (mockReviews[username as keyof typeof mockReviews]) {
        setReviews(mockReviews[username as keyof typeof mockReviews]);
      } else {
        setReviews([]);
      }
    } else {
      // Default to our main user data
      setProfileData(userData);
      setReviews(mockReviews.mindfulness_guru || []);
    }
  }, [username]);
  
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
                <AvatarImage src={profileData.profileImage} alt={profileData.displayName} />
                <AvatarFallback className="text-2xl">
                  {profileData.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold">{profileData.displayName}</h1>
                  {profileData.isCoach ? (
                    <Badge variant="secondary" className="bg-primary/20 hover:bg-primary/30">Coach</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-secondary/20 hover:bg-secondary/30">Challenger</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">@{profileData.username}</p>
                
                {profileData.isCoach && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={profileData.rating} size={18} />
                    <span className="text-sm font-medium">
                      {profileData.rating.toFixed(1)}/5
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({profileData.reviewCount} reviews)
                    </span>
                  </div>
                )}
                
                <p className="mb-4">{profileData.bio}</p>
                
                <div className="flex flex-wrap gap-4 items-center text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    Joined {formatDate(profileData.joinedDate)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    {profileData.followers} followers
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    {profileData.following} following
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
        
        <Tabs defaultValue="quests">
          <TabsList className="glass mb-8">
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Award size={16} />
              Quests
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity size={16} />
              Activity
            </TabsTrigger>
            {profileData.isCoach && (
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageSquare size={16} />
                Reviews
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="quests">
            <h2 className="text-2xl font-semibold mb-6">Quests by {profileData.username}</h2>
            {userQuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <p className="text-muted-foreground">No quests created yet</p>
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
                          <span className="font-medium">{profileData.username}</span>
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
                          {' '}for the quest{' '}
                          <Link to={`/quest/${activity.challengeId}`} className="text-primary hover:underline">
                            {activity.challengeTitle}
                          </Link>
                        </p>
                      </div>
                    ) : activity.type === 'challenge_created' && (
                      <div>
                        <p>
                          <span className="font-medium">{profileData.username}</span>
                          {' '}created a new quest:{' '}
                          <Link to={`/quest/${activity.challengeId}`} className="text-primary hover:underline">
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
          
          {profileData.isCoach && (
            <TabsContent value="reviews">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={profileData.rating} size={20} />
                  <span className="font-medium">{profileData.rating.toFixed(1)}/5</span>
                  <span className="text-muted-foreground">({profileData.reviewCount} reviews)</span>
                </div>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="glass rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.reviewerImage} alt={review.reviewerDisplayName} />
                          <AvatarFallback>{review.reviewerDisplayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <Link to={`/profile/${review.reviewerUsername}`} className="font-medium hover:underline">
                              {review.reviewerDisplayName}
                            </Link>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} size={14} />
                              <span className="text-sm">{review.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <p className="mb-2">{review.content}</p>
                          
                          <p className="text-xs text-muted-foreground">
                            {formatTime(review.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 glass rounded-2xl">
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
