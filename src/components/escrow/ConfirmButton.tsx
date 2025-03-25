
import React from 'react';
import { Check, LockIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmButtonProps {
  isProofVerification: boolean;
  type?: 'verify' | 'contest';
  totalAmount: number;
  onConfirm: () => void;
}

const ConfirmButton = ({ 
  isProofVerification, 
  type, 
  totalAmount, 
  onConfirm 
}: ConfirmButtonProps) => {
  let text = '';
  let icon = <LockIcon size={16} />;
  
  if (isProofVerification && type) {
    if (type === 'verify') {
      text = 'Confirm Verification';
      icon = <Check size={16} />;
    } else {
      text = 'Confirm Contest';
      icon = <X size={16} />;
    }
  } else {
    text = `Lock ${totalAmount.toLocaleString()} sats`;
  }
  
  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full"
      onClick={onConfirm}
      leftIcon={icon}
    >
      {text}
    </Button>
  );
};

export default ConfirmButton;
