import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestCard from '@/components/quest-card/QuestCard';
import { mockQuests, mockProofs } from '@/mock/data';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { QuestStatus, isLockedQuest } from '@/types/quest';
import { assertNever } from '@/lib/utils';

type Status = 'all' | QuestStatus;

const MyQuest = () => {
  const { profile } = useNostrAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Status>('all');

  const userQuests = Object.values(mockQuests).filter(quest => quest.userId === profile?.pubkey);
  
  const filteredQuests = userQuests.filter(quest => {
    if (filter === 'all') return true;
    return quest.status === filter;
  });
  
  const getEmptyStateMessage = (filter: Status) => {
    switch (filter) {
      case 'all': return "You haven't created any quests yet.";
      case 'saved': return "You don't have any saved quests.";
      case 'on_review': return "You don't have any quests under review.";
      case 'success': return "You haven't completed any quests successfully yet.";
      case 'failed': return "You don't have any failed quests.";
      case 'in_dispute': return "You don't have any quests in dispute.";
      default: return assertNever(filter);
    }
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
                onChange={(e) => setFilter(e.target.value as Status)}
              >
                <option value="all">All Quests</option>
                <option value="saved">Saved</option>
                <option value="on_review">On Review</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="in_dispute">In Dispute</option>
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
            <h3 className="text-xl font-medium mb-2">No quests found</h3>
            <p className="text-muted-foreground mb-6">
              {getEmptyStateMessage(filter)}
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
