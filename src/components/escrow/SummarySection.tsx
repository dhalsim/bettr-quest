import React from 'react';
import { useTranslation } from 'react-i18next';

interface SummarySectionProps {
  userLockAmount: number;
  communityReward?: number;
  aiServiceFee?: number;
  platformFees: number;
  totalToLock: number;
  isProofVerification: boolean;
  verificationType?: 'accept' | 'reject';
  questRewardAmount: number;
  questLockedAmount: number;
  visibility?: 'public' | 'private';
}

const SummarySection: React.FC<SummarySectionProps> = ({
  userLockAmount,
  communityReward = 0,
  aiServiceFee = 0,
  platformFees,
  totalToLock,
  isProofVerification,
  verificationType,
  questRewardAmount,
  questLockedAmount,
  visibility
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {isProofVerification 
          ? t('escrow.Summary of Verification')
          : t('escrow.Summary of Quest Lock')
        }
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {isProofVerification 
              ? t('escrow.Verification Lock Amount')
              : t('escrow.Quest Lock Amount')
            }
          </span>
          <span>{userLockAmount} sats</span>
        </div>
        
        {!isProofVerification && visibility === 'public' && communityReward > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t('escrow.Community Reward')}
            </span>
            <span>{communityReward} sats</span>
          </div>
        )}
        
        {!isProofVerification && visibility === 'private' && aiServiceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t('escrow.AI Service Fee')}
            </span>
            <span>{aiServiceFee} sats</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t('escrow.Platform Fee')}
          </span>
          <span>{platformFees} sats</span>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between font-medium">
            <span>
              {isProofVerification 
                ? t('escrow.Total to Lock for Verification')
                : t('escrow.Total to Lock for Quest')
              }
            </span>
            <span>{totalToLock} sats</span>
          </div>
        </div>
        
        {isProofVerification && (
          <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
            <h4 className="font-medium mb-2">
              {verificationType === 'accept' 
                ? t('escrow.Verification Reward')
                : t('escrow.Contest Reward')
              }
            </h4>
            <p className="text-muted-foreground">
              {verificationType === 'accept'
                ? t('escrow.If your verification is correct, you will receive the full locked amount')
                : t('escrow.If your contest is validated, you will receive the full locked amount')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarySection;
