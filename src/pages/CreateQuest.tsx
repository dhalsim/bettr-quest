
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import QuestTemplateSelector, { questTemplates } from '@/components/quest/QuestTemplateSelector';
import TagsInput from '@/components/quest/TagsInput';
import MediaUpload from '@/components/quest/MediaUpload';
import DateSelector from '@/components/quest/DateSelector';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters for prefilled data
  const queryParams = new URLSearchParams(location.search);
  const prefilledTitle = queryParams.get('title') || '';
  const prefilledDescription = queryParams.get('description') || '';
  const prefilledCategory = queryParams.get('category') || '';
  const prefilledImageUrl = queryParams.get('imageUrl') || '';
  
  const [title, setTitle] = useState(prefilledTitle);
  const [description, setDescription] = useState(prefilledDescription);
  const [visibility, setVisibility] = useState('public');
  const [proofMethod, setProofMethod] = useState('');
  const [tags, setTags] = useState<string[]>(prefilledCategory ? [prefilledCategory] : []);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofChallenger, setProofChallenger] = useState('anyone'); // Default to 'anyone' for public
  const [validationError, setValidationError] = useState<string | null>(null);
  
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
  
  // Update page title to reflect creating new or copied quest
  useEffect(() => {
    if (prefilledTitle) {
      document.title = `New Quest (Copied) | Quest Platform`;
    } else {
      document.title = `Create New Quest | Quest Platform`;
    }
    
    return () => {
      document.title = 'Quest Platform';
    };
  }, [prefilledTitle]);
  
  // Update proof challenger when visibility changes
  useEffect(() => {
    if (visibility === 'public') {
      setProofChallenger('anyone');
      setValidationError(null);
    } else {
      setProofChallenger('no-one');
      setValidationError(null);
    }
  }, [visibility]);
  
  // Handle proof challenger change
  const handleProofChallengerChange = (value: string) => {
    // Validate selection based on visibility
    if (visibility === 'public' && (value === 'no-one' || value === 'ai')) {
      setValidationError("This option is only available for private quests");
      // Reset to default for public after a short delay
      setTimeout(() => {
        setProofChallenger('anyone');
        setValidationError(null);
      }, 3000);
      return;
    }
    
    if (visibility === 'private' && value === 'anyone') {
      setValidationError("This option is only available for public quests");
      // Reset to default for private after a short delay
      setTimeout(() => {
        setProofChallenger('no-one');
        setValidationError(null);
      }, 3000);
      return;
    }
    
    // Valid selection
    setProofChallenger(value);
    setValidationError(null);
  };
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = questTemplates.find(t => t.id === templateId);
    if (template) {
      // Adjust template names to be more quest-like (one-time achievements)
      let adjustedName = template.name;
      if (adjustedName.includes('30 Days')) {
        adjustedName = adjustedName.replace('30 Days', 'Today');
      }
      
      setTitle(adjustedName);
      setDescription(template.description);
      setTags(template.suggestedTags);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      toast.error("Please enter a quest title");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Please enter a quest description");
      return;
    }
    
    if (!dueDate) {
      toast.error("Please set a due date for your quest");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Quest created successfully!");
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
            <h1 className="text-2xl font-bold mb-8">
              {prefilledTitle ? "Creating a Copy of Quest" : "Creating a Quest for myself"}
            </h1>
            
            <form onSubmit={handleSubmit}>
              {/* Template Selection - only show if not from copied quest */}
              {!prefilledTitle && <QuestTemplateSelector onSelectTemplate={applyTemplate} />}
              
              {/* Quest Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  placeholder="What is your quest?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              {/* Quest Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe your quest in detail. What do you want to accomplish?"
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
                    <Label htmlFor="private">Private</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* How to prove? - Show for both public and private quests */}
              <div className="mb-6">
                <label htmlFor="proofMethod" className="block text-sm font-medium mb-2">
                  How will you prove completion?
                </label>
                <Textarea
                  id="proofMethod"
                  rows={3}
                  placeholder="I will provide a video showing my completed work"
                  value={proofMethod}
                  onChange={(e) => setProofMethod(e.target.value)}
                />
              </div>
              
              {/* Tags */}
              <TagsInput tags={tags} setTags={setTags} />
              
              {/* Due Date */}
              <DateSelector dueDate={dueDate} setDueDate={setDueDate} />
              
              {/* Who can challenge a proof */}
              <div className="mb-6">
                <div className="block text-sm font-medium mb-2">Who can review your proof</div>
                
                {validationError && (
                  <Alert variant="destructive" className="mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}
                
                <RadioGroup 
                  value={proofChallenger} 
                  onValueChange={handleProofChallengerChange}
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-one" id="no-one" />
                    <Label htmlFor="no-one">No one (only private)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anyone" id="anyone" />
                    <Label htmlFor="anyone">Anyone (only public)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coach" id="coach" />
                    <Label htmlFor="coach">Find a coach</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ai" id="ai" />
                    <Label htmlFor="ai">AI (only private)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Media Section */}
              <MediaUpload 
                onMediaChange={files => setMediaFiles(files)}
                previewUrl={prefilledImageUrl}
              />
              
              {/* Submit Button */}
              <div className="flex justify-start">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Quest...
                    </>
                  ) : 'Save & Preview'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuest;
