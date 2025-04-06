import { 
  createCalendarRule,
  createScheduleCallOption,
  createCalendarSchedule
} from '@/lib/schedule';
import { DateTime } from 'luxon';
import type {
  TimeRange,
  CalendarDate,
  BookedSchedule
} from '@/types/schedule';

// Example call options
const freeConsultation = createScheduleCallOption({
  duration: 30,
  description: 'Free 30-minute consultation call',
  type: 'VideoCall',
  firstCall: true,
  needsApproval: true
});

const paidVideoCall = createScheduleCallOption({
  duration: 60,
  description: '1-hour video coaching session',
  price: 10000, // 10,000 sats
  type: 'VideoCall',
  needsApproval: false
});

const paidAudioCall = createScheduleCallOption({
  duration: 30,
  description: '30-minute audio coaching session',
  price: 5000, // 5,000 sats
  type: 'AudioCall',
  needsApproval: false
});

// Example calendar rules
const calendarRules = [
  // Exclude every day before 9AM and after 5PM
  createCalendarRule({
    type: 'exclude',
    frequency: 'daily',
    time: { start: '00:00', end: '09:00' },
    description: 'Outside of business hours'
  }),
  createCalendarRule({
    type: 'exclude',
    frequency: 'daily',
    time: { start: '17:00', end: '23:59' },
    description: 'Outside of business hours'
  }),

  // Exclude every Saturday and Sunday
  createCalendarRule({
    type: 'exclude',
    frequency: 'weekly',
    daysOfWeek: ['saturday', 'sunday'],
    description: 'Weekend off'
  }),

  // Exclude every 4th of July
  createCalendarRule({
    type: 'exclude',
    frequency: 'yearly',
    month: 7,
    day: 4,
    description: 'Independence Day'
  }),

  // Exclude one-time date: 8th April
  createCalendarRule({
    type: 'exclude',
    frequency: 'one-time',
    date: { year: 2024, month: 4, day: 8 },
    description: 'Personal day off'
  }),

  // Include one-time date: 5th April (even though it's a Saturday)
  createCalendarRule({
    type: 'include',
    frequency: 'one-time',
    date: { year: 2024, month: 4, day: 5 },
    description: 'Special Saturday availability'
  })
];

// Example schedule options
export const scheduleOptions = [
  freeConsultation,
  paidVideoCall,
  paidAudioCall
];

// Create the complete calendar schedule
export const mockCalendarSchedule = createCalendarSchedule({
  calendarRules,
  scheduleOptions
});

// Example booked schedules
export const mockBookedSchedules: BookedSchedule[] = [
  {
    id: 'booking1',
    date: DateTime.now()
      .set({ hour: 10, minute: 0, second: 0, millisecond: 0 })
      .plus({ days: 1 })
      .toJSDate(), // Tomorrow at 10:00 AM
    duration: 30,
    callOptionId: freeConsultation.id,  
    userId: 'user123',
    username: 'wellness_seeker',
    status: 'approved',
    payed: false // free consultation
  },
  {
    id: 'booking2',
    date: DateTime.now()
      .set({ hour: 14, minute: 0, second: 0, millisecond: 0 })
      .plus({ days: 1 })
      .toJSDate(), // Tomorrow at 2:00 PM
    duration: 60,
    callOptionId: paidVideoCall.id,
    userId: 'user456',
    username: 'meditation_student',
    status: 'pending',
    lnInvoice: 'lnbc100...',
    payed: false
  },
  {
    id: 'booking3',
    date: DateTime.now()
      .set({ hour: 10, minute: 0, second: 0, millisecond: 0 })
      .plus({ days: 2 })
      .toJSDate(), // Day after tomorrow at 10:00 AM
    duration: 15,
    callOptionId: paidAudioCall.id,
    userId: 'user789',
    username: 'fitness_enthusiast',
    status: 'approved',
    lnInvoice: 'lnbc50...',
    payed: true
  }
];
