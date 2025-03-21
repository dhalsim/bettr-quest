
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  createdAt: string;
  dueDate?: string;
  category: string;
  status: 'active' | 'completed' | 'failed';
  imageUrl?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  className?: string;
}

const ChallengeCard = ({ challenge, className = '' }: ChallengeCardProps) => {
  const { id, title, description, username, createdAt, dueDate, status, imageUrl } = challenge;
  
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  const getStatusDetails = () => {
    switch (status) {
      case 'completed':
        return { 
          icon: CheckCircle, 
          color: 'text-green-500', 
          bgColor: 'bg-green-500/10',
          text: 'Completed'
        };
      case 'failed':
        return { 
          icon: AlertCircle, 
          color: 'text-red-500', 
          bgColor: 'bg-red-500/10',
          text: 'Failed'
        };
      default:
        return { 
          icon: Calendar, 
          color: 'text-primary', 
          bgColor: 'bg-primary/10',
          text: 'Active'
        };
    }
  };
  
  const statusDetails = getStatusDetails();
  const StatusIcon = statusDetails.icon;
  
  return (
    <Link 
      to={`/challenge/${id}`} 
      className={`block rounded-2xl overflow-hidden card-hover hover-scale ${className}`}
    >
      <div className="relative glass h-full flex flex-col">
        {imageUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </div>
        )}
        
        <div className="p-6 flex flex-col grow">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusDetails.color} ${statusDetails.bgColor} mb-4 self-start`}>
            <StatusIcon size={14} />
            {statusDetails.text}
          </span>
          
          <h3 className="text-xl font-medium mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
          
          <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{username}</span>
            </div>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard;
