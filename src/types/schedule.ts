export type CalendarRuleType = 'exclude' | 'include';

export type CalendarRuleFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time';

export type TimeRange = {
  start: string; // Format: "HH:mm"
  end: string; // Format: "HH:mm"
};

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type CalendarDate = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
};

export type CallType = 'Text' | 'VideoCall' | 'AudioCall';

export type ScheduleCallOption = {
  id: string;
  duration: number; // in minutes
  title: string;
  description: string;
  price?: number; // in sats, optional
  type: CallType;
  firstCall?: boolean;
  needsApproval?: boolean;
};

export type BookedSchedule = {
  id: string;
  date: Date;
  duration: number; // in minutes
  callOptionId: string;
  userId: string; // pubkey of the user who booked
  username: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  lnInvoice?: string;
  payed?: boolean;
};

// Base types for calendar rules
type BaseCalendarRuleParams = {
  type: CalendarRuleType;
  frequency: CalendarRuleFrequency;
  time?: TimeRange;
  description?: string;
};

type DailyCalendarRuleParams = BaseCalendarRuleParams & {
  frequency: 'daily';
};

type WeeklyCalendarRuleParams = BaseCalendarRuleParams & {
  frequency: 'weekly';
  daysOfWeek: DayOfWeek[];
};

type MonthlyCalendarRuleParams = BaseCalendarRuleParams & {
  frequency: 'monthly';
  dayOfMonth: number; // 1-31
};

type YearlyCalendarRuleParams = BaseCalendarRuleParams & {
  frequency: 'yearly';
  month: number; // 1-12
  day: number; // 1-31
};

type OneTimeCalendarRuleParams = BaseCalendarRuleParams & {
  frequency: 'one-time';
  date: CalendarDate;
};

export type CalendarRuleParams = 
  | DailyCalendarRuleParams
  | WeeklyCalendarRuleParams
  | MonthlyCalendarRuleParams
  | YearlyCalendarRuleParams
  | OneTimeCalendarRuleParams;

export type CalendarRule = CalendarRuleParams;

// Calendar Schedule type that combines rules and options
export type CalendarSchedule = {
  calendarRules: CalendarRule[];
  scheduleOptions: ScheduleCallOption[];
}; 