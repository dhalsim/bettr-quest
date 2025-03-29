import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavedQuest, LockedQuest } from '@/types/quest';
import { Badge } from '@/components/ui/badge';

interface QuestCardHeaderProps {
  quest: SavedQuest | LockedQuest;
  onSpecializationClick: (e: React.MouseEvent, specialization: string) => void;
}

const QuestCardHeader: React.FC<QuestCardHeaderProps> = ({
  quest,
  onSpecializationClick
}) => {
  const { t } = useTranslation(null, { keyPrefix: "quest-card" });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'saved':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'on_review':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'success':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'in_dispute':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'saved':
        return t('Saved');
      case 'on_review':
        return t('On Review');
      case 'success':
        return t('Success');
      case 'failed':
        return t('Failed');
      case 'in_dispute':
        return t('In Dispute');
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {quest.specializations.map((specialization) => (
        <Badge
          key={specialization.name}
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
          onClick={(e) => onSpecializationClick(e, specialization.name)}
        >
          {specialization.name}
        </Badge>
      ))}
      <Badge
        variant="secondary"
        className={getStatusBadgeClass(quest.status)}
      >
        {getStatusText(quest.status)}
      </Badge>
    </div>
  );
};

export default QuestCardHeader; 