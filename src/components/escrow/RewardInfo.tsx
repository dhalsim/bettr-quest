
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RewardInfoProps {
  type?: 'verify' | 'contest';
}

const RewardInfo = ({ type }: RewardInfoProps) => {
  if (!type) return null;
  
  if (type === 'verify') {
    return (
      <Alert className="mb-6 bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          If your verification is correct, you'll receive <span className="font-bold">your locked amount + rewards</span> set aside by the quest creator.
        </AlertDescription>
      </Alert>
    );
  } else if (type === 'contest') {
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

export default RewardInfo;
