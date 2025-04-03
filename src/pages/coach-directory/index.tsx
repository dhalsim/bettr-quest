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
        <div className="flex flex-col gap-6">
          {/* Top row - Title and Register button */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Empty space with same width as filters */}
              <div className="hidden md:block w-[25%]"></div>
              
              <div className="flex-1">
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
                    <Link 
                      to="/register-coach" 
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-primary to-primary/80 rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {t('coach-directory.Register as Coach')}
                    </Link>
                  )}
                </div>

                {/* Sorting controls */}
                <div className="flex justify-end mb-2">
                  <CoachSorting sortBy={sortBy} onSortChange={setSortBy} />
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Moves to top on mobile */}
            <div className="w-full md:w-[25%] order-1 md:order-none">
              <div className="sticky top-32">
                <CoachFilters {...filterProps} />
              </div>
            </div>

            {/* Coach list */}
            <div className="w-full md:w-[75%] order-2 md:order-none">
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
