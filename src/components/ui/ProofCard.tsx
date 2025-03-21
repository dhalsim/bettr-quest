
import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type Proof = {
  id: string;
  challengeId: string;
  userId: string;
  username: string;
  createdAt: string;
  description: string;
  imageUrl?: string;
  votes: {
    accept: number;
    reject: number;
  };
  status: 'pending' | 'accepted' | 'rejected';
};

interface ProofCardProps {
  proof: Proof;
}

const ProofCard: React.FC<ProofCardProps> = ({ proof }) => {
  // Format date
  const formatDate = (dateString: string) => {
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
  
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarFallback>{proof.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div>
            <Link to={`/profile/${proof.username}`} className="font-medium hover:text-primary hover:underline">
              @{proof.username}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{formatDate(proof.createdAt)}</span>
            </div>
          </div>
          
          <div className="ml-auto">
            {proof.status === 'pending' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                Pending
              </span>
            ) : proof.status === 'accepted' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                Accepted
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                Rejected
              </span>
            )}
          </div>
        </div>
        
        <p className="mb-4">{proof.description}</p>
        
        {proof.imageUrl && (
          <div className="mb-6">
            <img 
              src={proof.imageUrl} 
              alt="Proof" 
              className="w-full h-auto rounded-lg" 
            />
          </div>
        )}
        
        <div className="flex items-center justify-end gap-4">
          <button className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-green-500 transition-colors">
            <ThumbsUp size={16} />
            <span>{proof.votes.accept}</span>
          </button>
          
          <button className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors">
            <ThumbsDown size={16} />
            <span>{proof.votes.reject}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProofCard;
