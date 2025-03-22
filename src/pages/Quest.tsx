import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Send, Flag, Check, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProofCard, { Proof } from '@/components/ui/ProofCard';
import { toast } from 'sonner';
import MediaUpload from '@/components/quest/MediaUpload';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the status types for Quest and Proof
type QuestStatus = 'pending' | 'on_review' | 'success' | 'failed' | 'in_dispute';

// Quest data type
interface Quest {
  id: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  createdAt: string;
  dueDate: string;
  category: string;
  status: QuestStatus;
  imageUrl: string;
  participants: number;
  completionRate: number | null;
  visibility: 'public' | 'private';
  lockedAmount?: number; // Amount of sats locked by creator
  inDispute?: boolean;
  escrowStatus?: 'locked' | 'distributed' | 'in_process';
}

// Mock quests with different scenarios
const mockQuests: Record<string, Quest> = {
  "1": {
    id: '1',
    title: 'Meditate for 20 minutes tomorrow',
    description: 'I want to begin my meditation practice by dedicating 20 minutes tomorrow to mindful meditation. This will help me reduce stress and improve focus.',
    userId: 'user1',
    username: 'mindfulness_guru',
    createdAt: '2023-04-15T10:30:00Z',
    dueDate: '2023-04-16T10:30:00Z',
    category: 'Wellness',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format',
    participants: 1,
    completionRate: null,
    visibility: 'public',
    lockedAmount: 1000, // Example: 1000 sats locked
    escrowStatus: 'locked'
  },
  "2": {
    id: '2',
    title: 'Learn 5 phrases in Italian',
    description: 'I will learn and memorize 5 useful Italian phrases for my upcoming trip to Rome. This will help me navigate and connect with locals better.',
    userId: 'user2',
    username: 'polyglot_learner',
    createdAt: '2023-04-08T14:20:00Z',
    dueDate: '2023-04-12T14:20:00Z',
    category: 'Learning',
    status: 'on_review',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format',
    participants: 3,
    completionRate: 75,
    visibility: 'public',
    lockedAmount: 2000,
    escrowStatus: 'locked'
  },
  "3": {
    id: '3',
    title: 'Run 5km in under 30 minutes',
    description: 'I want to improve my running pace and complete a 5km run in under 30 minutes. This will be a personal record for me.',
    userId: 'user3',
    username: 'runner_joe',
    createdAt: '2023-04-10T09:15:00Z',
    dueDate: '2023-04-20T09:15:00Z',
    category: 'Fitness',
    status: 'success',
    imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format',
    participants: 5,
    completionRate: 100,
    visibility: 'public',
    lockedAmount: 3000,
    escrowStatus: 'distributed'
  },
  "4": {
    id: '4',
    title: 'Write a short story in one day',
    description: "Challenge myself to write a 1000-word short story in a single day to boost creativity and overcome writer's block.",
    userId: 'user4',
    username: 'storyteller',
    createdAt: '2023-04-12T16:45:00Z',
    dueDate: '2023-04-13T16:45:00Z',
    category: 'Creativity',
    status: 'failed',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format',
    participants: 1,
    completionRate: 0,
    visibility: 'public',
    lockedAmount: 1500,
    escrowStatus: 'distributed'
  },
  "5": {
    id: '5',
    title: 'Complete a challenging coding problem',
    description: 'I will solve a difficult algorithm problem from LeetCode to improve my problem-solving skills.',
    userId: 'user5',
    username: 'code_ninja',
    createdAt: '2023-04-14T11:30:00Z',
    dueDate: '2023-04-18T11:30:00Z',
    category: 'Technology',
    status: 'in_dispute',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format',
    participants: 2,
    completionRate: null,
    visibility: 'public',
    lockedAmount: 5000,
    escrowStatus: 'in_process',
    inDispute: true
  }
};

