
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, UserPlus, UserCheck } from 'lucide-react';
import Button from './Button';

type Challenge = {
  id: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  createdAt: string;
  dueDate?: string;
  category: string;
  status: 'active' | 'completed';
  imageUrl?: string;
};

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Calculate days remaining until due date
  const calculateDaysRemaining = () => {
    if (!challenge.dueDate) return null;
    
    const dueDate = new Date(challenge.dueDate);
    const today = new Date();
    const differenceInTime = dueDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays > 0 ? differenceInDays : 0;
  };
  
  const daysRemaining = calculateDaysRemaining();
  
  // Toggle following state
  const toggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };
  
  return (
    <Link to={`/challenge/${challenge.id}`} className="block group">
      <div className="glass rounded-2xl h-full overflow-hidden transition-transform group-hover:translate-y-[-4px] group-hover:shadow-lg">
        {challenge.imageUrl && (
          <div className="h-52 w-full">
            <img 
              src={challenge.imageUrl} 
              alt={challenge.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {challenge.category}
            </span>
            
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              ${challenge.status === 'active' 
                ? 'bg-blue-500/10 text-blue-500' 
                : 'bg-green-500/10 text-green-500'}`}
            >
              {challenge.status === 'active' ? 'Active' : 'Completed'}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3">{challenge.title}</h3>
          
          <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
            {challenge.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User size={14} />
              <span>@{challenge.username}</span>
            </div>
            
            <Button
              variant={isFollowing ? "outline" : "secondary"}
              size="sm"
              leftIcon={isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
              onClick={toggleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>{formatDate(challenge.createdAt)}</span>
            </div>
            
            {daysRemaining !== null && (
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>
                  {daysRemaining > 0 
                    ? `${daysRemaining} days remaining` 
                    : 'Challenge ended'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard;
