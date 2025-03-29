import React from 'react';
import { User, Lock, UserPlus, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SavedQuest, LockedQuest } from '@/types/quest';
import { Button } from '@/components/ui/button';

interface QuestCardContentProps {
  quest: SavedQuest | LockedQuest;
  isOwnedByCurrentUser: boolean;
  isFollowing: boolean;
  onFollowToggle: (e: React.MouseEvent) => void;
  onLockSats: (e: React.MouseEvent) => void;
}

const QuestCardContent: React.FC<QuestCardContentProps> = ({
  quest,
  isOwnedByCurrentUser,
  isFollowing,
  onFollowToggle,
  onLockSats
}) => {
  const { t } = useTranslation(null, { keyPrefix: "quest-card" });

  return (
    <>
      <h3 className="text-xl font-semibold mb-3">{quest.title}</h3>
      
      <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
        {quest.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User size={14} />
          <span>@{quest.username}</span>
        </div>
        
        {isOwnedByCurrentUser ? (
          quest.status === 'saved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onLockSats}
              className="flex items-center gap-2"
            >
              <Lock size={16} />
              {t('Lock sats')}
            </Button>
          )
        ) : (
          <Button
            variant={isFollowing ? "outline" : "secondary"}
            size="sm"
            onClick={onFollowToggle}
            className="flex items-center gap-2"
          >
            {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
            {isFollowing ? t('Following') : t('Follow')}
          </Button>
        )}
      </div>
    </>
  );
};

export default QuestCardContent; 