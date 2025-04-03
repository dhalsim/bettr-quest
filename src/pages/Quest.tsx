import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Send, Flag, Check, ArrowDown, Copy, CircleCheck, CircleX, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProofCard from '@/components/ui/ProofCard';
import { Proof } from '@/types/proof';
import { toast } from 'sonner';
import MediaUpload from '@/components/quest/MediaUpload';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ZapModal from '@/components/quest/ZapModal';
import { LockedQuest, DraftQuest } from '@/types/quest';
import { mockQuests, mockProofs, mockThreadComments } from '@/mock/data';
import { useTranslation } from 'react-i18next';
import { formatDate, calculateDaysRemaining } from '@/lib/utils';
import { languages } from '@/i18n/i18n';
import { pages, getPreviousPageName } from '@/lib/pages';
import Threads from '@/components/threads/Threads';
import { ThreadComment } from '@/types/thread';

const QuestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isLoggedIn } = useNostrAuth();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [questData, setQuestData] = useState<LockedQuest | DraftQuest | null>(null);
  const [newProof, setNewProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [zapModalOpen, setZapModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [threadComments, setThreadComments] = useState<ThreadComment[]>(mockThreadComments);

  const [mediaFiles, setMediaFiles] = useState<{
    image: File | null,
    video: File | null,
    audio: Blob | null,
    recordedVideo: Blob | null
  }>({
    image: null,
    video: null,
    audio: null,
    recordedVideo: null
  });
  
  const previousPageName = getPreviousPageName();
  const previousPageLabel = previousPageName ? t(`pages.${previousPageName}`) : t(`pages.${pages.explore.name}`);
  
  useEffect(() => {
    if (id && mockQuests[id]) {
      setQuestData(mockQuests[id]);
      setProofs(mockProofs[id] || []);
    } else {
      setQuestData(mockQuests["1"]);
      setProofs(mockProofs["1"] || []);
    }
  }, [id]);
  
  if (!questData) {
    return <div className="min-h-screen pt-32 pb-20 px-6">Loading quest...</div>;
  }
  
  const daysRemaining = calculateDaysRemaining(questData.dueDate);

  const getStatusBadgeClass = () => {
    const status = questData.status;
    if (status === 'on_review') {
      return 'bg-yellow-500/10 text-yellow-500';
    } else if (status === 'success') {
      return 'bg-green-500/10 text-green-500';
    } else if (status === 'failed') {
      return 'bg-red-500/10 text-red-500';
    } else if (status === 'in_dispute') {
      return 'bg-orange-500/10 text-orange-500';
    } else {
      return 'bg-blue-500/10 text-blue-500';
    }
  };

  const getStatusText = () => {
    const status = questData.status;
    if (status === 'on_review') {
      return t('quest.On Review');
    } else if (status === 'success') {
      return t('quest.Success');
    } else if (status === 'failed') {
      return t('quest.Failed');
    } else if (status === 'in_dispute') {
      return t('quest.In Dispute');
    } else {
      return t('quest.Saved');
    }
  };
  
  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProof.trim()) {
      toast.error("Please describe how you completed your quest");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newProofItem: Proof = {
        id: `proof${Date.now()}`,
        challengeId: questData.id,
        userId: 'current-user',
        username: 'you',
        title: 'New Proof Submission',
        createdAt: new Date().toISOString(),
        description: newProof,
        imageUrl: mediaFiles.image ? URL.createObjectURL(mediaFiles.image) : undefined,
        votes: {
          accept: 0,
          reject: 0
        },
      };
      
      setProofs([newProofItem, ...proofs]);
      setNewProof('');
      setMediaFiles({
        image: null,
        video: null,
        audio: null,
        recordedVideo: null
      });
      setIsSubmitting(false);
      
      toast.success("Your proof has been submitted for review!");
    }, 1500);
  };
  
  const reportQuest = () => {
    toast.success("Thank you for your report. Our moderators will review this quest.");
  };
  
  const handleSpecializationClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`${pages.explore.location}?specialization=${tag}`);
  };
  
  const handleCopyQuest = () => {
    const params = new URLSearchParams({
      title: questData.title,
      description: questData.description,
      tags: questData.specializations.map(s => s.name).join(','),
      imageUrl: questData.imageUrl || ''
    });
    
    navigate(`${pages.createQuest.location}?${params.toString()}`);
    
    toast.success(t('quest.Quest details copied! Customize your new quest.'));
  };
  
  const handleZapComplete = (amount: number) => {
    if (questData && isLockedQuest(questData)) {
      const updatedQuest = {
        ...questData,
        totalZapped: questData.totalZapped + amount
      };
      setQuestData(updatedQuest);
      
      toast.success(`You've zapped ${amount} sats to "${questData.title}"!`);
    }
  };
  
  const isQuestCreator = profile?.username === questData.username;
  const isQuestActive = new Date(questData.dueDate) > new Date() && 
                      (questData.status === 'on_review');
  const isDraftQuest = questData.status === 'draft';
  
  // Helper function to check if quest is locked
  const isLockedQuest = (quest: LockedQuest | DraftQuest): quest is LockedQuest => {
    return 'lockedAmount' in quest && 'rewardAmount' in quest && 'escrowStatus' in quest;
  };

  // Helper function to get quest reward amount
  const getQuestRewardAmount = (quest: LockedQuest | DraftQuest): number => {
    return isLockedQuest(quest) ? quest.rewardAmount : 0;
  };

  // Helper function to get locked amount
  const getLockedAmount = (quest: LockedQuest | DraftQuest): number => {
    return isLockedQuest(quest) ? quest.lockedAmount : 0;
  };

  // Helper function to get escrow status
  const getEscrowStatus = (quest: LockedQuest | DraftQuest): 'locked' | 'distributed' | 'in_process' | undefined => {
    return isLockedQuest(quest) ? quest.escrowStatus : undefined;
  };

  // Helper function to check if quest is in dispute
  const isInDispute = (quest: LockedQuest | DraftQuest): boolean => {
    return isLockedQuest(quest) ? quest.inDispute || false : false;
  };

  // Helper function to get total zapped amount
  const getTotalZapped = (quest: LockedQuest | DraftQuest): number => {
    return isLockedQuest(quest) ? quest.totalZapped : 0;
  };

  // Calculate rewards
  const verificationReward = questData ? getQuestRewardAmount(questData) : 0;
  const contestReward = questData ? getLockedAmount(questData) : 0;
  const totalZapped = questData ? getTotalZapped(questData) : 0;
  
  const handleAddComment = (content: string, parentId?: string) => {
    // Here you would typically make an API call to save the comment
    // For now, we'll just update the local state
    const newComment: ThreadComment = {
      id: `comment_${Date.now()}`,
      author: {
        username: profile?.username || '',
        displayName: profile?.displayName || '',
        profileImage: profile?.profileImage || ''
      },
      content,
      createdAt: new Date().toISOString(),
      replies: []
    };

    setThreadComments([newComment, ...threadComments]);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.Back to {{page}}', { page: previousPageLabel })}
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-grow lg:w-2/3">
              <div className="glass rounded-2xl overflow-hidden">
                {questData.imageUrl && (
                  <div className="h-72 md:h-96 w-full">
                    <img 
                      src={questData.imageUrl} 
                      alt={questData.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {questData.specializations.map((specialization) => (
                      <span 
                        key={specialization.name}
                        onClick={(e) => handleSpecializationClick(e, specialization.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                      >
                        <Tag size={12} />
                        {t(`tags.${specialization.name}`)}
                      </span>
                    ))}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
                      <Check size={12} />
                      {getStatusText()}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      <User size={12} />
                      {t(questData.visibility === 'public' ? 'quest.Public Quest' : 'quest.Private Quest')}
                    </span>
                    {!isDraftQuest && totalZapped > 0 && (
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 cursor-pointer hover:bg-yellow-500/20 transition-colors"
                        onClick={() => {
                          setActiveTab('donations');
                          // Scroll to the donations tab content
                          document.getElementById('donations-tab')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <Zap size={12} />
                        {totalZapped.toLocaleString()} sats
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">
                    {questData.title}
                  </h1>
                  
                  {isLoggedIn && isQuestActive && !isDraftQuest && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {!isQuestCreator && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setZapModalOpen(true)}
                          className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
                        >
                          <Zap size={16} className="mr-1" />
                          {t('quest.Zap ⚡️')}
                        </Button>
                      )}
                      
                      {profile && !isQuestCreator && (
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={handleCopyQuest}
                        >
                          <Copy size={16} className="mr-2" />
                          {t('quest.Copy Quest')}
                        </Button>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      {t('quest.Created by')} {' '}
                      <Link to={`/profile/${questData.username}`} className="text-primary hover:underline">
                        {questData.username}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {t('quest.Created on')} {formatDate(questData.createdAt, i18n.language as keyof typeof languages)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {daysRemaining > 0 
                        ? `${daysRemaining} ${t('quest.days remaining')}` 
                        : t('quest.Due date passed')}
                    </div>
                  </div>
                  
                  {!isDraftQuest && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <h3 className="text-lg font-medium mb-1">{t('quest.Quest Rewards')}</h3>
                          <p className="text-sm text-muted-foreground">{t('quest.Locked amount')}: <span className="font-semibold text-foreground">{getLockedAmount(questData).toLocaleString() || 0} sats</span></p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="bg-green-500/10 text-green-500 px-3 py-2 rounded-md text-sm">
                            <div className="font-medium">{t('quest.Verification Reward')}</div>
                            <div className="font-bold">{verificationReward.toLocaleString()} sats</div>
                          </div>
                          <div className="bg-red-500/10 text-red-500 px-3 py-2 rounded-md text-sm">
                            <div className="font-medium">{t('quest.Contest Reward')}</div>
                            <div className="font-bold">{contestReward.toLocaleString()} sats</div>
                          </div>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">{t('quest.Learn how rewards work')}</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t('quest.How Quest Rewards Work')}</DialogTitle>
                              <DialogDescription>
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-1 flex items-center gap-2 text-green-500">
                                      <CircleCheck size={16} /> {t('quest.Verification Reward')}
                                    </h4>
                                    <p className="text-sm">
                                      {t('quest.Verifying legitimate proofs earns you {{amount}} sats', { amount: verificationReward.toLocaleString() })}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-1 flex items-center gap-2 text-red-500">
                                      <CircleX size={16} /> {t('quest.Contest Reward')}
                                    </h4>
                                    <p className="text-sm">
                                      {t('quest.Successfully contesting a fraudulent proof earns you the entire locked amount {{amount}} sats', { amount: contestReward.toLocaleString() })}
                                    </p>
                                  </div>
                                  
                                  <div className="pt-2 border-t border-border">
                                    <p className="text-sm font-medium">{t('quest.The quest creator has locked {{amount}} sats to ensure accountability.', { amount: getLockedAmount(questData).toLocaleString() || 0 })}</p>
                                  </div>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                  
                  <Tabs defaultValue="details" onValueChange={setActiveTab} className="mt-6">
                    <TabsList className="mb-6">
                      <TabsTrigger value="details">{t('quest.Details')}</TabsTrigger>
                      {!isDraftQuest && <TabsTrigger value="escrow">{t('quest.Escrow & Rewards')}</TabsTrigger>}
                      {!isDraftQuest && totalZapped > 0 && <TabsTrigger value="donations">{t('quest.Donations')}</TabsTrigger>}
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
                      <div className="prose prose-slate max-w-none">
                        <p className="text-foreground">{questData.description}</p>
                      </div>
                    </TabsContent>
                    
                    {!isDraftQuest && (
                      <TabsContent value="escrow" className="space-y-4">
                        <div className="bg-secondary/20 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">{t('quest.Escrow Information')}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">{t('quest.Creator Locked Amount')}</p>
                              <p className="text-xl font-semibold">{getLockedAmount(questData).toLocaleString() || 0} sats</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">{t('quest.Escrow Status')}</p>
                              <p className="text-xl font-semibold capitalize">{getEscrowStatus(questData) || 'Locked'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">{t('quest.Quest Status')}</p>
                              <p className="text-xl font-semibold capitalize">{getStatusText()}</p>
                            </div>
                            {isInDispute(questData) && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">{t('quest.Dispute Status')}</p>
                                <p className="text-xl font-semibold text-orange-500">{t('quest.Under Review')}</p>
                              </div>
                            )}
                          </div>
                          
                          <Separator className="my-6" />
                          
                          <div>
                            <h4 className="text-md font-medium mb-3">{t('quest.Reward Distribution')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('quest.If the proof is accepted, the acceptor will receive a reward from the locked amount. Multiple acceptors will split the reward equally')}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    )}
                    
                    {!isDraftQuest && totalZapped > 0 && (
                      <TabsContent value="donations" className="space-y-4" id="donations-tab">
                        <div className="bg-secondary/20 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">{t('quest.Donation Information')}</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Zap size={20} className="text-yellow-500" />
                                <span className="text-lg font-semibold">{totalZapped.toLocaleString()} sats</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{t('quest.Total Donated')}</span>
                            </div>
                            <div className="bg-yellow-500/10 p-4 rounded-lg">
                              <p className="text-sm text-yellow-500">
                                {t('quest.This amount will be awarded to the quest owner when the quest is successfully completed.')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                  
                  <div className="mt-8 flex items-center justify-between">
                    {isQuestCreator && (
                      isDraftQuest ? (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <Button 
                            variant="primary"
                            onClick={() => navigate(pages.escrowDeposit.location, {
                              state: {
                                type: 'quest',
                                questId: questData.id,
                                questTitle: questData.title,
                                questDescription: questData.description,
                                questLockedAmount: 0,
                                questRewardAmount: 0,
                                questDueDate: questData.dueDate,
                                questCreatedAt: questData.createdAt,
                                questSpecializations: questData.specializations,
                                questVisibility: questData.visibility
                              }
                            })}
                          >
                            <Lock size={16} className="mr-2" />
                            {t('quest.Lock sats')}
                          </Button>
                          <p className="text-sm text-muted-foreground max-w-md">
                            {t('escrow.Lock some sats to publish your quest. This ensures accountability and helps the community validate your achievements')}
                          </p>
                        </div>
                      ) : (
                        <Button 
                          variant="primary"
                          onClick={() => document.getElementById('submit-proof')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          {t('quest.Submit Your Proof')}
                          <ArrowDown size={16} className="ml-2" />
                        </Button>
                      )
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={reportQuest}
                      className={isQuestCreator ? "" : "ml-auto"}
                    >
                      <Flag size={16} className="mr-2" />
                      {t('quest.Report Quest')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {isQuestCreator && !isDraftQuest && (
              <div className="lg:w-1/3" id="submit-proof">
                <div className="glass rounded-2xl p-6 sticky top-32">
                  <h2 className="text-xl font-semibold mb-4">{t('quest.Submit Your Proof')}</h2>
                  <form onSubmit={handleSubmitProof}>
                    <div className="mb-4">
                      <label htmlFor="proof-description" className="block text-sm font-medium mb-1">
                        {t('quest.How did you complete this quest?')}
                      </label>
                      <textarea
                        id="proof-description"
                        rows={5}
                        placeholder={t('quest.Describe how you completed your quest...')}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        value={newProof}
                        onChange={(e) => setNewProof(e.target.value)}
                        required
                      />
                    </div>
                    
                    <MediaUpload 
                      onMediaChange={files => setMediaFiles(files)}
                    />
                    
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-full"
                      isLoading={isSubmitting}
                    >
                      <Send size={16} className="mr-2" />
                      {t('quest.Submit Proof')}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {!isDraftQuest && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t('quest.Submitted Proofs')}</h2>
              {!isLoggedIn && (
                <Link to="/connect" className="text-primary font-medium hover:underline flex items-center">
                  <User size={16} className="mr-1.5" />
                  {t('quest.Connect to earn rewards')}
                </Link>
              )}
            </div>
            
            <div className="grid gap-6">
              {proofs.map((proof) => (
                <div key={proof.id} id={`proof-${proof.id}`}>
                  <ProofCard
                    proof={proof}
                    questTitle={questData.title}
                    questDescription={questData.description}
                    questLockedAmount={getLockedAmount(questData)}
                    questRewardAmount={getQuestRewardAmount(questData)}
                    questStatus={questData.status}
                  />
                </div>
              ))}
              
              {proofs.length === 0 && (
                <div className="glass rounded-2xl p-8 text-center">
                  <p className="text-muted-foreground">{t('quest.No proofs have been submitted yet')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {isLoggedIn && !isDraftQuest && (
        <ZapModal
          open={zapModalOpen}
          onOpenChange={setZapModalOpen}
          questTitle={questData.title}
          questId={questData.id}
          onZapComplete={handleZapComplete}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">{t('quest.Details')}</TabsTrigger>
            <TabsTrigger value="escrow">{t('quest.Escrow & Rewards')}</TabsTrigger>
            <TabsTrigger value="proofs">{t('quest.Submitted Proofs')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <div className="mt-8">
              <Threads
                threadId={questData.id}
                comments={threadComments}
                onAddComment={handleAddComment}
              />
            </div>
          </TabsContent>
          
          {!isDraftQuest && (
            <TabsContent value="escrow" className="space-y-4">
              <div className="bg-secondary/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">{t('quest.Escrow Information')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('quest.Creator Locked Amount')}</p>
                    <p className="text-xl font-semibold">{getLockedAmount(questData).toLocaleString() || 0} sats</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('quest.Escrow Status')}</p>
                    <p className="text-xl font-semibold capitalize">{getEscrowStatus(questData) || 'Locked'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('quest.Quest Status')}</p>
                    <p className="text-xl font-semibold capitalize">{getStatusText()}</p>
                  </div>
                  {isInDispute(questData) && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{t('quest.Dispute Status')}</p>
                      <p className="text-xl font-semibold text-orange-500">{t('quest.Under Review')}</p>
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h4 className="text-md font-medium mb-3">{t('quest.Reward Distribution')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('quest.If the proof is accepted, the acceptor will receive a reward from the locked amount. Multiple acceptors will split the reward equally')}
                  </p>
                </div>
              </div>
            </TabsContent>
          )}
          
          {!isDraftQuest && totalZapped > 0 && (
            <TabsContent value="donations" className="space-y-4" id="donations-tab">
              <div className="bg-secondary/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">{t('quest.Donation Information')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={20} className="text-yellow-500" />
                      <span className="text-lg font-semibold">{totalZapped.toLocaleString()} sats</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{t('quest.Total Donated')}</span>
                  </div>
                  <div className="bg-yellow-500/10 p-4 rounded-lg">
                    <p className="text-sm text-yellow-500">
                      {t('quest.This amount will be awarded to the quest owner when the quest is successfully completed.')}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default QuestPage;
