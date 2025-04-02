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
    <div className="lg:col-span-3">
      {coaches.length > 0 ? (
        <div className="flex flex-col space-y-5">
          {coaches.map(coach => (
            <div key={coach.id}>
              <CoachCard 
                coach={coach}
                mode={mode}
                selected={selectedCoachId === coach.id}
                onSelect={onSelectCoach}
              />
            </div>
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