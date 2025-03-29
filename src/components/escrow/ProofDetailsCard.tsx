import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProofDetailsCardProps {
  title: string;
  description: string;
  proofLink: string;
  questTitle: string;
  questDescription: string;
  questLink: string;
}

const ProofDetailsCard: React.FC<ProofDetailsCardProps> = ({
  title,
  description,
  proofLink,
  questTitle,
  questDescription,
  questLink
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary/10 rounded-lg p-6 border border-border/50 mb-8">
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">{t('escrow.rewards.proofDetails.Verifying Proof:')}</div>
        <div className="flex items-center gap-3">
          <a 
            href={proofLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <ExternalLink size={18} className="group-hover:text-primary" />
            <h2 className="text-xl font-semibold">{title}</h2>
          </a>
        </div>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      {/* Quest Section - Nested within proof context */}
      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="bg-background/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">{t('escrow.rewards.proofDetails.For the Quest:')}</div>
          <div className="flex items-center gap-3">
            <a 
              href={questLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors group"
            >
              <ExternalLink size={16} className="group-hover:text-primary" />
              <h3 className="text-base font-medium">{questTitle}</h3>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{questDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default ProofDetailsCard;
