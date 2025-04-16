import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import ProofEscrow from '@/components/quest/ProofEscrow';
import { decodeVerifyProofState, type VerifyProofState } from './VerifyProof/validation';
import { validateState } from '@/lib/validation-utils';
import { pages } from '@/lib/pages';

const VerifyProof = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [state, setState] = useState<VerifyProofState | null>(null);
  
  useEffect(() => {
    if (location.state) {
      const validatedState = validateState(decodeVerifyProofState, location.state, {
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
  
  const handleConfirmVerification = () => {
    // TODO: Implement verification logic
    // For now, just navigate back to the quest page
    navigate(`/quest/${state.questId}`);
    
    // Show a toast based on the type of verification
    if (state.type === 'proof-accept') {
      toast({
        title: t('escrow.Verification Submitted'),
        description: t('escrow.Verification Submitted Description'),
        variant: "default",
      });
    } else {
      toast({
        title: t('escrow.Contest Submitted'),
        description: t('escrow.Contest Submitted Description'),
        variant: "default",
      });
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {state.type === 'proof-accept'
              ? t('escrow.Lock sats to verify this proof')
              : t('escrow.Lock sats to contest this proof')
            }
          </h1>
          <p className="text-muted-foreground">
            {state.type === 'proof-accept'
              ? t('escrow.Lock some sats to verify this proof. You\'ll earn rewards if your verification is correct')
              : t('escrow.Lock some sats to contest this proof. You\'ll receive the full locked amount if your contest is validated')
            }
          </p>
        </div>

        <ProofEscrow
          type={state.type}
          questTitle={state.questTitle}
          questDescription={state.questDescription}
          questId={state.questId}
          questRewardAmount={state.questRewardAmount}
          questLockedAmount={state.questLockedAmount}
          proofTitle={state.proofTitle}
          proofDescription={state.proofDescription}
          proofId={state.proofId}
          onConfirm={handleConfirmVerification}
        />
      </div>
    </div>
  );
};

export default VerifyProof; 