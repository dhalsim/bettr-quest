
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
    name: 'Finish up a book', 
    description: 'Read an entire book from start to finish. Set a timeline that works for you and track your daily progress.',
    suggestedTags: ['reading', 'learning', 'personal-growth']
  },
  { 
    id: 'run', 
    name: 'Run 3 km', 
    description: 'Challenge yourself to run 3 kilometers within a specific timeframe. Start slow and build up your stamina day by day.',
    suggestedTags: ['fitness', 'running', 'health']
  },
  { 
    id: 'closet', 
    name: 'Organize My Closet', 
    description: 'Declutter and organize your entire closet. Sort items into keep, donate, and discard piles. Document your progress!',
    suggestedTags: ['organization', 'home', 'lifestyle']
  },
  { 
    id: 'business', 
    name: 'Write a business plan', 
    description: 'Create a comprehensive business plan for your idea or startup. Include market analysis, financial projections, and marketing strategy.',
    suggestedTags: ['business', 'entrepreneurship', 'planning']
  },
  { 
    id: 'meditation', 
    name: 'Daily meditation practice', 
    description: 'Build a daily meditation habit. Start with just 5 minutes per day and work your way up to longer sessions.',
    suggestedTags: ['mindfulness', 'wellness', 'mental-health']
  }
];

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const ChallengeTemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">Templates (Optional)</h2>
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
