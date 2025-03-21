
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, Tag, Trash, X, Mic, Play, Image, Video, XCircle, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock templates
const challengeTemplates = [
  { 
    id: 'book', 
    name: 'Finish up a book', 
    description: 'Read an entire book from start to finish. Set a timeline that works for you and track your daily progress.',
    suggestedTags: ['reading', 'learning', 'personal-growth']
  },
  { 
    id: 'run', 
    name: 'Run 3 km', 
    description: 'Challenge yourself to run 3 kilometers within a specific timeframe. Start slow and build up your stamina day by day.',
    suggestedTags: ['fitness', 'running', 'health']
  },
  { 
    id: 'closet', 
    name: 'Organize My Closet', 
    description: 'Declutter and organize your entire closet. Sort items into keep, donate, and discard piles. Document your progress!',
    suggestedTags: ['organization', 'home', 'lifestyle']
  },
  { 
    id: 'business', 
    name: 'Write a business plan', 
    description: 'Create a comprehensive business plan for your idea or startup. Include market analysis, financial projections, and marketing strategy.',
    suggestedTags: ['business', 'entrepreneurship', 'planning']
  },
  { 
    id: 'meditation', 
    name: 'Daily meditation practice', 
    description: 'Build a daily meditation habit. Start with just 5 minutes per day and work your way up to longer sessions.',
    suggestedTags: ['mindfulness', 'wellness', 'mental-health']
  }
];

const CreateChallenge = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Media states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = challengeTemplates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.name);
      setDescription(template.description);
      setTags(template.suggestedTags);
    }
  };
  
  // Handle media file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'image') {
          setImageFile(file);
          setImagePreview(reader.result as string);
        } else {
          setVideoFile(file);
          setVideoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      audioChunks.current = [];
      
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        setIsRecording(false);
      };
      
      recorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check your permissions.");
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      // Stop all audio tracks
      if (mediaRecorder.current.stream) {
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };
  
  const removeAudio = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
  };
  
  // Calculate minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Tag management
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-3">Templates (Optional)</h2>
                <Select onValueChange={applyTemplate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="I want to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
              
              {/* Tags */}
              <div className="mb-6">
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <div 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      <Tag size={14} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-primary/70 hover:text-primary"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <Input
                    id="new-tag"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="w-full"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={addTag}
                    className="ml-2"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Due Date */}
              <div className="mb-6">
                <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Calendar size={16} />
                  </div>
                  <Input
                    type="date"
                    id="dueDate"
                    min={getMinDate()}
                    className="pl-10"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Media Section */}
              <div className="mb-8 space-y-6">
                <h2 className="text-lg font-medium mb-3">Challenge Media</h2>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                      imagePreview ? 'border-primary/50' : 'border-border hover:bg-secondary/50'
                    } cursor-pointer`}
                    onClick={() => document.getElementById('challenge-image')?.click()}
                  >
                    <input
                      type="file"
                      id="challenge-image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'image')}
                    />
                    
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Challenge Preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Image className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload an image for your challenge
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                      videoPreview ? 'border-primary/50' : 'border-border hover:bg-secondary/50'
                    } cursor-pointer`}
                    onClick={() => document.getElementById('challenge-video')?.click()}
                  >
                    <input
                      type="file"
                      id="challenge-video"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'video')}
                    />
                    
                    {videoPreview ? (
                      <div className="relative">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoFile(null);
                            setVideoPreview(null);
                          }}
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Video className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload a video for your challenge
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP4, WebM up to 100MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Audio Recording */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Audio Recording (Optional)
                  </label>
                  
                  {audioURL ? (
                    <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={playAudio}
                        className="h-10 w-10 rounded-full"
                      >
                        <Play size={16} />
                      </Button>
                      <div className="flex-1">
                        <div className="h-2 bg-primary/30 rounded-full">
                          <div className="h-2 w-1/3 bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={removeAudio}
                        className="h-8 w-8 rounded-full"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={toggleRecording}
                      className="w-full h-14 gap-2"
                    >
                      {isRecording ? (
                        <>
                          <span className="animate-pulse h-2 w-2 rounded-full bg-current"></span>
                          Recording... Click to stop
                        </>
                      ) : (
                        <>
                          <Mic size={16} /> Click to record audio
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
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
