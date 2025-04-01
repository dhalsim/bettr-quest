import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DraftQuest, LockedQuest, QuestStatus } from '@/types/quest';
import { assertNever } from '@/lib/utils';

interface QuestCardHeaderProps {
  quest: DraftQuest | LockedQuest;
  onSpecializationClick: (e: React.MouseEvent, specialization: string) => void;
}

const QuestCardHeader: React.FC<QuestCardHeaderProps> = ({
  quest,
  onSpecializationClick
}) => {
  const { t } = useTranslation(null, { keyPrefix: "quest-card" });

  const getStatusBadgeClass = (status: QuestStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-blue-500/10 text-blue-500';
      case 'on_review':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      case 'in_dispute':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return assertNever(status);
    }
  };

  const getStatusText = (status: QuestStatus) => {
    switch (status) {
      case 'draft':
        return t('Draft');
      case 'on_review':
        return t('On Review');
      case 'success':
        return t('Success');
      case 'failed':
        return t('Failed');
      case 'in_dispute':
        return t('In Dispute');
      default:
        return assertNever(status);
    }
  };

  return (
    <>
      {quest.imageUrl && (
        <Link to={`/quest/${quest.id}`} className="block h-52 w-full overflow-hidden">
          <img 
            src={quest.imageUrl} 
            alt={quest.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
          />
        </Link>
      )}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            {quest.specializations.map((specialization) => (
              <span 
                key={specialization.name}
                onClick={(e) => onSpecializationClick(e, specialization.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {specialization.name}
              </span>
            ))}
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(quest.status)}`}>
            {getStatusText(quest.status)}
          </span>
        </div>
      </div>
    </>
  );
};

export default QuestCardHeader;
