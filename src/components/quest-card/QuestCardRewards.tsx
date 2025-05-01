import React from 'react';
import { ArrowLeft, Zap, Check, X, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LockedQuest } from '@/types/quest';
import { Button } from '@/components/ui/button';
import { getQuestProof } from '@/lib/proof-utils';

interface QuestCardRewardsProps {
  quest: LockedQuest;
  onBack: () => void;
}

interface Rewards {
  valid: number;
  invalid: number;
}

const QuestCardRewards: React.FC<QuestCardRewardsProps> = ({
  quest,
  onBack
}) => {
  const { t } = useTranslation(null, { keyPrefix: "quest-card" });
  
  const platformFees = 1000; // Fixed platform fee
  const verifierLockAmount = 10000; // Fixed verifier lock amount
  
  // Get votes from the proof instead of the quest
  const proof = getQuestProof(quest.id);
  const acceptorsCount = proof?.votes?.accept || 0;
  const rejectorsCount = proof?.votes?.reject || 0;
  
  const calculateQuestOwnerRewards = (): number | Rewards => {
    if (quest.status === 'success') {
      return quest.lockedAmount + (quest.totalZapped || 0) - platformFees - quest.rewardAmount;
    } else if (quest.status === 'in_dispute') {
      // In dispute, show potential outcomes
      return {
        valid: quest.lockedAmount + (quest.totalZapped || 0) - platformFees - quest.rewardAmount,
        invalid: 0
      };
    }

    return 0;
  };

  const calculateAcceptorRewards = (): number | Rewards => {
    if (quest.status === 'success') {
      return quest.rewardAmount / (acceptorsCount || 1); // Split among acceptors
    } else if (quest.status === 'in_dispute') {
      // In dispute, show potential outcomes
      return {
        valid: (quest.rewardAmount + (verifierLockAmount / 2)) / (acceptorsCount || 1), // Split among acceptors
        invalid: 0
      };
    }

    return 0;
  };

  const calculateRejectorRewards = (): Rewards => {
    if (quest.status === 'in_dispute') {
      // Only show for disputed quests
      const questOwnerAmount = quest.lockedAmount - platformFees - quest.rewardAmount;

      return {
        valid: 0,
        invalid: ((questOwnerAmount / 2) + (verifierLockAmount / 2)) / (rejectorsCount || 1) // Split among rejectors
      };
    }

    return { valid: 0, invalid: 0 };
  };

  const calculateCommunityFund = (): Rewards => {
    if (quest.status === 'in_dispute') {
      const questOwnerAmount = quest.lockedAmount - platformFees - quest.rewardAmount;

      return {
        valid: 0,
        invalid: (questOwnerAmount / 2) + (verifierLockAmount / 2) // Half of quest owner's funds + half of verifier's locked funds
      };
    }

    return { valid: 0, invalid: 0 };
  };

  const questOwnerRewards = calculateQuestOwnerRewards();
  const acceptorRewards = calculateAcceptorRewards();
  const rejectorRewards = calculateRejectorRewards();
  const communityFund = calculateCommunityFund();

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
          <h3 className="text-xl font-semibold mb-4">{t('rewards.Quest Rewards')}</h3>
          
          {/* Quest Owner Rewards */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">{t('rewards.Quest Owner Rewards')}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('rewards.Locked amount')}</span>
                <span className="font-medium">{quest.lockedAmount.toLocaleString()} {t('sats')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('rewards.Platform fees')}</span>
                <span className="font-medium">-{platformFees.toLocaleString()} {t('sats')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('rewards.Quest rewards')}</span>
                <span className="font-medium">-{quest.rewardAmount.toLocaleString()} {t('sats')}</span>
              </div>
              {quest.totalZapped > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('rewards.Donations')}</span>
                  <span className="font-medium text-yellow-500">+{quest.totalZapped.toLocaleString()} {t('sats')}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t('rewards.Total rewards')}</span>
                    {typeof questOwnerRewards === 'number' ? (
                      <span className="font-medium text-green-500">
                        {questOwnerRewards.toLocaleString()} {t('sats')}
                      </span>
                    ) : null}
                  </div>
                  {typeof questOwnerRewards !== 'number' && (
                    <div className="grid grid-cols-[1fr,auto]">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If accepted')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-500">
                        <Check size={14} />
                        <span>{questOwnerRewards.valid.toLocaleString()} {t('sats')}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If rejected')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-500">
                        <X size={14} />
                        <span>{questOwnerRewards.invalid.toLocaleString()} {t('sats')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Acceptor Rewards */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">{t('rewards.Acceptor Rewards')}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('rewards.Number of Acceptors')}</span>
                <span className="font-medium">{acceptorsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('rewards.Quest rewards')}</span>
                <span className="font-medium">{quest.rewardAmount.toLocaleString()} {t('sats')}</span>
              </div>
              {typeof acceptorRewards === 'number' ? (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t('rewards.Total rewards per Acceptor')}</span>
                    <span className="font-medium text-green-500">
                      {acceptorRewards.toLocaleString()} {t('sats')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t('rewards.Total rewards per Acceptor')}</span>
                    </div>
                    <div className="grid grid-cols-[1fr,auto]">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If accepted')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-500">
                        <Check size={14} />
                        <span>{acceptorRewards.valid.toLocaleString()} {t('sats')}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If rejected')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-500">
                        <X size={14} />
                        <span>{acceptorRewards.invalid.toLocaleString()} {t('sats')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rejector Rewards - Only shown for disputed quests */}
          {quest.status === 'in_dispute' && (
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">{t('rewards.Rejector Rewards')}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('rewards.Number of Rejectors')}</span>
                  <span className="font-medium">{rejectorsCount}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t('rewards.Total rewards per Rejector')}</span>
                    </div>
                    <div className="grid grid-cols-[1fr,auto]">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If accepted')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-500">
                        <Check size={14} />
                        <span>{rejectorRewards.valid.toLocaleString()} {t('sats')}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If rejected')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-500">
                        <X size={14} />
                        <span>{rejectorRewards.invalid.toLocaleString()} {t('sats')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Community Fund - Only shown for disputed quests */}
          {quest.status === 'in_dispute' && (
            <div>
              <h4 className="text-lg font-medium mb-3">{t('rewards.Community Fund')}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('rewards.From Quest Owner')}</span>
                  <span className="font-medium">{(quest.lockedAmount - platformFees - quest.rewardAmount) / 2} {t('sats')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('rewards.From Verifiers')}</span>
                  <span className="font-medium">{verifierLockAmount / 2} {t('sats')}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t('rewards.Total to Community Fund')}</span>
                    </div>
                    <div className="grid grid-cols-[1fr,auto]">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If accepted')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-500">
                        <Check size={14} />
                        <span>{communityFund.valid.toLocaleString()} {t('sats')}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">{t('rewards.If rejected')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-500">
                        <X size={14} />
                        <span>{communityFund.invalid.toLocaleString()} {t('sats')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestCardRewards; 