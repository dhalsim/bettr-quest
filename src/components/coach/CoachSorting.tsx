import React from 'react';
import { useTranslation } from 'react-i18next';

export type SortOption = 'ByRating' | 'ByPriceDesc' | 'ByPriceAsc';

interface CoachSortingProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const CoachSorting: React.FC<CoachSortingProps> = ({ sortBy, onSortChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t('coach-directory.sorting.Sort by')}:
      </span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="text-sm border rounded-md px-2 py-1 bg-background"
      >
        <option value="ByRating">{t('coach-directory.sorting.ByRating')}</option>
        <option value="ByPriceDesc">{t('coach-directory.sorting.ByPriceDesc')}</option>
        <option value="ByPriceAsc">{t('coach-directory.sorting.ByPriceAsc')}</option>
      </select>
    </div>
  );
};

export default CoachSorting; 