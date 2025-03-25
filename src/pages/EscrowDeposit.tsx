
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ExternalLink, LockIcon, Shield, Users, Check, X } from 'lucide-react';

interface QuestLocationState {
  questTitle: string;
  questDescription: string;
  type?: undefined;
}

interface ProofLocationState {
  type: 'verify' | 'contest';
  proofTitle: string;
  proofDescription: string;
  questTitle: string;
  questDescription: string;
  proofId: string;
}

type LocationState = QuestLocationState | ProofLocationState;

const EscrowDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  const isProofVerification = state && state.type === 'verify' || state?.type === 'contest';
  
  const [rewardPercentage, setRewardPercentage] = useState(5);
  const baseLockAmount = isProofVerification ? 10000 : 20000; // sats
  const fees = 1000; // sats
  
  const calculateRewardAmount = () => {
    return Math.floor(baseLockAmount * (rewardPercentage / 100));
  };
  
  const calculateTotal = () => {
    return isProofVerification ? baseLockAmount + fees : baseLockAmount + calculateRewardAmount() + fees;
  };
  
  const handleConfirmDeposit = () => {
    // TODO: Implement deposit logic
    // For now, just navigate back to the quest page
    navigate('/quest/2'); // We're hardcoding to quest/2 for now
    
    // Show a toast based on the type of deposit
    if (isProofVerification) {
      if (state.type === 'verify') {
        // Show verification toast
      } else {
        // Show contest toast
      }
    } else {
      // Show quest creation toast
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {isProofVerification 
              ? state.type === 'verify' 
                ? 'Verify Proof' 
                : 'Contest Proof' 
              : 'Secure Your Commitment'
            }
          </h1>
          <p className="text-muted-foreground">
            {isProofVerification 
              ? state.type === 'verify' 
                ? 'Lock some sats to verify this proof. You\'ll earn rewards if your verification is correct.'
                : 'Lock some sats to contest this proof. You\'ll receive the full locked amount if your contest is validated.'
              : 'Lock some sats in our secure escrow to strengthen your commitment. You\'ll get them back when you complete your quest.'
            }
          </p>
        </div>

        <div className="glass rounded-2xl p-8 border border-border/50">
          {isProofVerification && (
            <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold">Proof Details</h2>
              </div>
              <p className="text-muted-foreground">
                {isProofVerification && 'proofDescription' in state ? state.proofDescription : ''}
              </p>
            </div>
          )}
          
          {/* Quest Info */}
          <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Quest Details</h2>
            </div>
            <p className="text-muted-foreground mt-2">
              {state.questDescription}
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Lock Amount Section */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <LockIcon size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Lock amount</h2>
                <p className="text-2xl font-bold">{baseLockAmount.toLocaleString()} sats</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isProofVerification 
                    ? 'This amount will be locked until the proof verification is complete.'
                    : 'This amount will be locked in escrow until you complete your quest.'
                  }
                </p>
              </div>
            </div>
            
            {/* Rewards Section - Only show for quest creation */}
            {!isProofVerification && (
              <div className="bg-secondary/10 rounded-lg p-6 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <Users size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold">Community Rewards</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Set aside a percentage of your locked amount as rewards for community members who verify your proof of completion.
                  Higher rewards attract more verifiers and faster responses.
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Reward: {rewardPercentage}%</span>
                    <span>{calculateRewardAmount().toLocaleString()} sats</span>
                  </div>
                  
                  <Slider
                    value={[rewardPercentage]}
                    onValueChange={(values) => setRewardPercentage(values[0])}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            {/* Summary Section */}
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
                    <span>{calculateRewardAmount().toLocaleString()} sats</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span>Platform Fees</span>
                  <span>{fees.toLocaleString()} sats</span>
                </div>
                
                <div className="pt-3 border-t border-border/50">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total to Lock</span>
                    <span className="text-red-500">{calculateTotal().toLocaleString()} sats</span>
                  </div>
                  {!isProofVerification && (
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll get back {baseLockAmount.toLocaleString()} sats upon successful completion
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleConfirmDeposit}
              leftIcon={isProofVerification 
                ? (state.type === 'verify' ? <Check size={16} /> : <X size={16} />)
                : <LockIcon size={16} />
              }
            >
              {isProofVerification 
                ? state.type === 'verify' 
                  ? 'Confirm Verification' 
                  : 'Confirm Contest'
                : `Lock ${calculateTotal().toLocaleString()} sats`
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDeposit;
