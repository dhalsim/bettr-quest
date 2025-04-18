import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Activity, Award, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import QuestCard from '@/components/quest-card/QuestCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/ui/StarRating';
import { 
  mockUserProfiles, 
  mockUserActivities, 
  mockReviews, 
  mockQuests, 
  mockProofs, 
  mockBookedSchedules,
  mockCalendarSchedule
} from '@/mock/data';
import { useTranslation, Trans } from 'react-i18next';
import { formatDate, formatDateTime } from '@/lib/utils';
import { languages } from '@/i18n/i18n';
import { isLockedQuest } from '@/types/quest';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import Schedule from '@/components/profile/Schedule';
import UpcomingEvents from '@/components/profile/UpcomingEvents';

interface Review {
  id: string;
  reviewerUsername: string;
  reviewerDisplayName: string;
  reviewerImage: string;
  rating: number;
  content: string;
  date: string;
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileData, setProfileData] = useState(mockUserProfiles.mindfulness_guru);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('quests');
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation(null, { keyPrefix: "profile" });
  const { profile: currentUserProfile } = useNostrAuth();
  const scheduleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If we have a username and it exists in our user profiles, use that data
    if (username && mockUserProfiles[username as keyof typeof mockUserProfiles]) {
      setProfileData(mockUserProfiles[username as keyof typeof mockUserProfiles]);
      
      // Set reviews if available
      if (mockReviews[username as keyof typeof mockReviews]) {
        setReviews(mockReviews[username as keyof typeof mockReviews]);
      } else {
        setReviews([]);
      }
    } else {
      // Default to our main user data
      setProfileData(mockUserProfiles.mindfulness_guru);
      setReviews(mockReviews.mindfulness_guru || []);
    }
  }, [username]);
  
  const handleSpecializationClick = (e: React.MouseEvent, specialization: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?specialization=${specialization}`);
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleLockSats = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement lock sats functionality
  };

  const handleReviewsClick = () => {
    setActiveTab('reviews');
    // Use setTimeout to ensure the tab content is rendered before scrolling
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleScheduleClick = () => {
    setTimeout(() => {
      scheduleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Filter quests for the current user
  const userQuests = Object.values(mockQuests).filter(quest => quest.username === profileData.username);
  
  const isOwnProfile = currentUserProfile?.username === profileData.username;

  console.log("isOwnProfile", isOwnProfile)
  
  console.log('Profile Data:', {
    username: profileData.username,
    isCoach: profileData.isCoach,
    hasCalendar: profileData.hasCalendar,
    isOwnProfile,
  });
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          {t('Back to Explore')}
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
                    <Badge variant="secondary" className="bg-primary/20 hover:bg-primary/30">{t('Coach')}</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-secondary/20 hover:bg-secondary/30">{t('Challenger')}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">@{profileData.username}</p>
                
                {profileData.isCoach && (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={profileData.rating} size={18} />
                    <span className="text-sm font-medium">
                      {profileData.rating.toFixed(1)}/5
                    </span>
                    <span 
                      className="text-sm text-primary hover:underline cursor-pointer" 
                      onClick={handleReviewsClick}
                    >
                      ({profileData.reviewCount} {t('reviews')})
                    </span>
                  </div>
                )}
                
                <p className="mb-4">{profileData.bio}</p>
                
                <div className="flex flex-wrap gap-4 items-center text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {t('Joined')} {formatDate(profileData.joinedDate, i18n.language as keyof typeof languages)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    {profileData.followers} {t('followers')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    {profileData.following} {t('following')}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  variant={isFollowing ? "outline" : "primary"}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? t('Following') : t('Follow')}
                </Button>
                {profileData.isCoach && profileData.hasCalendar && !isOwnProfile && (
                  <Button
                    onClick={handleScheduleClick}
                    variant="primary"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t('schedule.Schedule a Call')}
                  </Button>
                )}
                {profileData.isCoach && profileData.hasCalendar && isOwnProfile && (
                  <Button
                    onClick={handleScheduleClick}
                    variant="outline"
                    className="w-full"
                  >
                    {t('upcoming-events.Upcoming Events')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass mb-8">
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Award size={16} />
              {t('Quests')}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity size={16} />
              {t('Activity')}
            </TabsTrigger>
            {profileData.isCoach && (
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageSquare size={16} />
                {t('Reviews')}
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="quests">
            <h2 className="text-2xl font-semibold mb-6">{t('Quests by')} {profileData.username}</h2>
            {userQuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest}
                    proof={isLockedQuest(quest) ? mockProofs[quest.id]?.[0] : undefined}
                    isOwnedByCurrentUser={quest.userId === currentUserProfile?.pubkey}
                    isFollowing={isFollowing}
                    onSpecializationClick={handleSpecializationClick}
                    onFollowToggle={handleFollowToggle}
                    onLockSats={handleLockSats}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <p className="text-muted-foreground">{t('No quests created yet')}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            <h2 className="text-2xl font-semibold mb-6">{t('Recent Activity')}</h2>
            {mockUserActivities.length > 0 ? (
              <div className="space-y-4">
                {mockUserActivities.map((activity) => (
                  <div key={activity.id} className="glass rounded-xl p-6">
                    {activity.type === 'proof_review' ? (
                      <div>
                        <Trans
                          i18nKey="profile.activity.proof_review"
                          values={{
                            username: profileData.username,
                            action: activity.action === 'accepted' ? t('accepted') : t('rejected'),
                            activityUsername: activity.username,
                            challengeTitle: activity.challengeTitle
                          }}
                          components={[
                            <span className="font-medium" />,
                            <span className={activity.action === 'accepted' ? 'text-green-500' : 'text-red-500'} />,
                            <Link to={`/profile/${activity.username}`} className="text-primary hover:underline" />,
                            <Link to={`/quest/${activity.challengeId}`} className="text-primary hover:underline" />
                          ]}
                        />
                      </div>
                    ) : activity.type === 'challenge_created' && (
                      <div>
                        <Trans
                          i18nKey="profile.activity.challenge_created"
                          values={{
                            username: profileData.username,
                            challengeTitle: activity.challengeTitle
                          }}
                          components={[
                            <span className="font-medium" />,
                            <Link to={`/quest/${activity.challengeId}`} className="text-primary hover:underline" />
                          ]}
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDateTime(activity.timestamp, i18n.language as keyof typeof languages)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <p className="text-muted-foreground">{t('No recent activity')}</p>
              </div>
            )}
          </TabsContent>
          
          {profileData.isCoach && (
            <TabsContent value="reviews" ref={reviewsRef}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">{t('Reviews')}</h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={profileData.rating} size={20} />
                  <span className="font-medium">{profileData.rating.toFixed(1)}/5</span>
                  <span className="text-muted-foreground">({profileData.reviewCount} {t('reviews')})</span>
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
                            {formatDateTime(review.date, i18n.language as keyof typeof languages)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 glass rounded-2xl">
                  <p className="text-muted-foreground">{t('No reviews yet')}</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
        
        {profileData.isCoach && profileData.hasCalendar && (
          <div ref={scheduleRef} className="mt-8">
            {isOwnProfile ? (
              <UpcomingEvents events={mockBookedSchedules} />
            ) : (
              <Schedule 
                isOwnProfile={isOwnProfile} 
                calendarSchedule={mockCalendarSchedule}
                initialBookedSchedules={mockBookedSchedules} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
