
import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface DateSelectorProps {
  dueDate: string;
  setDueDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dueDate, setDueDate }) => {
  // Calculate minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="mb-6">
      <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
        Due Date
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <Calendar size={16} />
        </div>
        <Input
          type="date"
          id="dueDate"
          min={getMinDate()}
          className="pl-10"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default DateSelector;
