import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Send, Flag, Check, ArrowDown, Copy, CircleCheck, CircleX, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProofCard, { Proof } from '@/components/ui/ProofCard';
import { toast } from 'sonner';
import MediaUpload from '@/components/quest/MediaUpload';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ZapModal from '@/components/quest/ZapModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { LockedQuest, SavedQuest } from '@/types/quest';
import { mockQuests, mockProofs } from '@/mock/data';

const QuestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isLoggedIn } = useNostrAuth();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [questData, setQuestData] = useState<LockedQuest | SavedQuest | null>(null);
  const [newProof, setNewProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [zapModalOpen, setZapModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateDaysRemaining = () => {
    const dueDate = new Date(questData.dueDate);
    const today = new Date();
    const differenceInTime = dueDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? differenceInDays : 0;
  };
  
  const daysRemaining = calculateDaysRemaining();

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
      return 'On Review';
    } else if (status === 'success') {
      return 'Success';
    } else if (status === 'failed') {
      return 'Failed';
    } else if (status === 'in_dispute') {
      return 'In Dispute';
    } else {
      return 'Saved';
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
  
  const handleCategoryClick = () => {
    navigate(`/explore?category=${questData.category}`);
  };
  
  const handleCopyQuest = () => {
    const params = new URLSearchParams({
      title: questData.title,
      description: questData.description,
      category: questData.category,
      imageUrl: questData.imageUrl || ''
    });
    
    navigate(`/create?${params.toString()}`);
    toast.success("Quest details copied! Customize your new quest.");
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
  
  // Helper function to check if quest is locked
  const isLockedQuest = (quest: LockedQuest | SavedQuest): quest is LockedQuest => {
    return 'lockedAmount' in quest && 'rewardAmount' in quest && 'escrowStatus' in quest;
  };

  // Helper function to get quest reward amount
  const getQuestRewardAmount = (quest: LockedQuest | SavedQuest): number => {
    return isLockedQuest(quest) ? quest.rewardAmount : 0;
  };

  // Helper function to get locked amount
  const getLockedAmount = (quest: LockedQuest | SavedQuest): number => {
    return isLockedQuest(quest) ? quest.lockedAmount : 0;
  };

  // Helper function to get escrow status
  const getEscrowStatus = (quest: LockedQuest | SavedQuest): 'locked' | 'distributed' | 'in_process' | undefined => {
    return isLockedQuest(quest) ? quest.escrowStatus : undefined;
  };

  // Helper function to check if quest is in dispute
  const isInDispute = (quest: LockedQuest | SavedQuest): boolean => {
    return isLockedQuest(quest) ? quest.inDispute || false : false;
  };

  // Helper function to get total zapped amount
  const getTotalZapped = (quest: LockedQuest | SavedQuest): number => {
    return isLockedQuest(quest) ? quest.totalZapped : 0;
  };

  // Calculate rewards
  const verificationReward = questData ? getQuestRewardAmount(questData) : 0;
  const contestReward = questData ? getLockedAmount(questData) : 0;
  const totalZapped = questData ? getTotalZapped(questData) : 0;
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Explore
          </Link>
          
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
                    <span 
                      onClick={handleCategoryClick}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      <Tag size={12} />
                      {questData.category}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
                      <Check size={12} />
                      {getStatusText()}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      <User size={12} />
                      {questData.visibility === 'public' ? 'Public' : 'Private'} Quest
                    </span>
                    
                    {totalZapped > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                        <Zap size={12} />
                        {totalZapped.toLocaleString()} sats
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">
                    {questData.title}
                  </h1>
                  
                  {isLoggedIn && isQuestActive && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {!isQuestCreator && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setZapModalOpen(true)}
                          className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
                        >
                          <Zap size={16} className="mr-1" />
                          Zap ⚡️
                        </Button>
                      )}
                      
                      {profile && !isQuestCreator && (
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={handleCopyQuest}
                        >
                          <Copy size={16} className="mr-2" />
                          Copy Quest
                        </Button>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      Created by {' '}
                      <Link to={`/profile/${questData.username}`} className="text-primary hover:underline">
                        {questData.username}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      Created on {formatDate(questData.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {daysRemaining > 0 
                        ? `${daysRemaining} days remaining` 
                        : 'Due date passed'}
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-1">Quest Rewards</h3>
                        <p className="text-sm text-muted-foreground">Locked amount: <span className="font-semibold text-foreground">{getLockedAmount(questData).toLocaleString() || 0} sats</span></p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="bg-green-500/10 text-green-500 px-3 py-2 rounded-md text-sm">
                          <div className="font-medium">Verification Reward</div>
                          <div className="font-bold">{verificationReward.toLocaleString()} sats</div>
                        </div>
                        <div className="bg-red-500/10 text-red-500 px-3 py-2 rounded-md text-sm">
                          <div className="font-medium">Contest Reward</div>
                          <div className="font-bold">{contestReward.toLocaleString()} sats</div>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Learn how rewards work</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>How Quest Rewards Work</DialogTitle>
                            <DialogDescription>
                              <div className="mt-4 space-y-4">
                                <div>
                                  <h4 className="font-medium mb-1 flex items-center gap-2 text-green-500">
                                    <CircleCheck size={16} /> Verification Reward
                                  </h4>
                                  <p className="text-sm">
                                    Verifying legitimate proofs earns you {verificationReward.toLocaleString()} sats. 
                                    If multiple users verify, the reward is split equally.
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-1 flex items-center gap-2 text-red-500">
                                    <CircleX size={16} /> Contest Reward
                                  </h4>
                                  <p className="text-sm">
                                    Successfully contesting a fraudulent proof earns you the entire locked amount ({contestReward.toLocaleString()} sats). 
                                    Make sure you have evidence before contesting! If multiple users contest, the amount will be split equally. 
                                  </p>
                                </div>
                                
                                <div className="pt-2 border-t border-border">
                                  <p className="text-sm font-medium">The quest creator has locked {getLockedAmount(questData).toLocaleString() || 0} sats to ensure accountability.</p>
                                </div>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="details" onValueChange={setActiveTab} className="mt-6">
                    <TabsList className="mb-6">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="escrow">Escrow & Rewards</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
                      <div className="prose prose-slate max-w-none">
                        <p className="text-foreground">{questData.description}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="escrow" className="space-y-4">
                      <div className="bg-secondary/20 p-6 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Escrow Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Creator Locked Amount</p>
                            <p className="text-xl font-semibold">{getLockedAmount(questData).toLocaleString() || 0} sats</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Escrow Status</p>
                            <p className="text-xl font-semibold capitalize">{getEscrowStatus(questData) || 'Locked'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Quest Status</p>
                            <p className="text-xl font-semibold capitalize">{getStatusText()}</p>
                          </div>
                          {isInDispute(questData) && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Dispute Status</p>
                              <p className="text-xl font-semibold text-orange-500">Under Review</p>
                            </div>
                          )}
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div>
                          <h4 className="text-md font-medium mb-3">Reward Distribution</h4>
                          <p className="text-sm text-muted-foreground">
                            If the proof is accepted, the acceptor will receive a reward from the locked amount. 
                            Multiple acceptors will split the reward equally.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-8 flex items-center justify-between">
                    {isQuestCreator && (
                      <Button 
                        variant="primary"
                        onClick={() => document.getElementById('submit-proof')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Submit Your Proof
                        <ArrowDown size={16} className="ml-2" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={reportQuest}
                      className={isQuestCreator ? "" : "ml-auto"}
                    >
                      <Flag size={16} className="mr-2" />
                      Report Quest
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {isQuestCreator && (
              <div className="lg:w-1/3" id="submit-proof">
                <div className="glass rounded-2xl p-6 sticky top-32">
                  <h2 className="text-xl font-semibold mb-4">Submit Your Proof</h2>
                  <form onSubmit={handleSubmitProof}>
                    <div className="mb-4">
                      <label htmlFor="proof-description" className="block text-sm font-medium mb-1">
                        How did you complete this quest?
                      </label>
                      <textarea
                        id="proof-description"
                        rows={5}
                        placeholder="Describe how you completed your quest..."
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
                      Submit Proof
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Submitted Proofs</h2>
            {!isLoggedIn && (
              <Link to="/connect" className="text-primary font-medium hover:underline flex items-center">
                <User size={16} className="mr-1.5" />
                Connect to earn rewards
              </Link>
            )}
          </div>
          
          <div className="grid gap-6">
            {proofs.map((proof) => (
              <ProofCard
                key={proof.id}
                proof={proof}
                questTitle={questData.title}
                questDescription={questData.description}
                questLockedAmount={getLockedAmount(questData)}
                questRewardAmount={getQuestRewardAmount(questData)}
                questStatus={questData.status}
              />
            ))}
            
            {proofs.length === 0 && (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-muted-foreground">No proofs have been submitted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isLoggedIn && (
        <ZapModal
          open={zapModalOpen}
          onOpenChange={setZapModalOpen}
          questTitle={questData.title}
          questId={questData.id}
          onZapComplete={handleZapComplete}
        />
      )}
    </div>
  );
};

export default QuestPage;
