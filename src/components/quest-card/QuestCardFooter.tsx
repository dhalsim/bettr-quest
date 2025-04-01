import React from 'react';
import { Calendar, Clock, Lock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DraftQuest, LockedQuest, isLockedQuest } from '@/types/quest';
import { Button } from '@/components/ui/button';
import { formatDate, calculateDaysRemaining } from '@/lib/utils';

interface QuestCardFooterProps {
  quest: DraftQuest | LockedQuest;
  onViewProof: () => void;
}

const QuestCardFooter: React.FC<QuestCardFooterProps> = ({
  quest,
  onViewProof
}) => {
  const { t } = useTranslation(null, { keyPrefix: "quest-card" });
  const daysRemaining = calculateDaysRemaining(quest.dueDate);

  return (
    <div className="mt-4 pt-4 border-t border-border flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} />
          <span>{formatDate(quest.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>
            {daysRemaining > 0 
              ? `${daysRemaining} ${t('days remaining')}` 
              : t('Due date passed')}
          </span>
        </div>
      </div>
      
      {isLockedQuest(quest) && (
        <div className="flex items-center gap-4">
          {quest.totalZapped && quest.totalZapped > 0 && (
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Lock size={12} />
              <span>{quest.totalZapped.toLocaleString()} {t('sats')}</span>
            </div>
          )}

          {quest.status === 'on_review' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewProof}
              className="flex items-center gap-1.5 text-green-500 hover:text-green-600 hover:bg-green-500/10"
            >
              <CheckCircle size={12} />
              <span>{t('View proof')}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestCardFooter; 