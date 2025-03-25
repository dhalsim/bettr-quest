
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ExternalLink, LockIcon, Shield, Users, Check, X, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
  
  const renderRewardInfo = () => {
    if (!isProofVerification) {
      return null;
    }
    
    if ('type' in state && state.type === 'verify') {
      return (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            If your verification is correct, you'll receive <span className="font-bold">your locked amount + rewards</span> set aside by the quest creator.
          </AlertDescription>
        </Alert>
      );
    } else if ('type' in state && state.type === 'contest') {
      return (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            If your contest is valid, you'll receive <span className="font-bold">your locked amount + the entire locked amount of the quest</span>.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
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

        {renderRewardInfo()}

        <div className="glass rounded-2xl p-8 border border-border/50">
          {isProofVerification && 'proofTitle' in state && 'proofDescription' in state && (
            <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold">Proof Details</h2>
              </div>
              <h3 className="text-lg font-medium mb-2">{state.proofTitle}</h3>
              <p className="text-muted-foreground">
                {state.proofDescription}
              </p>
            </div>
          )}
          
          {/* Quest Info */}
          <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Quest Details</h2>
              <a 
                href={getQuestLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline"
              >
                View Quest <ArrowUpRight size={16} className="ml-1" />
              </a>
            </div>
            <h3 className="text-lg font-medium mt-2 mb-2">{state.questTitle}</h3>
            <p className="text-muted-foreground">
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
              leftIcon={isProofVerification && 'type' in state
                ? (state.type === 'verify' ? <Check size={16} /> : <X size={16} />)
                : <LockIcon size={16} />
              }
            >
              {isProofVerification && 'type' in state
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
