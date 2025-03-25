
import React from 'react';
import { Shield } from 'lucide-react';

interface SummarySectionProps {
  baseLockAmount: number;
  rewardAmount: number;
  fees: number;
  total: number;
  isProofVerification: boolean;
}

const SummarySection = ({ 
  baseLockAmount, 
  rewardAmount, 
  fees, 
  total, 
  isProofVerification 
}: SummarySectionProps) => {
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
          {!isProofVerification && (
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
