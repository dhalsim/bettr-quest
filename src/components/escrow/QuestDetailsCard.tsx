
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface QuestDetailsCardProps {
  title: string;
  description: string;
  questLink: string;
}

const QuestDetailsCard = ({ title, description, questLink }: QuestDetailsCardProps) => {
  return (
    <div className="bg-secondary/10 rounded-lg p-4 border border-border/50 mb-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Quest Details</h2>
        <a 
          href={questLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-primary hover:underline"
        >
          View Quest <ArrowUpRight size={16} className="ml-1" />
        </a>
      </div>
      <h3 className="text-lg font-medium mt-2 mb-2">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default QuestDetailsCard;
