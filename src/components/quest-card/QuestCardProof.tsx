import React from 'react';
import { ArrowLeft, Check, X, Clock, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { LockedQuest } from '@/types/quest';
import { Proof } from '@/types/proof';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { languages } from '@/i18n/i18n';
import { pages } from '@/lib/pages';

interface QuestCardProofProps {
  quest: LockedQuest;
  proof: Proof;
  onBack: () => void;
  onViewRewards: () => void;
}

const QuestCardProof: React.FC<QuestCardProofProps> = ({
  quest,
  proof,
  onBack,
  onViewRewards
}) => {
  const { t, i18n } = useTranslation(null, { keyPrefix: "quest-card" });
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate(pages.verifyProof.path.replace(':id', proof.id), {
      state: {
        type: 'proof-accept',
        proofTitle: proof.title,
        proofDescription: proof.description,
        questTitle: quest.title,
        questDescription: quest.description,
        questLockedAmount: quest.lockedAmount,
        questRewardAmount: quest.rewardAmount,
        proofId: proof.id,
        questId: quest.id
      }
    });
  };

  const handleContest = () => {
    navigate(pages.verifyProof.path.replace(':id', proof.id), {
      state: {
        type: 'proof-reject',
        proofTitle: proof.title,
        proofDescription: proof.description,
        questTitle: quest.title,
        questDescription: quest.description,
        questLockedAmount: quest.lockedAmount,
        questRewardAmount: quest.rewardAmount,
        proofId: proof.id,
        questId: quest.id
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          {t('Back to quest')}
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Link to={`/quest/${quest.id}#proof-${proof.id}`} className="block">
            <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{proof.title}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
              <Clock size={14} />
              <span>{formatDateTime(proof.createdAt, i18n.language as keyof typeof languages)}</span>
            </div>
            <p className="text-muted-foreground hover:text-muted-foreground/80 transition-colors">{proof.description}</p>
          </Link>
        </div>

        {proof.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={proof.imageUrl} 
              alt="Proof" 
              className="w-full h-auto" 
            />
          </div>
        )}

        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-green-500">
              <Check size={16} />
              <span>{proof.votes.accept}</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-500">
              <X size={16} />
              <span>{proof.votes.reject}</span>
            </div>
          </div>

          {quest.status === 'on_review' && (
            <div className="flex gap-3">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white" 
                size="sm"
                onClick={handleVerify}
              >
                <Check size={16} className="mr-1.5" />
                {t('Verify')}
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white" 
                size="sm"
                onClick={handleContest}
              >
                <X size={16} className="mr-1.5" />
                {t('Contest')}
              </Button>
            </div>
          )}

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewRewards}
              className="w-full flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              {t('View Rewards')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCardProof; 