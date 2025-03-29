import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';
import QuestCard from '@/components/quest-card/QuestCard';
import { Button } from '@/components/ui/button';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { isLockedQuest, LockedQuest } from '@/types/quest';
import { mockQuests, mockSuggestedUsers, mockProofs } from '@/mock/data';
import { useTranslation } from 'react-i18next';

const Timeline = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState(mockSuggestedUsers);
  const { isLoggedIn, profile } = useNostrAuth();
  const navigate = useNavigate();
  
  // Convert mockQuests object to array for timeline
  const timelineQuests = Object.values(mockQuests)
    .filter((quest): quest is LockedQuest => { 
      return isLockedQuest(quest) && quest.userId !== profile?.pubkey;
    });
  
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

  const handleSpecializationClick = (e: React.MouseEvent, specialization: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?specialization=${specialization}`);
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement follow toggle functionality
  };

  const handleLockSats = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement lock sats functionality
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main timeline content */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{t('timeline.Your Timeline')}</h1>
            <p className="text-muted-foreground mb-10">
              {t('timeline.Quests from people you follow')}
            </p>
            
            {timelineQuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {timelineQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest}
                    proof={isLockedQuest(quest) ? mockProofs[quest.id]?.[0] : undefined}
                    isOwnedByCurrentUser={quest.userId === profile?.pubkey}
                    isFollowing={false}
                    onSpecializationClick={handleSpecializationClick}
                    onFollowToggle={handleFollowToggle}
                    onLockSats={handleLockSats}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-2xl">
                <h3 className="text-xl font-medium mb-2">{t('timeline.Your timeline is empty')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('timeline.Start following people to see their quests here')}
                </p>
                <Link to="/explore">
                  <Button>
                    {t('timeline.Explore Quests')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Sidebar with suggested follows */}
          <div className="lg:w-1/3">
            <div className="glass rounded-2xl p-6 sticky top-32">
              <h2 className="text-xl font-semibold mb-4">{t('timeline.Suggested Follows')}</h2>
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
                      <span>{user.following ? t('timeline.Following') : t('timeline.Follow')}</span>
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
