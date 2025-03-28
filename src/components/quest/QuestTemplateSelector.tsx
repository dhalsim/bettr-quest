import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questTemplates } from '@/mock/data';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const QuestTemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">Select a template (optional)</h2>
      <Select onValueChange={onSelectTemplate}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="I want to..." />
        </SelectTrigger>
        <SelectContent>
          {questTemplates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuestTemplateSelector;
