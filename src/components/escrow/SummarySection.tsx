import React from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SummarySectionProps {
  userLockAmount: number;
  communityReward: number;
  aiServiceFee: number;
  platformFees: number;
  totalToLock: number;
  isProofVerification: boolean;
  verificationType?: 'accept' | 'reject';
  questRewardAmount?: number;
  questLockedAmount?: number;
  visibility: 'public' | 'private';
}

const SummarySection: React.FC<SummarySectionProps> = ({
  userLockAmount,
  communityReward,
  aiServiceFee,
  platformFees,
  totalToLock,
  isProofVerification,
  verificationType,
  questRewardAmount = 0,
  questLockedAmount = 0,
  visibility
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary/5 rounded-lg p-6 border border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <Shield size={20} className="text-primary" />
        <h3 className="text-lg font-semibold">{t('escrow.summary.Summary')}</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>{t('escrow.summary.Your Lock Amount')}</span>
          <span>{userLockAmount.toLocaleString()} sats</span>
        </div>
        
        {!isProofVerification && visibility === 'public' && (
          <div className="flex justify-between items-center text-sm">
            <span>{t('escrow.summary.Community Rewards')}</span>
            <span>{communityReward.toLocaleString()} sats</span>
          </div>
        )}

        {!isProofVerification && visibility === 'private' && (
          <div className="flex justify-between items-center text-sm">
            <span>{t('escrow.summary.AI Service Fee')}</span>
            <span>{aiServiceFee.toLocaleString()} sats</span>
          </div>
        )}
        
        { // TODO: This is rather dynamic, it depends of disputes, can't show it here
        
        isProofVerification && verificationType === 'reject' && (
          <div className="flex justify-between items-center text-sm text-red-500">
            <span>{t('escrow.summary.Contest Reward')}</span>
            <span>{(userLockAmount + questLockedAmount).toLocaleString()} sats</span>
          </div>
        )}
        
        {isProofVerification && verificationType === 'accept' && (
          <div className="flex justify-between items-center text-sm text-green-500">
            <span>{t('escrow.summary.Verification Reward')}</span>
            <span>{questRewardAmount.toLocaleString()} sats</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <span>{t('escrow.summary.Platform Fees')}</span>
          <span>{platformFees.toLocaleString()} sats</span>
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="font-medium text-red-500">{t('escrow.summary.Total to Lock')}</span>
            <span className="font-bold">{totalToLock.toLocaleString()} sats</span>
          </div>
          
          {isProofVerification ? (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">{t('escrow.summary.What\'s at stake:')}</h4>
              {verificationType === 'accept' ? (
                <>
                  {
                    // TODO: This is rather dynamic, it depends of disputes, can't show it here
                  }
                  <p className="text-sm text-green-500">
                    ✓ {t('escrow.summary.If your verification is correct: You\'ll receive {{amount}} sats', { amount: questRewardAmount.toLocaleString() })}
                  </p>
                  <p className="text-sm text-red-500">
                    ✗ {t('escrow.summary.If your verification is incorrect: You\'ll lose your locked amount ({{amount}} sats)', { amount: userLockAmount.toLocaleString() })}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-green-500">
                    ✓ {t('escrow.summary.If your contest is valid: You\'ll receive {{total}} sats (+{{quest}} sats from the quest)', { 
                      total: (userLockAmount + questLockedAmount).toLocaleString(),
                      quest: questLockedAmount.toLocaleString()
                    })}
                  </p>
                  <p className="text-sm text-red-500">
                    ✗ {t('escrow.summary.If your contest is invalid: You\'ll lose your locked amount ({{amount}} sats)', { amount: userLockAmount.toLocaleString() })}
                  </p>
                </>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              {t('escrow.summary.You\'ll get back {{amount}} sats upon successful completion', { amount: userLockAmount.toLocaleString() })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
