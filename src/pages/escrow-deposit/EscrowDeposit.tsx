import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import QuestDetailsCard from '@/components/escrow/QuestDetailsCard';
import ProofDetailsCard from '@/components/escrow/ProofDetailsCard';
import RewardInfo from '@/components/escrow/RewardInfo';
import LockAmountSection from '@/components/escrow/LockAmountSection';
import RewardsSlider from '@/components/escrow/RewardsSlider';
import SummarySection from '@/components/escrow/SummarySection';
import ConfirmButton from '@/components/escrow/ConfirmButton';
import { decodeLocationState, type LocationState } from './validation';
import { validateLocationState } from '@/lib/validation-utils';

const EscrowDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<LocationState | null>(null);
  const [rewardPercentage, setRewardPercentage] = useState(5);
  
  useEffect(() => {
    if (location.state) {
      const validatedState = validateLocationState(decodeLocationState, location.state, {
        toast,
        navigate,
        log: true,
        navigateOnError: '/explore'
      });
      
      if (validatedState) {
        setState(validatedState);
      }
    } else {
      navigate('/explore');
    }
  }, [location, navigate, toast]);
  
  // Guard against null state during initial render or after refresh
  if (!state) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }
  
  const isProofVerification = state.type === 'proof-verify' || state.type === 'proof-contest';
  
  // For proof verification/contest, user locks 10k sats
  // For quest creation, user locks 20k sats
  const userLockAmount = isProofVerification ? 10000 : 20000;
  const platformFees = 1000;
  
  const calculateCommunityReward = () => {
    return Math.floor(userLockAmount * (rewardPercentage / 100));
  };
  
  const calculateTotalToLock = () => {
    return isProofVerification 
      ? userLockAmount + platformFees 
      : userLockAmount + calculateCommunityReward() + platformFees;
  };
  
  const getQuestLink = () => {
    return `/quest/${state.questId}`;
  };
  
  const handleConfirmDeposit = () => {
    // TODO: Implement deposit logic
    // For now, just navigate back to the quest page
    navigate(getQuestLink());
    
    // Show a toast based on the type of deposit
    if (state.type === 'proof-verify') {
      toast({
        title: "Verification Submitted",
        description: "Your verification has been submitted and your sats have been locked.",
        variant: "default",
      });
    } else if (state.type === 'proof-contest') {
      toast({
        title: "Contest Submitted",
        description: "Your contest has been submitted and your sats have been locked.",
        variant: "default",
      });
    } else if (state.type === 'quest') {
      toast({
        title: "Quest Created",
        description: "Your quest has been created and your sats have been locked.",
        variant: "default",
      });
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {state.type === 'proof-verify'
              ? 'Verify Proof' 
              : 'Contest Proof' 
            }
          </h1>
          <p className="text-muted-foreground">
            {state.type === 'proof-verify'
              ? 'Lock some sats to verify this proof. You\'ll earn rewards if your verification is correct.'
              : 'Lock some sats to contest this proof. You\'ll receive the full locked amount if your contest is validated.'
            }
          </p>
        </div>

        {isProofVerification && (
          <RewardInfo type={state.type} />
        )}

        <div className="glass rounded-2xl p-8 border border-border/50">
          {isProofVerification && (
            <ProofDetailsCard 
              title={state.proofTitle} 
              description={state.proofDescription}
              proofLink={`/quest/${state.questId}/proof/${state.proofId}`}
              questTitle={state.questTitle}
              questDescription={state.questDescription}
              questLink={getQuestLink()}
            />
          )}
          
          {!isProofVerification && (
            <QuestDetailsCard 
              title={state.questTitle}
              description={state.questDescription}
              questLink={getQuestLink()}
            />
          )}
          
          <div className="space-y-8">
            <LockAmountSection 
              amount={userLockAmount} 
              isProofVerification={isProofVerification} 
            />
            
            {!isProofVerification && (
              <RewardsSlider 
                percentage={rewardPercentage}
                onPercentageChange={setRewardPercentage}
                rewardAmount={calculateCommunityReward()}
              />
            )}
            
            <SummarySection 
              userLockAmount={userLockAmount}
              communityReward={calculateCommunityReward()}
              platformFees={platformFees}
              totalToLock={calculateTotalToLock()}
              isProofVerification={isProofVerification}
              verificationType={state.type === 'proof-verify' ? 'verify' : 'contest'}
              questRewardAmount={state.questRewardAmount}
              questLockedAmount={state.questLockedAmount}
            />
            
            <ConfirmButton 
              type={state.type}
              totalAmount={calculateTotalToLock()}
              onConfirm={handleConfirmDeposit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDeposit; 