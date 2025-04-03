import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { UserProfile } from '@/types/user';
import { CalendarEvent } from '@/types/calendar';
import { mockCalendarEvents } from '@/mock/data';

interface ScheduleProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

const Schedule: React.FC<ScheduleProps> = ({ profile, isOwnProfile }) => {
  const { t, i18n } = useTranslation(null, { keyPrefix: 'profile.schedule' });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (profile.isCoach && mockCalendarEvents[profile.username]) {
      setEvents(mockCalendarEvents[profile.username]);
    }
  }, [profile]);

  const daysInMonth = currentDate.daysInMonth || 30;
  const firstDayOfMonth = currentDate.startOf('month');
  const startingDay = firstDayOfMonth.weekday;
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get localized weekday names
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = DateTime.local().startOf('week').plus({ days: i });
    return date.toFormat('EEE', { locale: i18n.language });
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM

  const handleDateClick = (date: DateTime) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeClick = (hour: number) => {
    if (!selectedDate) return;
    setSelectedTime(hour.toString());
    
    if (!isOwnProfile) {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: t('New Appointment'),
        start: selectedDate.set({ hour, minute: 0 }).toJSDate(),
        end: selectedDate.set({ hour: hour + 1, minute: 0 }).toJSDate(),
        status: 'pending',
        userId: 'current-user',
        username: 'current-user'
      };
      setEvents([...events, newEvent]);
    }
  };

  const isTimeSlotAvailable = (date: DateTime, hour: number) => {
    if (hour < 9 || hour >= 21) return false; // Outside business hours
    
    const slotStart = date.set({ hour, minute: 0 });
    const slotEnd = date.set({ hour: hour + 1, minute: 0 });
    
    return !events.some(event => {
      const eventStart = DateTime.fromJSDate(event.start);
      const eventEnd = DateTime.fromJSDate(event.end);
      return (
        (slotStart >= eventStart && slotStart < eventEnd) ||
        (slotEnd > eventStart && slotEnd <= eventEnd) ||
        (slotStart <= eventStart && slotEnd >= eventEnd)
      );
    });
  };

  const getEventStatus = (date: DateTime, hour: number) => {
    const slotStart = date.set({ hour, minute: 0 });
    const event = events.find(event => {
      const eventStart = DateTime.fromJSDate(event.start);
      return eventStart.equals(slotStart);
    });
    return event?.status;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('Schedule')}</h2>
      
      <div className="flex gap-8">
        {/* Calendar */}
        <div className="w-96">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentDate(currentDate.minus({ month: 1 }))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              ←
            </button>
            <span className="font-semibold">
              {currentDate.toFormat('MMMM yyyy', { locale: i18n.language })}
            </span>
            <button
              onClick={() => setCurrentDate(currentDate.plus({ month: 1 }))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: startingDay - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {monthDays.map(day => {
              const date = currentDate.set({ day });
              const isSelected = selectedDate?.day === day && selectedDate?.month === currentDate.month;
              const hasEvents = events.some(event => 
                DateTime.fromJSDate(event.start).day === day && 
                DateTime.fromJSDate(event.start).month === currentDate.month
              );

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(date)}
                  className={`
                    h-10 rounded flex items-center justify-center
                    ${isSelected ? 'bg-primary text-white' : ''}
                    ${hasEvents ? 'border-2 border-primary' : ''}
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="flex-1">
            <h3 className="font-semibold mb-4">
              {selectedDate.toFormat('EEEE, MMMM d', { locale: i18n.language })}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {hours.map(hour => {
                const isAvailable = isTimeSlotAvailable(selectedDate, hour);
                const status = getEventStatus(selectedDate, hour);
                const isSelected = selectedTime === hour.toString();

                return (
                  <button
                    key={hour}
                    onClick={() => handleTimeClick(hour)}
                    disabled={!isAvailable || isOwnProfile}
                    className={`
                      p-2 rounded text-left
                      ${!isAvailable ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''}
                      ${status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
                      ${status === 'approved' ? 'bg-green-100 dark:bg-green-900' : ''}
                      ${status === 'rejected' ? 'bg-red-100 dark:bg-red-900' : ''}
                      ${isSelected ? 'ring-2 ring-primary' : ''}
                      ${isAvailable && !status ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                    `}
                  >
                    {hour}:00 - {hour + 1}:00
                    {status && (
                      <span className="ml-2 text-sm">
                        ({t(status.charAt(0).toUpperCase() + status.slice(1))})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule; 