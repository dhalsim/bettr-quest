import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';

interface RewardInfoProps {
  type: 'proof-verify' | 'proof-contest';
}

const RewardInfo = ({ type }: RewardInfoProps) => {
  const { t } = useTranslation();
  
  if (!type) return null;
  
  if (type === 'proof-verify') {
    return (
      <Alert className="mb-6 bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          {t('escrow.rewards.rewardInfo.If your verification is correct, you\'ll receive your locked amount + rewards set aside by the quest creator')}
        </AlertDescription>
      </Alert>
    );
  } else if (type === 'proof-contest') {
    return (
      <Alert className="mb-6 bg-red-50 border-red-200">
        <AlertDescription className="text-red-800">
          {t('escrow.rewards.rewardInfo.If your contest is valid, you\'ll receive your locked amount + the entire locked amount of the quest')}
        </AlertDescription>
      </Alert>
    );
  }
};

export default RewardInfo;
