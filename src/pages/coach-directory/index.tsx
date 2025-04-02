import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isLoggedIn } from '@/pages/coach-directory/utils';
import { useCoachDirectory } from '@/hooks/useCoachDirectory';
import CoachList from '@/components/coach/CoachList';
import CoachSorting from '@/components/coach/CoachSorting';
import CoachFilters from '@/components/coach/CoachFilters';

const CoachDirectoryPageWrapper: React.FC = () => {
  const { t } = useTranslation();
  const { filterProps, sortedCoaches, sortBy, setSortBy, resetFilters } = useCoachDirectory();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Top row - Title and Register button */}
          <div className="col-start-4 col-span-9">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t('coach-directory.Coach Directory')}
                </h1>
                <p className="text-muted-foreground">
                  {t('coach-directory.Find the perfect coach for your journey')}
                </p>
              </div>
              
              {isLoggedIn() && (
                <Link to="/register-coach" className="btn-primary text-nowrap">
                  {t('coach-directory.Register as Coach')}
                </Link>
              )}
            </div>

            {/* Sorting controls */}
            <div className="flex justify-end mb-6">
              <CoachSorting sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {/* Main content area */}
          <div className="col-span-12 grid grid-cols-12 gap-6">
            {/* Filters */}
            <div className="col-start-1 col-span-3">
              <div className="sticky top-32">
                <CoachFilters {...filterProps} />
              </div>
            </div>

            {/* Coach list */}
            <div className="col-start-4 col-span-9">
              <CoachList 
                coaches={sortedCoaches}
                mode="link"
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDirectoryPageWrapper;
