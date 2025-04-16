import { Check, LockIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ConfirmButtonProps {
  type: 'quest' | 'proof-accept' | 'proof-reject';
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
  
  if (type === 'proof-accept') {
    text = t('escrow.rewards.confirmButton.Confirm Accept');
    icon = <Check size={16} />;
  } else if (type === 'proof-reject') {
    text = t('escrow.rewards.confirmButton.Confirm Reject');
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
