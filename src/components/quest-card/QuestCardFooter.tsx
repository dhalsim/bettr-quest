import React from 'react';
import { Calendar, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SavedQuest, LockedQuest } from '@/types/quest';
import { Button } from '@/components/ui/button';

interface QuestCardFooterProps {
  quest: SavedQuest | LockedQuest;
  onViewProof: () => void;
}

const QuestCardFooter: React.FC<QuestCardFooterProps> = ({
  quest,
  onViewProof
}) => {
  const { t } = useTranslation(null, { keyPrefix: "quest-card" });

  const daysRemaining = Math.ceil(
    (new Date(quest.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="flex items-center justify-between mt-5">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar size={14} />
        <span>
          {daysRemaining > 0
            ? t('days remaining', { count: daysRemaining })
            : t('Due date passed')}
        </span>
      </div>
      
      {quest.status === 'on_review' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewProof}
          className="flex items-center gap-2"
        >
          <Eye size={14} />
          {t('View proof')}
        </Button>
      )}
    </div>
  );
};

export default QuestCardFooter; 