import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, UserPlus, UserCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export type Quest = {
  id: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  createdAt: string;
  dueDate: string;
  category: string;
  status: 'pending' | 'on_review' | 'success' | 'failed' | 'in_dispute';
  imageUrl?: string;
  visibility: 'public' | 'private';
  totalZapped?: number;
};

interface QuestCardProps {
  quest: Quest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(null, { keyPrefix: "quest" });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const calculateDaysRemaining = () => {
    const dueDate = new Date(quest.dueDate);
    const today = new Date();
    const differenceInTime = dueDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays > 0 ? differenceInDays : 0;
  };
  
  const daysRemaining = calculateDaysRemaining();
  const isQuestActive = daysRemaining > 0 && 
                      (quest.status === 'pending' || quest.status === 'on_review');
  
  const toggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?category=${quest.category}`);
  };
  
  const getStatusBadgeClass = () => {
    switch (quest.status) {
      case 'pending':
        return 'bg-blue-500/10 text-blue-500';
      case 'on_review':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-blue-500/10 text-blue-500';
    }
  };

  const getStatusText = () => {
    switch (quest.status) {
      case 'pending':
        return t('Pending');
      case 'on_review':
        return t('On Review');
      case 'success':
        return t('Success');
      case 'failed':
        return t('Failed');
      default:
        return t('Pending');
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
            <span 
              onClick={handleCategoryClick}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
            >
              {quest.category}
            </span>
            
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
            
            {quest.totalZapped && quest.totalZapped > 0 && (
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
