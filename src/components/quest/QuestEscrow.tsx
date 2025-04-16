import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LockAmountSection from '@/components/escrow/LockAmountSection';
import RewardsSlider from '@/components/escrow/RewardsSlider';
import QuestDetailsCard from '@/components/escrow/QuestDetailsCard';
import SummarySection from '@/components/escrow/SummarySection';
import ConfirmButton from '@/components/escrow/ConfirmButton';
import { Button } from '@/components/ui/button';

interface QuestEscrowProps {
  visibility: 'public' | 'private';
  questDescription: string;
  questId: string;
  questRewardAmount: number;  
  questLockedAmount: number;
  onConfirm: () => void;
  onSkip?: () => void;
}

const QuestEscrow: React.FC<QuestEscrowProps> = ({
  questDescription,
  questId,
  questRewardAmount,
  questLockedAmount,
  visibility,
  onConfirm,
  onSkip
}) => {
  const { t } = useTranslation();
  const [rewardPercentage, setRewardPercentage] = useState(5);
  
  const userLockAmount = 10000;
  const platformFees = 1000;
  const aiServiceFee = visibility === 'private' ? 1000 : 0;
  
  const calculateCommunityReward = () => {
    return visibility === 'public' ? Math.floor(userLockAmount * (rewardPercentage / 100)) : 0;
  };
  
  const calculateTotalToLock = () => {
    return userLockAmount + calculateCommunityReward() + platformFees + aiServiceFee;
  };
  
  const getQuestLink = () => {
    return `/quest/${questId}`;
  };

  return (
    <div className="glass rounded-2xl p-8 border border-border/50">
      <QuestDetailsCard 
        description={questDescription}
        questLink={getQuestLink()}
      />
      
      <div className="space-y-8">
        <LockAmountSection 
          amount={userLockAmount} 
          isProofVerification={false} 
        />
        
        {visibility === 'public' && (
          <RewardsSlider 
            percentage={rewardPercentage}
            onPercentageChange={setRewardPercentage}
            rewardAmount={calculateCommunityReward()}
          />
        )}
        
        <SummarySection 
          userLockAmount={userLockAmount}
          communityReward={calculateCommunityReward()}
          aiServiceFee={aiServiceFee}
          platformFees={platformFees}
          totalToLock={calculateTotalToLock()}
          isProofVerification={false}
          questRewardAmount={questRewardAmount}
          questLockedAmount={questLockedAmount}
          visibility={visibility}
        />
        
        <div className="flex flex-col gap-4">
          <ConfirmButton 
            type="quest"
            totalAmount={calculateTotalToLock()}
            onConfirm={onConfirm}
          />
          
          {onSkip && (
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