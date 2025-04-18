import React, { useState } from 'react';
import { DraftQuest, LockedQuest, isLockedQuest } from '@/types/quest';
import { Proof } from '@/types/proof';
import QuestCardHeader from './QuestCardHeader';
import QuestCardContent from './QuestCardContent';
import QuestCardFooter from './QuestCardFooter';
import QuestCardProof from './QuestCardProof';
import QuestCardRewards from './QuestCardRewards';

interface QuestCardProps {
  quest: DraftQuest | LockedQuest;
  proof?: Proof;
  isOwnedByCurrentUser: boolean;
  isFollowing: boolean;
  onSpecializationClick: (e: React.MouseEvent, specialization: string) => void;
  onFollowToggle: (e: React.MouseEvent) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  proof,
  isOwnedByCurrentUser,
  isFollowing,
  onSpecializationClick,
  onFollowToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <div
        className={`transition-transform duration-300 ease-in-out ${
          isExpanded || showRewards ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border overflow-hidden">
          <div className="overflow-hidden">
            <QuestCardHeader
              quest={quest}
              onSpecializationClick={onSpecializationClick}
            />
          </div>
          <div className="pt-3 px-6 pb-6">
            <QuestCardContent
              quest={quest}
              isOwnedByCurrentUser={isOwnedByCurrentUser}
              isFollowing={isFollowing}
              onFollowToggle={onFollowToggle}
            />
            
            {isLockedQuest(quest) && (
              <QuestCardFooter
                quest={quest}
                onViewProof={() => setIsExpanded(true)}
                onViewRewards={() => setShowRewards(true)}
              />
            )}
          </div>
        </div>
      </div>

      {proof && isLockedQuest(quest) && (
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            isExpanded ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border h-full overflow-y-auto">
            <QuestCardProof
              quest={quest}
              proof={proof}
              onBack={() => setIsExpanded(false)}
              onViewRewards={() => {
                setIsExpanded(false);
                setShowRewards(true);
              }}
            />
          </div>
        </div>
      )}

      {isLockedQuest(quest) && (
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            showRewards ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border h-full overflow-y-auto">
            <QuestCardRewards
              quest={quest}
              onBack={() => setShowRewards(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestCard; 