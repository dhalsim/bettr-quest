
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatSats } from '..';
import CoachCard from './CoachCard';
import { Coach } from '..';

interface CoachListProps {
  coaches: Coach[];
  resetFilters: () => void;
}

const CoachList: React.FC<CoachListProps> = ({ coaches, resetFilters }) => {
  return (
    <div className="lg:col-span-3">
      {coaches.length > 0 ? (
        <div className="space-y-10">
          {coaches.map(coach => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center border-2 border-gray-300">
          <h3 className="text-xl font-semibold mb-2">No coaches found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to find more coaches
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}
    </div>
  );
};

export default CoachList;
