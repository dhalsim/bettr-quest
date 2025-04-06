import { 
  CalendarRuleParams, 
  ScheduleCallOption, 
  CalendarSchedule,
  CalendarRule,
  DayOfWeek,
  TimeRange
} from '@/types/schedule';
import { DateTime } from 'luxon';

// Helper function to generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Function to create a schedule call option
export const createScheduleCallOption = ({
  duration,
  description,
  price = 0,
  type,
  firstCall = false,
  needsApproval = false
}: Omit<ScheduleCallOption, 'id'>): ScheduleCallOption => ({
  id: generateId(),
  duration,
  description,
  price,
  type,
  firstCall,
  needsApproval
});

// Function to create a calendar rule
export const createCalendarRule = <T extends CalendarRuleParams>(params: T): T => params;

// Function to create a calendar schedule
export const createCalendarSchedule = ({
  calendarRules,
  scheduleOptions
}: {
  calendarRules: CalendarRuleParams[];
  scheduleOptions: ScheduleCallOption[];
}): CalendarSchedule => ({
  calendarRules,
  scheduleOptions
});

// Helper function to check if a time is within a time range
const isTimeInRange = (time: DateTime, range: TimeRange): boolean => {
  const [startHour, startMinute] = range.start.split(':').map(Number);
  const [endHour, endMinute] = range.end.split(':').map(Number);
  
  const start = time.set({ hour: startHour, minute: startMinute });
  const end = time.set({ hour: endHour, minute: endMinute });
  
  return time >= start && time < end;
};

// Helper function to check if a rule applies to a specific date and time
const doesRuleApply = (rule: CalendarRule, dateTime: DateTime): boolean => {
  const dayOfWeek = dateTime.weekdayLong.toLowerCase() as DayOfWeek;

  switch (rule.frequency) {
    case 'daily':
      return rule.time ? isTimeInRange(dateTime, rule.time) : true;

    case 'weekly':
      return rule.daysOfWeek.includes(dayOfWeek) &&
        (rule.time ? isTimeInRange(dateTime, rule.time) : true);

    case 'monthly':
      return dateTime.day === rule.dayOfMonth &&
        (rule.time ? isTimeInRange(dateTime, rule.time) : true);

    case 'yearly':
      return dateTime.month === rule.month &&
        dateTime.day === rule.day &&
        (rule.time ? isTimeInRange(dateTime, rule.time) : true);

    case 'one-time':
      return dateTime.year === rule.date.year &&
        dateTime.month === rule.date.month &&
        dateTime.day === rule.date.day &&
        (rule.time ? isTimeInRange(dateTime, rule.time) : true);

    default:
      return false;
  }
};

export type IsTimeSlotAvailableParams = {
  calendarRules: CalendarRule[];
  dateTime: DateTime;
}

// Function to check if a specific date and time is available
export function isTimeSlotAvailable({ calendarRules, dateTime }: IsTimeSlotAvailableParams): boolean {
  // Check exclude rules first
  const isExcluded = calendarRules
    .filter(rule => rule.type === 'exclude')
    .some(rule => doesRuleApply(rule, dateTime));

  if (isExcluded) {
    // Check if there's a specific include rule that overrides the exclusion
    const isIncluded = calendarRules
      .filter(rule => rule.type === 'include')
      .some(rule => doesRuleApply(rule, dateTime));

    return isIncluded;
  }

  // If not excluded, it's available
  return true;
};

// Function to get available schedule options for a specific time slot
export const getAvailableOptions = (
  schedule: CalendarSchedule,
  dateTime: DateTime
): ScheduleCallOption[] => {
  if (!isTimeSlotAvailable({ calendarRules: schedule.calendarRules, dateTime })) {
    return [];
  }
  return schedule.scheduleOptions;
};
