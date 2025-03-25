
import React from 'react';
import { Users } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface RewardsSliderProps {
  percentage: number;
  onPercentageChange: (value: number) => void;
  rewardAmount: number;
}

const RewardsSlider = ({ percentage, onPercentageChange, rewardAmount }: RewardsSliderProps) => {
  return (
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
          <span className="font-medium">Reward: {percentage}%</span>
          <span>{rewardAmount.toLocaleString()} sats</span>
        </div>
        
        <Slider
          value={[percentage]}
          onValueChange={(values) => onPercentageChange(values[0])}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RewardsSlider;
