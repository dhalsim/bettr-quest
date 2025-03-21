
import React, { useState } from 'react';
import { User, ThumbsUp, ThumbsDown, Calendar, Flag } from 'lucide-react';
import Button from './Button';
import { toast } from 'sonner';

export interface Proof {
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
  status: 'pending' | 'accepted' | 'rejected' | 'disputed';
}

interface ProofCardProps {
  proof: Proof;
  className?: string;
}

const ProofCard = ({ proof, className = '' }: ProofCardProps) => {
  const { id, username, createdAt, description, imageUrl, votes, status } = proof;
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [userVote, setUserVote] = useState<'accept' | 'reject' | null>(null);
  
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  const handleVote = (voteType: 'accept' | 'reject') => {
    // If user already voted this way, remove their vote
    if (userVote === voteType) {
      setCurrentVotes({
        ...currentVotes,
        [voteType]: currentVotes[voteType] - 1
      });
      setUserVote(null);
      toast.info("Your vote has been removed");
      return;
    }
    
    // If user is changing their vote
    const newVotes = { ...currentVotes };
    
    if (userVote) {
      // Remove previous vote
      newVotes[userVote] -= 1;
    }
    
    // Add new vote
    newVotes[voteType] += 1;
    
    setCurrentVotes(newVotes);
    setUserVote(voteType);
    
    toast.success(`You voted to ${voteType} this proof`);
    
    // For demonstration - in a real app, this would be determined by an algorithm
    if (voteType === 'accept' && newVotes.accept >= 5) {
      setCurrentStatus('accepted');
    } else if (voteType === 'reject' && newVotes.reject >= 5) {
      setCurrentStatus('rejected');
    }
  };
  
  const reportProof = () => {
    setCurrentStatus('disputed');
    toast.success("This proof has been reported and will be reviewed by moderators");
  };
  
  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-green-500 bg-green-100">
            <ThumbsUp size={12} />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-red-500 bg-red-100">
            <ThumbsDown size={12} />
            Rejected
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-amber-500 bg-amber-100">
            <Flag size={12} />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-primary bg-primary/10">
            Pending
          </span>
        );
    }
  };
  
  return (
    <div className={`rounded-2xl glass overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-medium">{username}</h4>
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        <p className="text-foreground mb-4">{description}</p>
        
        {imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Proof" 
              className="w-full h-auto object-cover" 
            />
          </div>
        )}
        
        <div className="flex flex-wrap justify-between items-center pt-4 border-t border-border">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <Button
              variant={userVote === 'accept' ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<ThumbsUp size={16} />}
              onClick={() => handleVote('accept')}
              disabled={currentStatus !== 'pending'}
            >
              Accept ({currentVotes.accept})
            </Button>
            <Button
              variant={userVote === 'reject' ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<ThumbsDown size={16} />}
              onClick={() => handleVote('reject')}
              disabled={currentStatus !== 'pending'}
            >
              Reject ({currentVotes.reject})
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Flag size={16} />}
            onClick={reportProof}
            disabled={currentStatus === 'disputed'}
          >
            Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProofCard;
