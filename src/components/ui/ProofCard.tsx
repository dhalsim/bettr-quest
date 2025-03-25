import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Clock, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { toast } from 'sonner';

export type Proof = {
  id: string;
  challengeId: string;
  userId: string;
  username: string;
  title: string;
  createdAt: string;
  description: string;
  imageUrl?: string;
  votes: {
    accept: number;
    reject: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'in_dispute';
};

interface ProofCardProps {
  proof: Proof;
  questLockedAmount?: number;
  questTitle?: string;
  questDescription?: string;
}

const ProofCard: React.FC<ProofCardProps> = ({ 
  proof, 
  questLockedAmount = 0,
  questTitle = "",
  questDescription = "" 
}) => {
  const { isLoggedIn } = useNostrAuth();
  const navigate = useNavigate();
  
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

  // Calculate reward amount (5% of locked amount)
  const rewardAmount = Math.round(questLockedAmount * 0.05);
  
  const handleVerify = () => {
    if (!isLoggedIn) {
      toast.error("Please connect your wallet to verify proofs");
      return;
    }
    
    navigate('/escrow-deposit', {
      state: {
        type: 'verify',
        proofTitle: proof.title,
        proofDescription: proof.description,
        questTitle,
        questDescription,
        proofId: proof.id,
        questId: proof.challengeId
      }
    });
  };
  
  const handleContest = () => {
    if (!isLoggedIn) {
      toast.error("Please connect your wallet to contest proofs");
      return;
    }
    
    navigate('/escrow-deposit', {
      state: {
        type: 'contest',
        proofTitle: proof.title,
        proofDescription: proof.description,
        questTitle,
        questDescription,
        proofId: proof.id,
        questId: proof.challengeId
      }
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
            ) : proof.status === 'in_dispute' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500">
                In Dispute
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
        
        <div className="border-t border-border mt-4 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ThumbsUp size={16} />
                <span>{proof.votes.accept}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ThumbsDown size={16} />
                <span>{proof.votes.reject}</span>
              </div>
            </div>
            
            {proof.status === 'pending' && (
              <div className="flex gap-3 w-full sm:w-auto">
                {isLoggedIn ? (
                  <>
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white" 
                      size="sm"
                      onClick={handleVerify}
                    >
                      <Check size={16} className="mr-1.5" />
                      Verify
                    </Button>
                    <Button 
                      className="bg-red-500 hover:bg-red-600 text-white" 
                      size="sm"
                      onClick={handleContest}
                    >
                      <X size={16} className="mr-1.5" />
                      Contest
                    </Button>
                  </>
                ) : (
                  <div className="w-full sm:w-auto">
                    <Link to="/connect" className="text-primary font-medium text-sm hover:underline">
                      Connect to earn rewards
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofCard;
