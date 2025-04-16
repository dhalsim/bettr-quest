import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
import { Globe, Lock } from 'lucide-react';

interface VisibilitySelectorProps {
  visibility: 'public' | 'private' | null;
  onVisibilityChange: (value: 'public' | 'private' | null) => void;
}

const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
  visibility,
  onVisibilityChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('create-quest.visibility.Choose Quest Visibility')}</h2>
        <p className="text-muted-foreground">{t('create-quest.visibility.Select if your quest will be public or private')}</p>
      </div>

      <RadioGroup
        value={visibility}
        onValueChange={onVisibilityChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex">
          <RadioGroupItem
            value="public"
            id="public"
            className="peer sr-only"
          />
          <Label
            htmlFor="public"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
              "cursor-pointer flex-1"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-6 w-6" />
              <h3 className="font-semibold">{t('create-quest.visibility.public.Public')}</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('create-quest.visibility.public.Anyone can view and verify your quest')}
            </p>
          </Label>
        </div>

        <div className="flex">
          <RadioGroupItem
            value="private"
            id="private"
            className="peer sr-only"
          />
          <Label
            htmlFor="private"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
              "cursor-pointer flex-1"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-6 w-6" />
              <h3 className="font-semibold">{t('create-quest.visibility.private.Private')}</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('create-quest.visibility.private.Only you can view your quest')}
            </p>
          </Label>
        </div>
      </RadioGroup>

      {visibility && (
        <div className="mt-8 p-6 rounded-lg bg-muted">
          <h3 className="text-lg font-semibold mb-4">
            {visibility === 'public' 
              ? t('create-quest.visibility.public.How proof verification works on public quests')
              : t('create-quest.visibility.private.How proof verification works on private quests')}
          </h3>
          <p className="text-muted-foreground">
            {visibility === 'public'
              ? t('create-quest.visibility.public.The bettr.quest community will review your quest proof and validate. You would need to set some rewards in order to motivate the community for reviewing your proof.')
              : t('create-quest.visibility.private.Our AI service will validate your proof. You would need to pay for the fee (1,000 sats)')}
          </p>
        </div>
      )}
    </div>
  );
};

export default VisibilitySelector; 