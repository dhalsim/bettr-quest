import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuestDetailsCardProps {
  title: string;
  description: string;
  questLink: string;
}

const QuestDetailsCard: React.FC<QuestDetailsCardProps> = ({
  title,
  description,
  questLink
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
      <div className="text-sm text-muted-foreground mb-2">{t('escrow.rewards.questDetails.Of the Quest:')}</div>
      <div className="flex items-center gap-3">
        <a 
          href={questLink}
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
  );
};

export default QuestDetailsCard;
