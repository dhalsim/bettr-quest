import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Zap } from 'lucide-react';
import { LockedQuest } from '@/types/quest';

interface QuestCardFooterProps {
  quest: LockedQuest;
  onViewProof: () => void;
  onViewRewards: () => void;
}

const QuestCardFooter: React.FC<QuestCardFooterProps> = ({
  quest,
  onViewProof,
  onViewRewards,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onViewRewards}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          <Zap size={14} />
          <span>{t('Show rewards')}</span>
        </button>
        <button
          onClick={onViewProof}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          <Eye size={14} />
          <span>{t('View proof')}</span>
        </button>
      </div>
    </div>
  );
};

export default QuestCardFooter; 