import React from 'react';
import CoachDirectory from '@/components/coach/CoachDirectory';

interface QuestCoachDirectoryProps {
  onSelectCoach: (coachId: string) => void;
  selectedCoachId?: string;
  questTags?: string[];
}

const QuestCoachDirectory: React.FC<QuestCoachDirectoryProps> = ({ 
  onSelectCoach, 
  selectedCoachId,
  questTags = []
}) => {
  return (
    <CoachDirectory
      onSelectCoach={onSelectCoach}
      selectedCoachId={selectedCoachId}
      questTags={questTags}
      showRegisterButton={false}
      mode="select"
    />
  );
};

export default QuestCoachDirectory; 