// Mock proofs for each quest
const mockProofs: Record<string, Proof[]> = {
  "1": [
    {
      id: 'proof1_1',
      challengeId: '1',
      userId: 'user1',
      username: 'mindfulness_guru',
      createdAt: '2023-04-16T14:15:00Z',
      description: "I completed my 20-minute meditation session this morning. I used the Headspace app and focused on breathing exercises. I feel much calmer and ready for the day.",
      imageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format',
      votes: {
        accept: 1,
        reject: 0
      },
      status: 'accepted'
    }
  ],
  "2": [
    {
      id: 'proof2_1',
      challengeId: '2',
      userId: 'user2',
      username: 'polyglot_learner',
      createdAt: '2023-04-12T10:30:00Z',
      description: "I've learned these 5 Italian phrases: 'Buongiorno' (Good morning), 'Grazie' (Thank you), 'Per favore' (Please), 'Mi scusi' (Excuse me), and 'Dov'è il bagno?' (Where is the bathroom?). I practiced with an Italian friend who confirmed my pronunciation.",
      imageUrl: 'https://images.unsplash.com/photo-1530538095376-a4936b5c6c4b?q=80&w=600&auto=format',
      votes: {
        accept: 2,
        reject: 1
      },
      status: 'pending'
    }
  ],
  "3": [
    {
      id: 'proof3_1',
      challengeId: '3',
      userId: 'user3',
      username: 'runner_joe',
      createdAt: '2023-04-18T08:45:00Z',
      description: "I did it! Completed my 5km run in 28:42. I've attached a screenshot from my running app showing the time and distance. The weather was perfect this morning, which helped a lot.",
      imageUrl: 'https://images.unsplash.com/photo-1560073562-f36a05efa160?q=80&w=600&auto=format',
      votes: {
        accept: 5,
        reject: 0
      },
      status: 'accepted'
    }
  ],
  "4": [
    {
      id: 'proof4_1',
      challengeId: '4',
      userId: 'user4',
      username: 'storyteller',
      createdAt: '2023-04-13T23:50:00Z',
      description: "I tried my best but only managed to write 600 words. I got stuck halfway through and couldn't finish the story in time. I'll try again with a smaller goal next time.",
      imageUrl: null,
      votes: {
        accept: 0,
        reject: 3
      },
      status: 'rejected'
    }
  ],
  "5": [
    {
      id: 'proof5_1',
      challengeId: '5',
      userId: 'user5',
      username: 'code_ninja',
      createdAt: '2023-04-17T16:20:00Z',
      description: "I solved the 'Merge K Sorted Lists' problem with an optimized approach using a priority queue. My solution has O(n log k) time complexity. I've attached a screenshot of my accepted solution and runtime stats.",
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format',
      votes: {
        accept: 1,
        reject: 1
      },
      status: 'in_dispute'
    }
  ]
};

const QuestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useNostrAuth();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [questData, setQuestData] = useState<Quest | null>(null);
  const [newProof, setNewProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // Media states handled by MediaUpload component
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
  
  // Load quest data based on id
  useEffect(() => {
    if (id && mockQuests[id]) {
      setQuestData(mockQuests[id]);
      setProofs(mockProofs[id] || []);
    } else {
      // Default to the first quest if id doesn't exist
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
    if (status === 'pending') {
      return 'bg-blue-500/10 text-blue-500';
    } else if (status === 'on_review') {
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
    if (status === 'pending') {
      return 'Pending';
    } else if (status === 'on_review') {
      return 'On Review';
    } else if (status === 'success') {
      return 'Success';
    } else if (status === 'failed') {
      return 'Failed';
    } else if (status === 'in_dispute') {
      return 'In Dispute';
    } else {
      return 'Pending';
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
        createdAt: new Date().toISOString(),
        description: newProof,
        imageUrl: mediaFiles.image ? URL.createObjectURL(mediaFiles.image) : undefined,
        votes: {
          accept: 0,
          reject: 0
        },
        status: 'pending'
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
  
  // Check if current user is the quest creator
  const isQuestCreator = profile?.username === questData.username;
  
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
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{questData.title}</h1>
                  
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
                            <p className="text-xl font-semibold">{questData.lockedAmount?.toLocaleString() || 0} sats</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Escrow Status</p>
                            <p className="text-xl font-semibold capitalize">{questData.escrowStatus || 'Locked'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Quest Status</p>
                            <p className="text-xl font-semibold capitalize">{getStatusText()}</p>
                          </div>
                          {questData.inDispute && (
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
                    
                    {/* Media Upload Section */}
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
          <h2 className="text-2xl font-bold mb-6">Submitted Proofs</h2>
          <div className="grid gap-6">
            {proofs.map((proof) => (
              <ProofCard key={proof.id} proof={proof} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestPage;
