import React from 'react';
import { Button } from '@/components/ui/button';
import CoachCard from './CoachCard';
import { Coach } from '@/pages/coach-directory/utils';

interface CoachListProps {
  coaches: Coach[];
  resetFilters?: () => void;
  mode?: 'link' | 'select';
  selectedCoachId?: string;
  onSelectCoach?: (coachId: string) => void;
}

const CoachList: React.FC<CoachListProps> = ({ 
  coaches, 
  resetFilters,
  mode = 'link',
  selectedCoachId,
  onSelectCoach
}) => {
  return (
    <div>
      {coaches.length > 0 ? (
        <div className="space-y-6">
          {coaches.map(coach => (
            <CoachCard 
              key={coach.id} 
              coach={coach}
              mode={mode}
              selected={selectedCoachId === coach.id}
              onSelect={onSelectCoach}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center border-2 border-gray-300">
          <h3 className="text-xl font-semibold mb-2">No coaches found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to find more coaches
          </p>
          {resetFilters && (
            <Button onClick={resetFilters}>Reset Filters</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoachList; 