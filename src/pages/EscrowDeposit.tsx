
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import QuestDetailsCard from '@/components/escrow/QuestDetailsCard';
import ProofDetailsCard from '@/components/escrow/ProofDetailsCard';
import RewardInfo from '@/components/escrow/RewardInfo';
import LockAmountSection from '@/components/escrow/LockAmountSection';
import RewardsSlider from '@/components/escrow/RewardsSlider';
import SummarySection from '@/components/escrow/SummarySection';
import ConfirmButton from '@/components/escrow/ConfirmButton';

interface QuestLocationState {
  questTitle: string;
  questDescription: string;
  questId?: string;
  type?: undefined;
}

interface ProofLocationState {
  type: 'verify' | 'contest';
  proofTitle: string;
  proofDescription: string;
  questTitle: string;
  questDescription: string;
  proofId: string;
  questId: string;
}

type LocationState = QuestLocationState | ProofLocationState;

const EscrowDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<LocationState | null>(null);
  const [rewardPercentage, setRewardPercentage] = useState(5);
  
  useEffect(() => {
    // Set state from location or redirect to explore if missing
    if (location.state) {
      setState(location.state as LocationState);
    } else {
      navigate('/explore');
    }
  }, [location, navigate]);
  
  // Guard against null state during initial render or after refresh
  if (!state) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }
  
  const isProofVerification = 'type' in state && (state.type === 'verify' || state.type === 'contest');
  
  const baseLockAmount = isProofVerification ? 10000 : 20000; // sats
  const fees = 1000; // sats
  
  const calculateRewardAmount = () => {
    return Math.floor(baseLockAmount * (rewardPercentage / 100));
  };
  
  const calculateTotal = () => {
    return isProofVerification ? baseLockAmount + fees : baseLockAmount + calculateRewardAmount() + fees;
  };
  
  const getQuestLink = () => {
    if (isProofVerification && 'questId' in state) {
      return `/quest/${state.questId}`;
    } else if (!isProofVerification && 'questId' in state) {
      return `/quest/${state.questId}`;
    } else {
      return `/quest/2`; // Fallback
    }
  };
  
  const handleConfirmDeposit = () => {
    // TODO: Implement deposit logic
    // For now, just navigate back to the quest page
    navigate(getQuestLink());
    
    // Show a toast based on the type of deposit
    if (isProofVerification && 'type' in state) {
      if (state.type === 'verify') {
        toast({
          title: "Verification Submitted",
          description: "Your verification has been submitted and your sats have been locked.",
          variant: "default",
        });
      } else {
        toast({
          title: "Contest Submitted",
          description: "Your contest has been submitted and your sats have been locked.",
          variant: "default",
        });
      }
    } else {
      toast({
        title: "Quest Created",
        description: "Your quest has been created and your sats have been locked.",
        variant: "default",
      });
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {isProofVerification && 'type' in state
              ? state.type === 'verify' 
                ? 'Verify Proof' 
                : 'Contest Proof' 
              : 'Secure Your Commitment'
            }
          </h1>
          <p className="text-muted-foreground">
            {isProofVerification && 'type' in state
              ? state.type === 'verify' 
                ? 'Lock some sats to verify this proof. You\'ll earn rewards if your verification is correct.'
                : 'Lock some sats to contest this proof. You\'ll receive the full locked amount if your contest is validated.'
              : 'Lock some sats in our secure escrow to strengthen your commitment. You\'ll get them back when you complete your quest.'
            }
          </p>
        </div>

        {isProofVerification && 'type' in state && (
          <RewardInfo type={state.type} />
        )}

        <div className="glass rounded-2xl p-8 border border-border/50">
          {isProofVerification && 'proofTitle' in state && 'proofDescription' in state && (
            <ProofDetailsCard 
              title={state.proofTitle} 
              description={state.proofDescription} 
            />
          )}
          
          <QuestDetailsCard 
            title={state.questTitle}
            description={state.questDescription}
            questLink={getQuestLink()}
          />
          
          <div className="space-y-8">
            <LockAmountSection 
              amount={baseLockAmount} 
              isProofVerification={isProofVerification} 
            />
            
            {!isProofVerification && (
              <RewardsSlider 
                percentage={rewardPercentage}
                onPercentageChange={setRewardPercentage}
                rewardAmount={calculateRewardAmount()}
              />
            )}
            
            <SummarySection 
              baseLockAmount={baseLockAmount}
              rewardAmount={calculateRewardAmount()}
              fees={fees}
              total={calculateTotal()}
              isProofVerification={isProofVerification}
            />
            
            <ConfirmButton 
              isProofVerification={isProofVerification}
              type={'type' in state ? state.type : undefined}
              totalAmount={calculateTotal()}
              onConfirm={handleConfirmDeposit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDeposit;
