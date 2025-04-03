import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import QuestTemplateSelector from '@/components/quest/QuestTemplateSelector';
import TagsInput from '@/components/quest/TagsInput';
import MediaUpload from '@/components/quest/MediaUpload';
import DateSelector from '@/components/quest/DateSelector';
import QuestCreationSteps from '@/components/quest/QuestCreationSteps';
import VisibilitySelector from '@/components/quest/VisibilitySelector';
import QuestEscrow from '@/components/quest/QuestEscrow';
import { QuestLocationState } from './escrow-deposit/validation';
import { mockQuests, questTemplates } from '@/mock/data';
import { useTranslation } from 'react-i18next';
import CoachDirectory from '@/components/quest/CoachDirectory';
import { mockCoaches } from '@/mock/data';
import { pages } from '@/lib/pages';

const CreateQuest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Parse query parameters for prefilled data
  const queryParams = new URLSearchParams(location.search);
  const prefilledTitle = queryParams.get('title') || '';
  const prefilledDescription = queryParams.get('description') || '';
  const prefilledTags = queryParams.get('tags') || '';
  const prefilledImageUrl = queryParams.get('imageUrl') || '';
  
  // Form states
  const [title, setTitle] = useState(prefilledTitle);
  const [description, setDescription] = useState(prefilledDescription);
  const [visibility, setVisibility] = useState('');
  const [proofChallenger, setProofChallenger] = useState('');
  const [tags, setTags] = useState<string[]>(prefilledTags ? prefilledTags.split(',') : []);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    {
      title: t('create-quest.steps.basic.title'),
      description: t('create-quest.steps.basic.description'),
      isCompleted: currentStep > 1,
      isActive: currentStep === 1
    },
    {
      title: t('create-quest.steps.visibility.title'),
      description: t('create-quest.steps.visibility.description'),
      isCompleted: currentStep > 2,
      isActive: currentStep === 2
    },
    {
      title: t('create-quest.steps.escrow.title'),
      description: t('create-quest.steps.escrow.description'),
      isCompleted: currentStep > 3,
      isActive: currentStep === 3
    }
  ];
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  
  // Update page title
  useEffect(() => {
    if (prefilledTitle) {
      document.title = `${t('create-quest.Creating a Copy of Quest')}`;
    } else {
      document.title = `${t('create-quest.Creating a Quest for myself')}`;
    }
  }, [prefilledTitle, t]);
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = questTemplates.find(t => t.id === templateId);
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

    if (currentStep === 1) {
      if (!title.trim()) {
        toast.error(t('create-quest.toast.Please enter a quest title'));
        return;
      }
      if (!description.trim()) {
        toast.error(t('create-quest.toast.Please enter a quest description'));
        return;
      }
      if (!dueDate) {
        toast.error(t('create-quest.toast.Please enter a quest due date'));
        return;
      }

      toast.success(t('create-quest.toast.Your quest is saved as a draft.'));
    } else if (currentStep === 2) {
      if (!visibility) {
        toast.error(t('create-quest.toast.Please select quest visibility'));
        return;
      }
      if (!proofChallenger) {
        toast.error(t('create-quest.toast.Please select who can verify your proof'));
        return;
      }
      if (proofChallenger === 'coach' && !selectedCoachId) {
        toast.error(t('create-quest.toast.Please select a coach'));
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t('create-quest.toast.Quest created! Please set up the escrow deposit.'));

      // TODO: Add quest ID
      const questIndex = Math.floor(Math.random() * Object.keys(mockQuests).length);
      const questId = Object.keys(mockQuests)[questIndex];
      
      navigate(`${pages.quest.location}/${questId}`);
    }, 200);
  };

  const [selectedCoachId, setSelectedCoachId] = useState<string | undefined>();

  const handleCoachSelect = (coachId: string) => {
    // If clicking the same coach, deselect it
    if (selectedCoachId === coachId) {
      setSelectedCoachId(undefined);
      return;
    }

    setSelectedCoachId(coachId);
    // You can also store additional coach information if needed
    const selectedCoach = mockCoaches.find(coach => coach.id === coachId);
    
    if (selectedCoach) {
      // Handle the selected coach data
      console.log('Selected coach:', selectedCoach);
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          {t('create-quest.Back to Explore')}
        </Link>
        
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-8 text-center">
              {
                title 
                  ? t('create-quest.New Quest') + ': ' + title 
                  : prefilledTitle 
                    ? t('create-quest.Creating a Copy of Quest') 
                    : t('create-quest.Creating a Quest for myself')
              }
            </h1>

            <QuestCreationSteps steps={steps} />
            
            <div>
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Template Selection - only show if not from copied quest */}
                  {!prefilledTitle && <QuestTemplateSelector onSelectTemplate={applyTemplate} />}
                  
                  {/* Quest Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      {t('create-quest.form.title')}
                    </label>
                    <Input
                      type="text"
                      id="title"
                      placeholder={t('create-quest.form.title-placeholder')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Quest Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      {t('create-quest.form.description')}
                    </label>
                    <Textarea
                      id="description"
                      rows={5}
                      placeholder={t('create-quest.form.description-placeholder')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Tags */}
                  <TagsInput tags={tags} setTags={setTags} />
                  
                  {/* Due Date */}
                  <DateSelector dueDate={dueDate} setDueDate={setDueDate} />
                  
                  {/* Media Section */}
                  <MediaUpload 
                    onMediaChange={files => setMediaFiles(files)}
                    previewUrl={prefilledImageUrl}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <VisibilitySelector
                    visibility={visibility}
                    onVisibilityChange={setVisibility}
                    proofChallenger={proofChallenger}
                    onProofChallengerChange={setProofChallenger}
                  />
                  
                  {proofChallenger === 'coach' && (
                    <CoachDirectory
                      onSelectCoach={handleCoachSelect}
                      selectedCoachId={selectedCoachId}
                      questTags={tags}
                    />
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <QuestEscrow
                  type="quest"
                  questTitle={title}
                  questDescription={description}
                  questId="random-id"
                  questRewardAmount={lockAmount}
                  questLockedAmount={lockAmount + (isPremium ? 0 : platformFee)}
                  onConfirm={handleSubmit}
                />
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep === 1 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto"
                  >
                    {t('create-quest.navigation.next')}
                  </Button>
                )}

                {currentStep === 2 && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      {t('create-quest.navigation.back')}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto"
                      disabled={visibility === '' || proofChallenger === '' || (proofChallenger === 'coach' && !selectedCoachId)}
                    >
                      {t('create-quest.navigation.next')}
                    </Button>
                  </>
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
