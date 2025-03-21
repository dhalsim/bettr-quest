
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Send, Image, Flag, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProofCard, { Proof } from '@/components/ui/ProofCard';
import { toast } from 'sonner';

// Mock data for a single challenge
const challengeData = {
  id: '1',
  title: '30 Days of Meditation',
  description: 'Meditate for at least 10 minutes every day for 30 days to build a consistent practice. This helps reduce stress, improve focus, and develop mindfulness in daily activities. Track your sessions and note any changes in your mental state throughout the challenge.',
  userId: 'user1',
  username: 'mindfulness_guru',
  createdAt: '2023-04-15T10:30:00Z',
  dueDate: '2023-05-15T10:30:00Z',
  category: 'Wellness',
  status: 'active' as const,
  imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format',
  participants: 24,
  completionRate: 68
};

// Mock data for proofs
const initialProofs: Proof[] = [
  {
    id: 'proof1',
    challengeId: '1',
    userId: 'user2',
    username: 'zen_master',
    createdAt: '2023-04-20T14:15:00Z',
    description: "I've completed the 30 days of meditation challenge! I started with just 5 minutes and built up to 20 minutes daily. My sleep has improved and I feel much calmer throughout the day. Here's my meditation journal as proof.",
    imageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format',
    votes: {
      accept: 12,
      reject: 2
    },
    status: 'accepted'
  },
  {
    id: 'proof2',
    challengeId: '1',
    userId: 'user3',
    username: 'mindful_beginner',
    createdAt: '2023-04-18T09:45:00Z',
    description: 'Just finished my 30 day meditation journey! It was challenging to make time every day, but I managed to do at least 10 minutes even on busy days. My meditation app stats show my streak.',
    imageUrl: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=600&auto=format',
    votes: {
      accept: 8,
      reject: 5
    },
    status: 'pending'
  }
];

const Challenge = () => {
  const { id } = useParams<{ id: string }>();
  const [proofs, setProofs] = useState(initialProofs);
  const [newProof, setNewProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const dueDate = new Date(challengeData.dueDate);
    const today = new Date();
    const differenceInTime = dueDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? differenceInDays : 0;
  };
  
  const daysRemaining = calculateDaysRemaining();
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle proof submission
  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProof.trim()) {
      toast.error("Please describe how you completed the challenge");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      const newProofItem: Proof = {
        id: `proof${Date.now()}`,
        challengeId: challengeData.id,
        userId: 'current-user',
        username: 'you',
        createdAt: new Date().toISOString(),
        description: newProof,
        imageUrl: previewUrl || undefined,
        votes: {
          accept: 0,
          reject: 0
        },
        status: 'pending'
      };
      
      setProofs([newProofItem, ...proofs]);
      setNewProof('');
      setSelectedImage(null);
      setPreviewUrl(null);
      setIsSubmitting(false);
      
      toast.success("Your proof has been submitted successfully!");
    }, 1500);
  };
  
  // Report challenge
  const reportChallenge = () => {
    toast.success("Thank you for your report. Our moderators will review this challenge.");
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Explore
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Challenge Details */}
            <div className="flex-grow lg:w-2/3">
              <div className="glass rounded-2xl overflow-hidden">
                {challengeData.imageUrl && (
                  <div className="h-72 md:h-96 w-full">
                    <img 
                      src={challengeData.imageUrl} 
                      alt={challengeData.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Tag size={12} />
                      {challengeData.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      <User size={12} />
                      {challengeData.participants} Participants
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                      <Check size={12} />
                      {challengeData.completionRate}% Completion Rate
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{challengeData.title}</h1>
                  
                  <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      Created by {' '}
                      <Link to={`/profile/${challengeData.username}`} className="text-primary hover:underline">
                        {challengeData.username}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      Created on {formatDate(challengeData.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {daysRemaining > 0 
                        ? `${daysRemaining} days remaining` 
                        : 'Challenge ended'}
                    </div>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-foreground">{challengeData.description}</p>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between">
                    <Button 
                      variant="primary"
                      rightIcon={<ArrowDown size={16} />}
                      onClick={() => document.getElementById('submit-proof')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Submit Your Proof
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<Flag size={16} />}
                      onClick={reportChallenge}
                    >
                      Report Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Proof Form */}
            <div className="lg:w-1/3" id="submit-proof">
              <div className="glass rounded-2xl p-6 sticky top-32">
                <h2 className="text-xl font-semibold mb-4">Submit Your Proof</h2>
                <form onSubmit={handleSubmitProof}>
                  <div className="mb-4">
                    <label htmlFor="proof-description" className="block text-sm font-medium mb-1">
                      How did you complete this challenge?
                    </label>
                    <textarea
                      id="proof-description"
                      rows={5}
                      placeholder="Describe your journey and how you completed the challenge..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      value={newProof}
                      onChange={(e) => setNewProof(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                      Add Photo (Optional)
                    </label>
                    <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => document.getElementById('proof-image')?.click()}
                    >
                      <input
                        type="file"
                        id="proof-image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      
                      {previewUrl ? (
                        <div className="relative w-full">
                          <img 
                            src={previewUrl} 
                            alt="Proof Preview" 
                            className="w-full h-48 object-cover rounded-md" 
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(null);
                              setPreviewUrl(null);
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Image className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload an image
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full"
                    leftIcon={<Send size={16} />}
                    isLoading={isSubmitting}
                  >
                    Submit Proof
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Proofs Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            Community Proofs ({proofs.length})
          </h2>
          
          {proofs.length > 0 ? (
            <div className="space-y-8">
              {proofs.map(proof => (
                <ProofCard key={proof.id} proof={proof} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl">
              <h3 className="text-xl font-medium mb-2">No proofs submitted yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to complete this challenge and submit your proof!
              </p>
              <Button 
                variant="primary"
                onClick={() => document.getElementById('submit-proof')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Submit Your Proof
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Check = ({ size = 24, ...props }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowDown = ({ size = 24, ...props }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

export default Challenge;
