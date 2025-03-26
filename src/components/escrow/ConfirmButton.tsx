
import React from 'react';
import { Check, LockIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmButtonProps {
  type: 'quest' | 'proof-verify' | 'proof-contest';
  totalAmount: number;
  onConfirm: () => void;
}

const ConfirmButton = ({ 
  type, 
  totalAmount, 
  onConfirm 
}: ConfirmButtonProps) => {
  let text = '';
  let icon = <LockIcon size={16} />;
  
  if (type === 'proof-verify') {
    text = 'Confirm Verification';
    icon = <Check size={16} />;
  } else if (type === 'proof-contest') {
    text = 'Confirm Contest';
    icon = <X size={16} />;
  } else if (type === 'quest') {
    text = `Lock ${totalAmount.toLocaleString()} sats`;
    icon = <LockIcon size={16} />;
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
