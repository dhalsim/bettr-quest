import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import QuestEscrow from '@/components/quest/QuestEscrow';
import { decodeLocationState, type LocationState } from './validation';
import { validateLocationState } from '@/lib/validation-utils';
import { pages } from '@/lib/pages';

const EscrowDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [state, setState] = useState<LocationState | null>(null);
  
  useEffect(() => {
    if (location.state) {
      const validatedState = validateLocationState(decodeLocationState, location.state, {
        toast,
        navigate,
        log: true,
        navigateOnError: pages.explore.location
      });
      
      if (validatedState) {
        setState(validatedState);
      }
    } else {
      navigate(pages.explore.location);
    }
  }, [location, navigate, toast]);
  
  // Guard against null state during initial render or after refresh
  if (!state) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{t('escrow.Loading')}</h1>
        </div>
      </div>
    );
  }
  
  const getQuestLink = () => {
    return `/quest/${state.questId}`;
  };
  
  const handleConfirmDeposit = () => {
    // TODO: Implement deposit logic
    // For now, just navigate back to the quest page
    navigate(getQuestLink());
    
    // Show a toast based on the type of deposit
    if (state.type === 'proof-verify') {
      toast({
        title: t('escrow.Verification Submitted'),
        description: t('escrow.Verification Submitted Description'),
        variant: "default",
      });
    } else if (state.type === 'proof-contest') {
      toast({
        title: t('escrow.Contest Submitted'),
        description: t('escrow.Contest Submitted Description'),
        variant: "default",
      });
    } else if (state.type === 'quest') {
      toast({
        title: t('escrow.Quest Created'),
        description: t('escrow.Quest Created Description'),
        variant: "default",
      });
    }
  };

  const handleSkipForNow = () => {
    // TODO: Implement skip logic
    navigate(getQuestLink());
    
    toast({
      title: t('escrow.Quest Saved'),
      description: t('escrow.Your quest has been created and your sats have been locked'),
      variant: "default",
    });
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {state.type === 'quest' 
              ? t('escrow.Lock sats to publish your quest')
              : state.type === 'proof-verify'
                ? t('escrow.Lock sats to verify this proof')
                : t('escrow.Lock sats to contest this proof')
            }
          </h1>
          <p className="text-muted-foreground">
            {state.type === 'quest'
              ? t('escrow.Lock some sats to publish your quest. This ensures accountability and helps the community validate your achievements')
              : state.type === 'proof-verify'
                ? t('escrow.Lock some sats to verify this proof. You\'ll earn rewards if your verification is correct')
                : t('escrow.Lock some sats to contest this proof. You\'ll receive the full locked amount if your contest is validated')
            }
          </p>
        </div>

        <QuestEscrow
          type={state.type}
          questTitle={state.questTitle}
          questDescription={state.questDescription}
          questId={state.questId}
          questRewardAmount={state.questRewardAmount}
          questLockedAmount={state.questLockedAmount}
          {...(state.type !== 'quest' ? {
            proofTitle: state.proofTitle,
            proofDescription: state.proofDescription,
            proofId: state.proofId
          } : {})}
          onConfirm={handleConfirmDeposit}
          onSkip={state.type === 'quest' ? handleSkipForNow : undefined}
        />
      </div>
    </div>
  );
};

export default EscrowDeposit; 