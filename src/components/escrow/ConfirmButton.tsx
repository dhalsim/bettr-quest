import React from 'react';
import { Check, LockIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  let text = '';
  let icon = <LockIcon size={16} />;
  
  if (type === 'proof-verify') {
    text = t('escrow.rewards.confirmButton.Confirm Verification');
    icon = <Check size={16} />;
  } else if (type === 'proof-contest') {
    text = t('escrow.rewards.confirmButton.Confirm Contest');
    icon = <X size={16} />;
  } else if (type === 'quest') {
    text = t('escrow.rewards.confirmButton.Lock {{amount}} sats', { amount: totalAmount.toLocaleString() });
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
