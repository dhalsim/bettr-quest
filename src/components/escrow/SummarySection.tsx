import React from 'react';
import { Shield } from 'lucide-react';

interface SummarySectionProps {
  baseLockAmount: number;
  rewardAmount: number;
  fees: number;
  total: number;
  isProofVerification: boolean;
  verificationType?: 'verify' | 'contest';
}

const SummarySection: React.FC<SummarySectionProps> = ({
  baseLockAmount,
  rewardAmount,
  fees,
  total,
  isProofVerification,
  verificationType
}) => {
  return (
    <div className="bg-secondary/5 rounded-lg p-6 border border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <Shield size={20} className="text-primary" />
        <h3 className="text-lg font-semibold">Summary</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>Lock Amount</span>
          <span>{baseLockAmount.toLocaleString()} sats</span>
        </div>
        
        {!isProofVerification && (
          <div className="flex justify-between items-center text-sm">
            <span>Community Rewards</span>
            <span>{rewardAmount.toLocaleString()} sats</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <span>Platform Fees</span>
          <span>{fees.toLocaleString()} sats</span>
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total to Lock</span>
            <span className="text-red-500">{total.toLocaleString()} sats</span>
          </div>
          
          {isProofVerification ? (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">What's at stake:</h4>
              {verificationType === 'verify' ? (
                <>
                  <p className="text-sm text-green-500">
                    ✓ If your verification is correct: You'll receive {Math.floor(baseLockAmount * 1.2).toLocaleString()} sats
                    <span className="text-muted-foreground"> (+20% reward)</span>
                  </p>
                  <p className="text-sm text-red-500">
                    ✗ If your verification is incorrect: You'll lose your locked amount
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-green-500">
                    ✓ If your contest is valid: You'll receive {Math.floor(baseLockAmount * 1.5).toLocaleString()} sats
                    <span className="text-muted-foreground"> (+50% from the proof submitter's stake)</span>
                  </p>
                  <p className="text-sm text-red-500">
                    ✗ If your contest is invalid: You'll lose your locked amount
                  </p>
                </>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              You'll get back {baseLockAmount.toLocaleString()} sats upon successful completion
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
