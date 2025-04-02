import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LockAmountSection from '@/components/escrow/LockAmountSection';
import RewardsSlider from '@/components/escrow/RewardsSlider';
import QuestDetailsCard from '@/components/escrow/QuestDetailsCard';
import SummarySection from '@/components/escrow/SummarySection';
import ConfirmButton from '@/components/escrow/ConfirmButton';
import { Button } from '@/components/ui/button';

interface QuestEscrowProps {
  type: 'quest' | 'proof-verify' | 'proof-contest';
  questTitle: string;
  questDescription: string;
  questId: string;
  questRewardAmount: number;
  questLockedAmount: number;
  onConfirm: () => void;
  onSkip?: () => void;
}

const QuestEscrow: React.FC<QuestEscrowProps> = ({
  type,
  questTitle,
  questDescription,
  questId,
  questRewardAmount,
  questLockedAmount,
  onConfirm,
  onSkip
}) => {
  const { t } = useTranslation();
  const [rewardPercentage, setRewardPercentage] = useState(5);
  
  const isProofVerification = type === 'proof-verify' || type === 'proof-contest';
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
    return `/quest/${questId}`;
  };

  return (
    <div className="glass rounded-2xl p-8 border border-border/50">
      {isProofVerification ? (
        <QuestDetailsCard 
          title={questTitle}
          description={questDescription}
          questLink={getQuestLink()}
        />
      ) : (
        <QuestDetailsCard 
          title={questTitle}
          description={questDescription}
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
          verificationType={type === 'proof-verify' ? 'verify' : 'contest'}
          questRewardAmount={questRewardAmount}
          questLockedAmount={questLockedAmount}
        />
        
        <div className="flex flex-col gap-4">
          <ConfirmButton 
            type={type}
            totalAmount={calculateTotalToLock()}
            onConfirm={onConfirm}
          />
          
          {!isProofVerification && onSkip && (
            <Button
              variant="outline"
              onClick={onSkip}
              className="w-full"
            >
              {t('escrow.Skip for now')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestEscrow; 