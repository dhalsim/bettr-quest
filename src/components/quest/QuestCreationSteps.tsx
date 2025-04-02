import React from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step {
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface QuestCreationStepsProps {
  steps: Step[];
}

const QuestCreationSteps: React.FC<QuestCreationStepsProps> = ({ steps }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step.isCompleted
                  ? 'bg-primary text-primary-foreground'
                  : step.isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.isCompleted ? (
                <Check size={16} />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${step.isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="w-24 h-[2px] mx-4 mt-4 bg-muted" />
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestCreationSteps; 