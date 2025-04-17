import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface QuestDetailsCardProps {
  title?: string;
  description: string;
  questLink?: string;
  proofTitle?: string;
  proofDescription?: string;
}

const QuestDetailsCard: React.FC<QuestDetailsCardProps> = ({
  title,
  description,
  questLink,
  proofTitle,
  proofDescription
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      {title && questLink && (
        <Link to={questLink} className="block mb-4">
          <h2 className="text-xl font-semibold text-primary hover:underline">
            {title}
          </h2>
        </Link>
      )}
      
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      
      {proofTitle && proofDescription && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <h3 className="text-lg font-medium mb-2">
            {t('escrow.Proof Details')}
          </h3>
          <h4 className="text-base font-medium mb-1">
            {proofTitle}
          </h4>
          <p className="text-muted-foreground">
            {proofDescription}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestDetailsCard;
