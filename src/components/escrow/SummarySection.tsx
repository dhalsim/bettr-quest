import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ExternalLink, CircleCheckBig } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SummarySectionProps {
  userLockAmount: number;
  communityReward: number;
  aiServiceFee: number;
  platformFees: number;
  isProofVerification: boolean;
  visibility: 'public' | 'private';
  hasPremium?: boolean;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  userLockAmount,
  communityReward,
  aiServiceFee,
  platformFees,
  isProofVerification,
  visibility,
  hasPremium = false
}) => {
  const { t } = useTranslation();

  const getAmountBack = () => {
    if (hasPremium) {
      return userLockAmount - communityReward;
    }
    return userLockAmount - communityReward - aiServiceFee - platformFees;
  };

  const getPremiumAmountBack = () => {
    return userLockAmount - communityReward;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t('escrow.Lock Amount')}</span>
          <span className="font-medium">{userLockAmount} sats</span>
        </div>

        {!hasPremium && (
          <>
            {visibility === 'public' && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('escrow.Community Reward')}</span>
                <span className="font-medium text-red-500">-{communityReward} sats</span>
              </div>
            )}
            {visibility === 'private' && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('escrow.AI Service Fee')}</span>
                <span className="font-medium text-red-500">-{aiServiceFee} sats</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('escrow.Platform Fee')}</span>
              <span className="font-medium text-red-500">-{platformFees} sats</span>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('escrow.What you will get back')}</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t('escrow.If your proof is verified, you will get back')}
            </span>
            <span className="font-medium">{getAmountBack()} sats</span>
          </div>

          {!hasPremium && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="premium-benefits" className="border-none">
                <AccordionTrigger className="py-0 hover:no-underline relative">
                  <div className="flex justify-between items-center w-full bg-purple-500/10">
                    <span className="text-sm text-muted-foreground">
                      {t('escrow.If you are a premium member, you will get back')}
                    </span>
                    <span className="font-medium bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {getPremiumAmountBack()} sats
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-6 bg-muted/50 rounded-lg p-4">
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium">{t('escrow.Only 10,000 sats for 30 days')}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {t('escrow.Affordable premium membership with exclusive benefits')}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CircleCheckBig className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{t('escrow.No Platform Fees')}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {t('escrow.Save on platform fees for all your quests and services')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CircleCheckBig className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{t('escrow.Get Out of Jail Free Card')}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {t('escrow.You can once get your funds back before due date and proof submission')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CircleCheckBig className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{t('escrow.Refer to a friend')}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {t('escrow.Earn 5% of your referrals premium payments')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CircleCheckBig className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{t('escrow.And more...')}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {t('escrow.Special events, contests, and exclusive features')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link to="/premium" target="_blank" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 mt-4">
                        <div className="flex items-center justify-center">
                          {t('escrow.Get Premium')}
                          <ExternalLink size={18} className="ml-2" />
                        </div>
                      </Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t('escrow.If your quest fails, you will lose')}
            </span>
            <span className="font-medium text-red-500">{userLockAmount} sats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;

