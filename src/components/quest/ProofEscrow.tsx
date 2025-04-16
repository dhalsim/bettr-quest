import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LockAmountSection from '@/components/escrow/LockAmountSection';
import QuestDetailsCard from '@/components/escrow/QuestDetailsCard';
import SummarySection from '@/components/escrow/SummarySection';
import ConfirmButton from '@/components/escrow/ConfirmButton';

interface ProofEscrowProps {
  type: 'proof-accept' | 'proof-reject';
  questTitle: string;
  questDescription: string;
  questId: string;
  questRewardAmount: number;
  questLockedAmount: number;
  proofTitle: string;
  proofDescription: string;
  proofId: string;
  onConfirm: () => void;
}

const ProofEscrow: React.FC<ProofEscrowProps> = ({
  type,
  questTitle,
  questDescription,
  questId,
  questRewardAmount,
  questLockedAmount,
  proofTitle,
  proofDescription,
  proofId,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const userLockAmount = 10000;
  const platformFees = 1000;
  
  const calculateTotalToLock = () => {
    return userLockAmount + platformFees;
  };
  
  const getQuestLink = () => {
    return `/quest/${questId}`;
  };

  return (
    <div className="glass rounded-2xl p-8 border border-border/50">
      <QuestDetailsCard 
        title={questTitle}
        description={questDescription}
        questLink={getQuestLink()}
        proofTitle={proofTitle}
        proofDescription={proofDescription}
      />
      
      <div className="space-y-8">
        <LockAmountSection 
          amount={userLockAmount} 
          isProofVerification={true} 
        />
        
        <SummarySection 
          userLockAmount={userLockAmount}
          platformFees={platformFees}
          totalToLock={calculateTotalToLock()}
          isProofVerification={true}
          verificationType={type === 'proof-accept' ? 'accept' : 'reject'}
          questRewardAmount={questRewardAmount}
          questLockedAmount={questLockedAmount}
        />
        
        <div className="flex flex-col gap-4">
          <ConfirmButton 
            type={type}
            totalAmount={calculateTotalToLock()}
            onConfirm={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default ProofEscrow; 