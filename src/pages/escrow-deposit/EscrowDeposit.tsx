import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import QuestDetailsCard from '@/components/escrow/QuestDetailsCard';
import ProofDetailsCard from '@/components/escrow/ProofDetailsCard';
import RewardInfo from '@/components/escrow/RewardInfo';
import LockAmountSection from '@/components/escrow/LockAmountSection';
import RewardsSlider from '@/components/escrow/RewardsSlider';
import SummarySection from '@/components/escrow/SummarySection';
import ConfirmButton from '@/components/escrow/ConfirmButton';
import { decodeLocationState, type LocationState } from './validation';
import { validateLocationState } from '@/lib/validation-utils';
import { Button } from '@/components/ui/button';

const EscrowDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
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
          <h1 className="text-3xl font-bold mb-4">{t('escrow.Loading')}</h1>
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
        title: t('escrow.Verification Submitted'),
        description: t('escrow.Verification Submitted Description'),
        variant: "default",
      });
    } else if (state.type === 'proof-contest') {
      toast({
        title: t('escrow.Contest Submitted'),
        description: t('escrow.Contest Submitted Description'),
        variant: "default",
      });
    } else if (state.type === 'quest') {
      toast({
        title: t('escrow.Quest Created'),
        description: t('escrow.Quest Created Description'),
        variant: "default",
      });
    }
  };

  const handleSkipForNow = () => {
    // TODO: Implement skip logic
    navigate(getQuestLink());
    
    toast({
      title: t('escrow.Quest Saved'),
      description: t('escrow.Your quest has been created and your sats have been locked'),
      variant: "default",
    });
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {state.type === 'quest' 
              ? t('escrow.Lock sats to publish your quest')
              : state.type === 'proof-verify'
                ? t('escrow.Lock sats to verify this proof')
                : t('escrow.Lock sats to contest this proof')
            }
          </h1>
          <p className="text-muted-foreground">
            {state.type === 'quest'
              ? t('escrow.Lock some sats to publish your quest. This ensures accountability and helps the community validate your achievements')
              : state.type === 'proof-verify'
                ? t('escrow.Lock some sats to verify this proof. You\'ll earn rewards if your verification is correct')
                : t('escrow.Lock some sats to contest this proof. You\'ll receive the full locked amount if your contest is validated')
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
            
            <div className="flex flex-col gap-4">
              <ConfirmButton 
                type={state.type}
                totalAmount={calculateTotalToLock()}
                onConfirm={handleConfirmDeposit}
              />
              
              {!isProofVerification && (
                <Button
                  variant="outline"
                  onClick={handleSkipForNow}
                  className="w-full"
                >
                  {t('escrow.Skip for now')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDeposit; 