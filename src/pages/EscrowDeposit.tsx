import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ExternalLink, LockIcon, Shield, Users } from 'lucide-react';

interface LocationState {
  questTitle: string;
  questDescription: string;
}

const EscrowDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questTitle, questDescription } = location.state as LocationState;
  
  const [rewardPercentage, setRewardPercentage] = useState(5);
  const baseLockAmount = 20000; // sats
  const fees = 1000; // sats
  
  const calculateRewardAmount = () => {
    return Math.floor(baseLockAmount * (rewardPercentage / 100));
  };
  
  const calculateTotal = () => {
    return baseLockAmount + calculateRewardAmount() + fees;
  };
  
  const handleConfirmDeposit = () => {
    // TODO: Implement deposit logic
    // For now, just navigate to the quest page
    navigate('/quest/1'); // Replace with actual quest ID
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Secure Your Commitment</h1>
          <p className="text-muted-foreground">
            Lock some sats in our secure escrow to strengthen your commitment. You'll get them back when you complete your quest.
            Set rewards to incentivize the community to verify your proof of completion.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 border border-border/50">
          {/* Quest Info */}
          <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
            <div className="flex items-center gap-3">
              <a 
                href={`/quest/1`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <ExternalLink size={18} />
                <h2 className="text-xl font-semibold">{questTitle}</h2>
              </a>
            </div>
            <p className="text-muted-foreground mt-2">{questDescription}</p>
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
                  This amount will be locked in escrow until you complete your quest.
                  Think of it as a self-imposed security deposit to keep you motivated.
                </p>
              </div>
            </div>
            
            {/* Rewards Section */}
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
                <div className="flex justify-between items-center text-sm">
                  <span>Community Rewards</span>
                  <span>{calculateRewardAmount().toLocaleString()} sats</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Platform Fees</span>
                  <span>{fees.toLocaleString()} sats</span>
                </div>
                
                <div className="pt-3 border-t border-border/50">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total to Lock</span>
                    <span className="text-red-500">{calculateTotal().toLocaleString()} sats</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll get back {baseLockAmount.toLocaleString()} sats upon successful completion
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleConfirmDeposit}
            >
              <LockIcon size={16} className="mr-2" />
              Lock {calculateTotal().toLocaleString()} sats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDeposit; 