import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Clock, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { toast } from 'sonner';
import { ProofLocationState } from '@/pages/escrow-deposit/validation';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n/i18n';
import { formatDateTime } from '@/lib/utils';
import { Proof } from '@/types/proof';
import { QuestStatus } from '@/types/quest';

interface ProofCardProps {
  proof: Proof;
  questTitle: string;
  questDescription: string;
  questLockedAmount: number;
  questRewardAmount: number;
  questStatus: QuestStatus;
}

const ProofCard: React.FC<ProofCardProps> = ({ 
  proof, 
  questTitle,
  questDescription,
  questLockedAmount,
  questRewardAmount,
  questStatus
}) => {
  const { isLoggedIn } = useNostrAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(null, { keyPrefix: "proof" });
  
  const createLocationState = (type: 'proof-verify' | 'proof-contest'): ProofLocationState => ({
    type,
    proofTitle: proof.title,
    proofDescription: proof.description,
    questTitle,
    questDescription,
    questLockedAmount,
    questRewardAmount,
    proofId: proof.id,
    questId: proof.challengeId
  });

  const handleVerify = () => {
    if (!isLoggedIn) {
      toast.error(t('Please connect your wallet to verify proofs'));
      return;
    }
    
    navigate('/escrow-deposit', {
      state: createLocationState('proof-verify')
    });
  };
  
  const handleContest = () => {
    if (!isLoggedIn) {
      toast.error(t('Please connect your wallet to contest proofs'));
      return;
    }
    
    navigate('/escrow-deposit', {
      state: createLocationState('proof-contest')
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
              <span>{formatDateTime(proof.createdAt, i18n.language as keyof typeof languages)}</span>
            </div>
          </div>
          
          <div className="ml-auto">
            {questStatus === 'on_review' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                {t('Pending')}
              </span>
            ) : questStatus === 'success' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                {t('Accepted')}
              </span>
            ) : questStatus === 'in_dispute' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500">
                {t('In Dispute')}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                {t('Rejected')}
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
            
            {(questStatus === 'on_review') && (
              <div className="flex gap-3 w-full sm:w-auto">
                {isLoggedIn ? (
                  <>
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white" 
                      size="sm"
                      onClick={handleVerify}
                    >
                      <Check size={16} className="mr-1.5" />
                      {t('Verify')}
                    </Button>
                    <Button 
                      className="bg-red-500 hover:bg-red-600 text-white" 
                      size="sm"
                      onClick={handleContest}
                    >
                      <X size={16} className="mr-1.5" />
                      {t('Contest')}
                    </Button>
                  </>
                ) : (
                  <div className="w-full sm:w-auto">
                    <Link to="/connect" className="text-primary font-medium text-sm hover:underline">
                      {t('Connect to earn rewards')}
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
