
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Challenge template type
export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  suggestedTags: string[];
}

// Challenge templates data
export const challengeTemplates: ChallengeTemplate[] = [
  { 
    id: 'book', 
    name: 'Finish Economics Book Chapter 4', 
    description: 'I want to complete Chapter 4 of my economics textbook by the end of this week. I\'ll track my progress and take notes on key concepts.',
    suggestedTags: ['reading', 'learning', 'economics']
  },
  { 
    id: 'run', 
    name: 'Run 3 km', 
    description: 'I\'m challenging myself to run 3 kilometers within a specific timeframe. I\'ll start slow and build up my stamina day by day.',
    suggestedTags: ['fitness', 'running', 'health']
  },
  { 
    id: 'closet', 
    name: 'Organize My Closet', 
    description: 'I need to declutter and organize my entire closet. I\'ll sort items into keep, donate, and discard piles. I\'ll document my progress!',
    suggestedTags: ['organization', 'home', 'lifestyle']
  },
  { 
    id: 'business', 
    name: 'Write a business plan', 
    description: 'I want to create a comprehensive business plan for my idea or startup. I\'ll include market analysis, financial projections, and marketing strategy.',
    suggestedTags: ['business', 'entrepreneurship', 'planning']
  },
  { 
    id: 'meditation', 
    name: 'Daily meditation practice', 
    description: 'I\'m building a daily meditation habit. I\'ll start with just 5 minutes per day and work my way up to longer sessions.',
    suggestedTags: ['mindfulness', 'wellness', 'mental-health']
  }
];

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const ChallengeTemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">Select a template (optional)</h2>
      <Select onValueChange={onSelectTemplate}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="I want to..." />
        </SelectTrigger>
        <SelectContent>
          {challengeTemplates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChallengeTemplateSelector;
