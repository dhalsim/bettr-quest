import React from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LockedQuest } from '@/types/quest';
import { Proof } from '@/types/proof';
import { Button } from '@/components/ui/button';

interface QuestCardProofProps {
  quest: LockedQuest;
  proof: Proof;
  onBack: () => void;
}

const QuestCardProof: React.FC<QuestCardProofProps> = ({
  quest,
  proof,
  onBack
}) => {
  const { t } = useTranslation(null, { keyPrefix: "quest-card" });
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate('/escrow/deposit', {
      state: {
        questId: quest.id,
        lockedAmount: quest.lockedAmount,
        rewardAmount: quest.rewardAmount,
        action: 'verify'
      }
    });
  };

  const handleContest = () => {
    navigate('/escrow/deposit', {
      state: {
        questId: quest.id,
        lockedAmount: quest.lockedAmount,
        rewardAmount: quest.rewardAmount,
        action: 'contest'
      }
    });
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={14} />
        {t('Back to quest')}
      </Button>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{proof.title}</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {proof.description}
          </p>
          <div className="text-sm text-muted-foreground">
            {t('Created on')} {new Date(proof.createdAt).toLocaleDateString()}
          </div>
        </div>

        {proof.imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={proof.imageUrl}
              alt={proof.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-green-500">
            <Check size={14} />
            <span>{proof.votes.accept} {t('Verify votes')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-500">
            <X size={14} />
            <span>{proof.votes.reject} {t('Contest votes')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('Locked amount')}</span>
            <span className="font-medium">{quest.lockedAmount} sats</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('Reward amount')}</span>
            <span className="font-medium">{quest.rewardAmount} sats</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="default"
            className="flex-1"
            onClick={handleVerify}
          >
            {t('Verify')}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleContest}
          >
            {t('Contest')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestCardProof; 