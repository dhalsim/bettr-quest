
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ChallengeTemplateSelector, { challengeTemplates } from '@/components/challenge/ChallengeTemplateSelector';
import TagsInput from '@/components/challenge/TagsInput';
import MediaUpload from '@/components/challenge/MediaUpload';
import DateSelector from '@/components/challenge/DateSelector';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const CreateChallenge = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [proofMethod, setProofMethod] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Media states (will be updated by MediaUpload component)
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
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = challengeTemplates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.name);
      setDescription(template.description);
      setTags(template.suggestedTags);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      toast.error("Please enter a challenge title");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Please enter a challenge description");
      return;
    }
    
    if (!dueDate) {
      toast.error("Please set a due date for your challenge");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Challenge created successfully!");
      navigate('/explore');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Explore
        </Link>
        
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-8">Create a Challenge</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Template Selection */}
              <ChallengeTemplateSelector onSelectTemplate={applyTemplate} />
              
              {/* Challenge Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Challenge Title
                </label>
                <Input
                  type="text"
                  id="title"
                  placeholder="What is your challenge?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              {/* Challenge Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe your challenge in detail. What are the rules? How can people complete it?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              {/* Visibility */}
              <div className="mb-6">
                <div className="block text-sm font-medium mb-2">Visibility</div>
                <RadioGroup 
                  value={visibility} 
                  onValueChange={setVisibility}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private (no proofs)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* How to prove? - Only show if visibility is public */}
              {visibility === 'public' && (
                <div className="mb-6">
                  <label htmlFor="proofMethod" className="block text-sm font-medium mb-2">
                    How to prove?
                  </label>
                  <Textarea
                    id="proofMethod"
                    rows={3}
                    placeholder="I will provide a video"
                    value={proofMethod}
                    onChange={(e) => setProofMethod(e.target.value)}
                  />
                </div>
              )}
              
              {/* Tags */}
              <TagsInput tags={tags} setTags={setTags} />
              
              {/* Due Date */}
              <DateSelector dueDate={dueDate} setDueDate={setDueDate} />
              
              {/* Media Section */}
              <MediaUpload 
                onMediaChange={files => setMediaFiles(files)}
              />
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Challenge...
                    </>
                  ) : 'Create Challenge'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
