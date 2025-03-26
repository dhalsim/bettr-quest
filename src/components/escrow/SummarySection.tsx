import React from 'react';
import { Shield } from 'lucide-react';

interface SummarySectionProps {
  userLockAmount: number;
  communityReward: number;
  platformFees: number;
  totalToLock: number;
  isProofVerification: boolean;
  verificationType?: 'verify' | 'contest';
  questRewardAmount?: number;
  questLockedAmount?: number;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  userLockAmount,
  communityReward,
  platformFees,
  totalToLock,
  isProofVerification,
  verificationType,
  questRewardAmount = 0,
  questLockedAmount = 0
}) => {
  return (
    <div className="bg-secondary/5 rounded-lg p-6 border border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <Shield size={20} className="text-primary" />
        <h3 className="text-lg font-semibold">Summary</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>Your Lock Amount</span>
          <span>{userLockAmount.toLocaleString()} sats</span>
        </div>
        
        {!isProofVerification && (
          <div className="flex justify-between items-center text-sm">
            <span>Community Rewards</span>
            <span>{communityReward.toLocaleString()} sats</span>
          </div>
        )}
        
        {isProofVerification && verificationType === 'contest' && (
          <div className="flex justify-between items-center text-sm text-red-500">
            <span>Contest Reward</span>
            <span>{(userLockAmount + questLockedAmount).toLocaleString()} sats</span>
          </div>
        )}
        
        {isProofVerification && verificationType === 'verify' && (
          <div className="flex justify-between items-center text-sm text-green-500">
            <span>Verification Reward</span>
            <span>{questRewardAmount.toLocaleString()} sats</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <span>Platform Fees</span>
          <span>{platformFees.toLocaleString()} sats</span>
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total to Lock</span>
            <span className="font-bold">{totalToLock.toLocaleString()} sats</span>
          </div>
          
          {isProofVerification ? (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">What's at stake:</h4>
              {verificationType === 'verify' ? (
                <>
                  <p className="text-sm text-green-500">
                    ✓ If your verification is correct: You'll receive {questRewardAmount.toLocaleString()} sats
                  </p>
                  <p className="text-sm text-red-500">
                    ✗ If your verification is incorrect: You'll lose your locked amount ({userLockAmount.toLocaleString()} sats)
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-green-500">
                    ✓ If your contest is valid: You'll receive {(userLockAmount + questLockedAmount).toLocaleString()} sats
                    <span className="text-muted-foreground"> (+{questLockedAmount.toLocaleString()} sats from the quest)</span>
                  </p>
                  <p className="text-sm text-red-500">
                    ✗ If your contest is invalid: You'll lose your locked amount ({userLockAmount.toLocaleString()} sats)
                  </p>
                </>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              You'll get back {userLockAmount.toLocaleString()} sats upon successful completion
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
