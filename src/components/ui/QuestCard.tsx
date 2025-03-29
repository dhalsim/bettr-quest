import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, UserPlus, UserCheck, Zap, Lock, CheckCircle, ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { isLockedQuest, LockedQuest, SavedQuest } from '@/types/quest';
import { assertNever, formatDate, calculateDaysRemaining, formatDateTime } from '@/lib/utils';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { mockProofs } from '@/mock/data';
import { languages } from '@/i18n/i18n';

interface QuestCardProps {
  quest: SavedQuest | LockedQuest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(null, { keyPrefix: "quest-card" });
  const { t: tTags } = useTranslation(null, { keyPrefix: "tags" });
  const { profile } = useNostrAuth();
  
  const daysRemaining = calculateDaysRemaining(quest.dueDate);
  const isOwnedByCurrentUser = quest.userId === profile?.pubkey;
  const isSavedQuest = quest.status === 'saved';
  const hasProof = isLockedQuest(quest) && mockProofs[quest.id]?.length > 0;
  const proof = hasProof ? mockProofs[quest.id][0] : null;
  
  const toggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  const handleSpecializationClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?specialization=${tag}`);
  };

  const handleLockSats = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/escrow-deposit`, {
      state: {
        type: 'quest',
        questId: quest.id,
        questTitle: quest.title,
        questDescription: quest.description,
        questLockedAmount: 0,
        questRewardAmount: 0,
        questDueDate: quest.dueDate,
        questCreatedAt: quest.createdAt,
        questSpecializations: quest.specializations,
        questVisibility: quest.visibility
      }
    });
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLockedQuest(quest)) return;
    
    navigate('/escrow-deposit', {
      state: {
        type: 'proof-verify',
        proofTitle: proof?.title,
        proofDescription: proof?.description,
        questTitle: quest.title,
        questDescription: quest.description,
        questLockedAmount: quest.lockedAmount,
        questRewardAmount: quest.rewardAmount,
        proofId: proof?.id,
        questId: quest.id
      }
    });
  };

  const handleContest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLockedQuest(quest)) return;
    
    navigate('/escrow-deposit', {
      state: {
        type: 'proof-contest',
        proofTitle: proof?.title,
        proofDescription: proof?.description,
        questTitle: quest.title,
        questDescription: quest.description,
        questLockedAmount: quest.lockedAmount,
        questRewardAmount: quest.rewardAmount,
        proofId: proof?.id,
        questId: quest.id
      }
    });
  };
  
  const getStatusBadgeClass = () => {
    const status = quest.status;

    switch (status) {
      case 'saved':
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

  const getStatusText = () => {
    const status = quest.status;

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
        return assertNever(status);
    }
  };
  
  return (
    <div className="relative overflow-hidden">
      <div className={`transition-transform duration-300 ${isExpanded ? 'translate-x-[-100%]' : 'translate-x-0'}`}>
        <Link to={`/quest/${quest.id}`} className="block group">
          <div className="glass rounded-2xl h-full transition-transform group-hover:translate-y-[-4px] group-hover:shadow-lg overflow-y-auto">
            {quest.imageUrl && (
              <div className="h-52 w-full overflow-hidden rounded-t-2xl">
                <img 
                  src={quest.imageUrl} 
                  alt={quest.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                {quest.specializations.map((tag) => (
                  <span 
                    key={tag.name}
                    onClick={(e) => handleSpecializationClick(e, tag.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                  >
                    {tTags(tag.name)}
                  </span>
                ))}
                
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                  ${getStatusBadgeClass()}`}
                >
                  {getStatusText()}
                </span>
              </div>
              
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
                  isSavedQuest ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleLockSats}
                      className="flex items-center gap-2"
                    >
                      <Lock size={16} />
                      {t('Lock sats')}
                    </Button>
                  ) : null // Don't show any button for non-saved own quests
                ) : (
                  <Button
                    variant={isFollowing ? "outline" : "secondary"}
                    size="sm"
                    onClick={toggleFollow}
                  >
                    {isFollowing ? <UserCheck size={16} className="mr-2" /> : <UserPlus size={16} className="mr-2" />}
                    {isFollowing ? t('Following') : t('Follow')}
                  </Button>
                )}
              </div>
              
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

                    {hasProof && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsExpanded(true);
                        }}
                        className="flex items-center gap-1.5 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                      >
                        <CheckCircle size={12} />
                        <span>{t('View proof')}</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Expanded Proof View */}
      <div className={`absolute inset-0 transition-transform duration-300 ${isExpanded ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="glass rounded-2xl h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                {t('Back to quest')}
              </Button>
            </div>

            {proof && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{proof.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <Clock size={14} />
                    <span>{formatDateTime(proof.createdAt, i18n.language as keyof typeof languages)}</span>
                  </div>
                  <p className="text-muted-foreground">{proof.description}</p>
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

                  {isLockedQuest(quest) && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('Locked amount')}</span>
                        <span className="font-medium">{quest.lockedAmount.toLocaleString()} {t('sats')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('Reward amount')}</span>
                        <span className="font-medium">{quest.rewardAmount.toLocaleString()} {t('sats')}</span>
                      </div>
                    </div>
                  )}

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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
