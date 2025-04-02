import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
import { Globe, Lock, Users, Sparkles } from 'lucide-react';

interface VisibilitySelectorProps {
  visibility: string;
  onVisibilityChange: (value: string) => void;
  proofChallenger: string;
  onProofChallengerChange: (value: string) => void;
}

const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
  visibility,
  onVisibilityChange,
  proofChallenger,
  onProofChallengerChange,
}) => {
  const { t } = useTranslation();

  // Reset proofChallenger when visibility changes to private
  const handleVisibilityChange = (value: string) => {
    onVisibilityChange(value);
    if (value === 'private') {
      onProofChallengerChange('coach');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('create-quest.visibility.title')}</h2>
        <p className="text-muted-foreground">{t('create-quest.visibility.description')}</p>
      </div>

      <RadioGroup
        value={visibility}
        onValueChange={handleVisibilityChange}
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
              <h3 className="font-semibold">{t('create-quest.visibility.public.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('create-quest.visibility.public.description')}
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
              <h3 className="font-semibold">{t('create-quest.visibility.private.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('create-quest.visibility.private.description')}
            </p>
          </Label>
        </div>
      </RadioGroup>

      {visibility && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">{t('create-quest.visibility.verification.title')}</h3>
          <RadioGroup
            value={proofChallenger}
            onValueChange={onProofChallengerChange}
            className={cn(
              "grid gap-4",
              visibility === 'public' ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {visibility === 'public' && (
              <div className="flex h-full">
                <RadioGroupItem
                  value="anyone"
                  id="anyone"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="anyone"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                    "cursor-pointer flex-1"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    <h3 className="font-semibold">{t('create-quest.visibility.verification.anyone')}</h3>
                  </div>
                </Label>
              </div>
            )}

            <div className="flex h-full">
              <RadioGroupItem
                value="coach"
                id="coach"
                className="peer sr-only"
              />
              <Label
                htmlFor="coach"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                  "cursor-pointer flex-1 text-center"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="font-semibold text-center">{t('create-quest.visibility.verification.coach.title')}</h3>
                </div>
              </Label>
            </div>

            <div className="flex h-full">
              <RadioGroupItem
                value="ai"
                id="ai"
                className="peer sr-only"
              />
              <Label
                htmlFor="ai"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                  "cursor-pointer flex-1"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="font-semibold">{t('create-quest.visibility.verification.ai')}</h3>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default VisibilitySelector; 