import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, UserPlus, UserCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { isLockedQuest, LockedQuest, SavedQuest } from '@/types/quest';
import { assertNever, formatDate, calculateDaysRemaining } from '@/lib/utils';

interface QuestCardProps {
  quest: SavedQuest | LockedQuest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(null, { keyPrefix: "quest" });
  const { t: tTags } = useTranslation(null, { keyPrefix: "tags" });
  
  const daysRemaining = calculateDaysRemaining(quest.dueDate);
  
  const toggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleSpecializationClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?specialization=${tag}`);
  };
  
  const getStatusBadgeClass = () => {
    const status = quest.status;

    switch (status) {
      case 'saved':
        return 'bg-blue-500/10 text-blue-500';
      case 'on_review':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      case 'in_dispute':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return assertNever(status);
    }
  };

  const getStatusText = () => {
    const status = quest.status;

    switch (status) {
      case 'saved':
        return t('Saved');
      case 'on_review':
        return t('On Review');
      case 'success':
        return t('Success');
      case 'failed':
        return t('Failed');
      case 'in_dispute':
        return t('In Dispute');
      default:
        return assertNever(status);
    }
  };
  
  return (
    <Link to={`/quest/${quest.id}`} className="block group">
      <div className="glass rounded-2xl h-full overflow-hidden transition-transform group-hover:translate-y-[-4px] group-hover:shadow-lg">
        {quest.imageUrl && (
          <div className="h-52 w-full">
            <img 
              src={quest.imageUrl} 
              alt={quest.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            {quest.specializations.map((tag) => (
              <span 
                key={tag.name}
                onClick={(e) => handleSpecializationClick(e, tag.name)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {tTags(tag.name)}
              </span>
            ))}
            
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              ${getStatusBadgeClass()}`}
            >
              {getStatusText()}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3">{quest.title}</h3>
          
          <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
            {quest.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User size={14} />
              <span>@{quest.username}</span>
            </div>
            
            <Button
              variant={isFollowing ? "outline" : "secondary"}
              size="sm"
              onClick={toggleFollow}
            >
              {isFollowing ? <UserCheck size={16} className="mr-2" /> : <UserPlus size={16} className="mr-2" />}
              {isFollowing ? t('Following') : t('Follow')}
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} />
                <span>{formatDate(quest.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>
                  {daysRemaining > 0 
                    ? `${daysRemaining} ${t('days remaining')}` 
                    : t('Due date passed')}
                </span>
              </div>
            </div>
            
            {isLockedQuest(quest) && quest.totalZapped && quest.totalZapped > 0 && (
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Zap size={12} />
                <span>{quest.totalZapped.toLocaleString()} {t('sats')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestCard;
