import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import QuestTemplateSelector from '@/components/quest/QuestTemplateSelector';
import TagsInput from '@/components/quest/TagsInput';
import MediaUpload from '@/components/quest/MediaUpload';
import DateSelector from '@/components/quest/DateSelector';
import QuestCreationSteps from '@/components/quest/QuestCreationSteps';
import VisibilitySelector from '@/components/quest/VisibilitySelector';
import QuestEscrow from '@/components/quest/QuestEscrow';
import { pages } from '@/lib/pages';
import { QuestTemplates } from '@/lib/quest-templates';
import { dataFetcher } from '@/lib/fetcher';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import type { DraftQuest, TagItem } from '@/types/quest';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreateQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(null, { keyPrefix: "createQuest" });
  const { profile } = useNostrAuth();
  
  // Get prefilled data from state
  const { prefilledData, step } = location.state || {};
  
  // Form states
  const [title, setTitle] = useState(prefilledData?.title || '');
  const [description, setDescription] = useState(prefilledData?.description || '');
  const [visibility, setVisibility] = useState<'public' | 'private' | null>(prefilledData?.visibility || null);
  const [tags, setTags] = useState<string[]>(prefilledData?.specializations?.map(s => s.name) || []);
  const [dueDate, setDueDate] = useState(prefilledData?.dueDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'basic' | 'visibility' | 'escrow'>(step || 'basic');
  
  // Media states
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

  // Escrow states
  const [lockAmount, setLockAmount] = useState(0);
  const [platformFee] = useState(1000); // Example fee
  const [isPremium] = useState(false); // This should come from user context
  
  // Step navigation
  const steps = [
    {
      id: 'basic',
      title: t('steps.basic.Basic Information'),
      description: t('steps.basic.Enter quest details'),
      isCompleted: currentStep !== 'basic',
      isActive: currentStep === 'basic'
    },
    {
      id: 'visibility',
      title: t('steps.visibility.Choose Quest Visibility'),
      description: t('steps.visibility.Select if your quest will be public or private'),
      isCompleted: currentStep !== 'basic' && currentStep !== 'visibility',
      isActive: currentStep === 'visibility'
    },
    {
      id: 'escrow',
      title: t('steps.escrow.Lock Escrow'),
      description: t('steps.escrow.Set rewards and fees'),
      isCompleted: currentStep === 'escrow',
      isActive: currentStep === 'escrow'
    }
  ];
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  
  // Update page title based on whether we're copying a quest
  useEffect(() => {
    if (prefilledData?.title) {
      document.title = `${t('Creating a Copy of Quest')}`;
    } else {
      document.title = `${t('Creating a Quest for myself')}`;
    }
  }, [prefilledData?.title, t]);

  const getTitle = () => {
    const defaultTitle = prefilledData?.title 
      ? t('Creating a Copy of Quest') 
      : t('Creating a Quest for myself');
    
    const baseTitle = title || defaultTitle;

    if (visibility) {
      const visibilityText = t(`visibility.${visibility}.${visibility.charAt(0).toUpperCase() + visibility.slice(1)}`);
      
      return `${baseTitle} (${visibilityText})`;
    } 
    
    return baseTitle;
  };
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = QuestTemplates.find(t => t.id === templateId);
    if (template) {
      let adjustedName = template.name;
      if (adjustedName.includes('30 Days')) {
        adjustedName = adjustedName.replace('30 Days', 'Today');
      }
      
      setTitle(adjustedName);
      setDescription(template.description);
      setTags(template.suggestedTags);
    }
  };
  
  // Handle step navigation
  const handleNext = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (currentStep === 'basic') {
      if (!title.trim()) {
        toast.error(t('toast.Please enter a quest title'));

        return;
      }
      if (!description.trim()) {
        toast.error(t('toast.Please enter a quest description'));

        return;
      }
      if (!dueDate) {
        toast.error(t('toast.Please enter a quest due date'));

        return;
      }

      toast.success(t('toast.Your quest is saved as a draft.'));
      setCurrentStep('visibility');
    } else if (currentStep === 'visibility') {
      if (!visibility) {
        toast.error(t('toast.Please select quest visibility'));

        return;
      }
      setCurrentStep('escrow');
    }
  };

  const handleBack = () => {
    if (currentStep === 'visibility') {
      setCurrentStep('basic');
    } else if (currentStep === 'escrow') {
      setCurrentStep('visibility');
    }
  };

  const handleSkip = async () => {    
    try {
      const quests = await dataFetcher.getQuests();
      const questIndex = Math.floor(Math.random() * quests.length);
      const questId = quests[questIndex].id;

      toast.success(t('toast.Your quest is saved as draft. Lock funds to publish it.'));

      navigate(`${pages.quest.location}/${questId}`);
    } catch (error) {
      console.error('Failed to get quests:', error);
      toast.error(t('toast.Failed to create quest'));
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newQuest: DraftQuest = {
        id: crypto.randomUUID(),
        title,
        description,
        userId: profile?.pubkey || '',
        username: profile?.username || '',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: 'draft',
        specializations: [{ name: specialization }],
        imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=600&auto=format', // Default image
        visibility: 'public',
        savedAt: new Date().toISOString()
      };

      await dataFetcher.createQuest(newQuest);
      toast.success(t('toast.Quest is published.'));
      navigate('/quests');
    } catch (error) {
      console.error('Failed to create quest:', error);
      setError(t('toast.Failed to create quest'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [specialization, setSpecialization] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        const specs = await dataFetcher.getSpecializations();
        setSpecializations(specs);
      } catch (error) {
        console.error('Failed to load specializations:', error);
        setError(t('Failed to load specializations'));
      }
    };

    loadSpecializations();
  }, [t]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          {t('Back to Explore')}
        </Link>
        
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-8 text-center">
              {getTitle()}
            </h1>

            <QuestCreationSteps steps={steps} />
            
            <div>
              {currentStep === 'basic' && (
                <div className="space-y-6">
                  {/* Template Selection - only show if not from copied quest */}
                  {!prefilledData?.title && <QuestTemplateSelector onSelectTemplate={applyTemplate} />}
                  
                  {/* Quest Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      {t('form.Quest Title')}
                    </label>
                    <Input
                      type="text"
                      id="title"
                      placeholder={t('form.What is your quest?')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Quest Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      {t('form.Quest Description')}
                    </label>
                    <Textarea
                      id="description"
                      rows={5}
                      placeholder={t('form.Describe your quest in detail. What do you want to achieve?')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Tags */}
                  <TagsInput tags={tags} setTags={setTags} />
                  
                  {/* Due Date */}
                  <DateSelector 
                    dueDate={dueDate} 
                    setDueDate={setDueDate} 
                    label={t('form.Due Date')}
                    placeholder={t('form.Select due date')}
                  />
                  
                  {/* Media Section */}
                  <MediaUpload 
                    onMediaChange={files => setMediaFiles(files)}
                    previewUrl={prefilledData?.imageUrl}
                  />
                </div>
              )}

              {currentStep === 'visibility' && (
                <div className="space-y-8">
                  <VisibilitySelector
                    visibility={visibility}
                    onVisibilityChange={setVisibility}
                  />
                </div>
              )}

              {currentStep === 'escrow' && (
                <QuestEscrow
                  visibility={visibility}
                  questDescription={description}
                  questId="random-id"
                  questRewardAmount={lockAmount}
                  questLockedAmount={lockAmount + (isPremium ? 0 : platformFee)}
                  onConfirm={handleSubmit}
                  onSkip={handleSubmit}
                />
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {(currentStep === 'visibility' || currentStep === 'escrow') && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    >
                      {t('navigation.Back')}
                    </Button>
                )}

                {(currentStep === 'basic' || currentStep === 'visibility') && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto"
                    >
                      {t('navigation.Next')}
                    </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuest;
