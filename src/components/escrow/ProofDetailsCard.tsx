
import React from 'react';

interface ProofDetailsCardProps {
  title: string;
  description: string;
}

const ProofDetailsCard = ({ title, description }: ProofDetailsCardProps) => {
  return (
    <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl font-semibold">Proof Details</h2>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default ProofDetailsCard;
