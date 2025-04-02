import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  dueDate: string;
  setDueDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dueDate, setDueDate }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  // Calculate minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDueDate(date.toISOString().split('T')[0]);
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
        {t('create-quest.form.due-date')}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dueDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? format(new Date(dueDate), "PPP") : <span>{t('create-quest.form.due-date-placeholder')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate ? new Date(dueDate) : undefined}
            onSelect={handleDateSelect}
            disabled={(date) => date < getMinDate()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
