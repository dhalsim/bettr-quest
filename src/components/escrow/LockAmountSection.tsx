import React from 'react';
import { LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LockAmountSectionProps {
  amount: number;
  isProofVerification: boolean;
}

const LockAmountSection = ({ amount, isProofVerification }: LockAmountSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-full bg-primary/10">
        <LockIcon size={24} className="text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">{t('escrow.rewards.lockAmount.Lock amount')}</h2>
        <p className="text-2xl font-bold">{amount.toLocaleString()} sats</p>
        <p className="text-sm text-muted-foreground mt-1">
          {isProofVerification 
            ? t('escrow.rewards.lockAmount.This amount will be locked until the proof verification is complete.')
            : t('escrow.rewards.lockAmount.This amount will be locked in escrow until you complete your quest.')
          }
        </p>
      </div>
    </div>
  );
};

export default LockAmountSection;
