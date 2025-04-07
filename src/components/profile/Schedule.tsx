import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { ScheduleCallOption, BookedSchedule, CalendarSchedule } from '@/types/schedule';
import { isTimeSlotAvailable, getAvailableOptions } from '@/lib/schedule';
import BookingFlow from './BookingFlow';

interface ScheduleProps {
  isOwnProfile: boolean;
  calendarSchedule: CalendarSchedule;
  initialBookedSchedules: BookedSchedule[];
}

const Schedule: React.FC<ScheduleProps> = ({
  isOwnProfile,
  calendarSchedule,
  initialBookedSchedules,

}) => {
  const { t, i18n } = useTranslation(null, { keyPrefix: 'profile.schedule' });
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableOptions, setAvailableOptions] = useState<ScheduleCallOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ScheduleCallOption | null>(null);
  const [bookedSchedules, setBookedSchedules] = useState<BookedSchedule[]>(initialBookedSchedules);
  
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  const createTimeSlotOverlapChecker = (dateTimeStart: DateTime, dateTimeEnd: DateTime) => {
    return (booking: BookedSchedule) => {
      const bookingStart = DateTime.fromJSDate(booking.date);
      const bookingEnd = bookingStart.plus({ minutes: booking.duration });
      
      return (
        // Case 1: dateTimeStart falls within the booking period
        (dateTimeStart >= bookingStart && dateTimeStart < bookingEnd) ||
        // Case 2: dateTimeEnd falls within the booking period
        (dateTimeEnd > bookingStart && dateTimeEnd <= bookingEnd) ||
        // Case 3: booking period completely contains our time slot
        (dateTimeStart <= bookingStart && dateTimeEnd >= bookingEnd)
      );
    };
  };

  const daysInMonth = currentDate.daysInMonth || 30;
  const firstDayOfMonth = currentDate.startOf('month');
  const startingDay = firstDayOfMonth.weekday;
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get localized weekday names
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = DateTime.local().startOf('week').plus({ days: i });
    return date.toFormat('EEE', { locale: i18n.language });
  });

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 AM to 23 PM

  const handleDateClick = (date: DateTime) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableOptions([]);
    setSelectedOption(null);
    
    // Scroll to time slots
    if (timeSlotsRef.current) {
      timeSlotsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTimeClick = (hour: number) => {
    if (!selectedDate) return;
    
    const selectedDateTime = selectedDate.set({ hour });
    const options = getAvailableOptions(calendarSchedule, selectedDateTime);
    
    setSelectedTime(hour.toString());
    setAvailableOptions(options);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option: ScheduleCallOption) => {
    if (!selectedDate || !selectedTime) return;
    
    setSelectedOption(option);
  };

  const handleBook = (booking: Omit<BookedSchedule, 'id'>) => {
    // Add the new booking to the local state
    const newBooking: BookedSchedule = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9) // Generate a simple unique ID
    };
    
    setBookedSchedules(prev => [...prev, newBooking]);
    
    // Reset the selected time and option to hide the BookingFlow
    setSelectedTime(null);
    setSelectedOption(null);
  };

  const isTimeSlotValid = (date: DateTime, hour: number) => {
    // Create a new DateTime object with the selected date's components
    const dateTimeStart = DateTime.fromObject({
      year: date.year,
      month: date.month,
      day: date.day,
      hour: hour,
      minute: 0,
      second: 0,
      millisecond: 0
    });
    
    const dateTimeEnd = dateTimeStart.plus({ hours: 1 });

    // Check if date is in the past
    if (dateTimeStart < DateTime.now().startOf('hour')) {
      return false;
    }

    const isAvailable = isTimeSlotAvailable({ 
      calendarRules: calendarSchedule.calendarRules, 
      dateTime: dateTimeStart 
    });

    // Check if slot is available according to calendar rules
    if (!isAvailable) {
      return false;
    }

    // Check if slot is already booked or has a collision
    const hasCollision = bookedSchedules.some(createTimeSlotOverlapChecker(dateTimeStart, dateTimeEnd));

    return !hasCollision;
  };

  // Check if any time slot is available for a given date
  const hasAvailableSlots = (date: DateTime) => {
    return hours.some(hour => isTimeSlotValid(date, hour));
  };

  const getBookingStatus = (date: DateTime, hour: number) => {
    const dateTimeStart = DateTime.fromObject({
      year: date.year,
      month: date.month,
      day: date.day,
      hour: hour,
      minute: 0,
      second: 0,
      millisecond: 0
    });
    
    const dateTimeEnd = dateTimeStart.plus({ hours: 1 });
    
    const booking = bookedSchedules.find(createTimeSlotOverlapChecker(dateTimeStart, dateTimeEnd));

    return booking?.status;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('Schedule')}</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar */}
        <div className="w-full md:w-96">
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
              const isPastDate = date < DateTime.now().startOf('day');
              const isDisabled = isPastDate || (!isPastDate && !hasAvailableSlots(date));
              const isToday = date.hasSame(DateTime.now(), 'day');

              return (
                <button
                  key={day}
                  onClick={() => !isDisabled && handleDateClick(date)}
                  disabled={isDisabled}
                  className={`
                    h-10 rounded flex items-center justify-center
                    ${isSelected ? 'bg-primary text-white' : ''}
                    ${isToday ? 'border-2 border-primary' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots and Options */}
        {selectedDate && (
          <div className="w-full md:flex-1" ref={timeSlotsRef}>
            <h3 className="font-semibold mb-4">
              {selectedDate.toFormat('EEEE, MMMM d', { locale: i18n.language })}
            </h3>
            <div className="flex gap-8">
              {/* Time Slots */}
              <div className="w-50">
                <div className="grid grid-cols-1 gap-2">
                  {hours.map(hour => {
                    const dateTimeStart = DateTime.fromObject({
                      year: selectedDate.year,
                      month: selectedDate.month,
                      day: selectedDate.day,
                      hour: hour,
                      minute: 0,
                      second: 0,
                      millisecond: 0
                    });

                    // First check if the slot is available according to calendar rules
                    const isAvailable = isTimeSlotAvailable({ 
                      calendarRules: calendarSchedule.calendarRules, 
                      dateTime: dateTimeStart 
                    });

                    // If not available according to calendar rules, don't show the slot
                    if (!isAvailable) {
                      return null;
                    }

                    // Check if the slot is valid (not in past and no collisions)
                    const isValid = isTimeSlotValid(selectedDate, hour);
                    const status = getBookingStatus(selectedDate, hour);
                    const isSelected = selectedTime === hour.toString();
                    const isDisabled = !isValid || !!status || isOwnProfile;

                    return (
                      <button
                        key={hour}
                        onClick={() => handleTimeClick(hour)}
                        disabled={isDisabled}
                        className={`
                          p-2 rounded text-left
                          ${status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
                          ${status === 'approved' ? 'bg-green-100 dark:bg-green-900' : ''}
                          ${status === 'rejected' ? 'bg-red-100 dark:bg-red-900' : ''}
                          ${!isValid && !status ? 'opacity-50 bg-gray-100 dark:bg-gray-800' : ''}
                          ${isSelected ? 'ring-2 ring-primary' : ''}
                          ${isValid && !status ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                        `}
                      >
                        {hour.toString().padStart(2, '0')}:00 - {(hour + 1).toString().padStart(2, '0')}:00
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

              {/* Available Options or Booking Flow */}
              <div className="flex-1">
                {selectedTime && !selectedOption && availableOptions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{t('Available Options')}</h4>
                    <div className="space-y-2">
                      {availableOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option)}
                          className="w-full p-3 border rounded hover:border-primary text-left transition-colors"
                        >
                          <div className="font-medium">{option.description}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {option.duration} {t('minutes')} - {option.price ? `${option.price} sats` : t('Free')}
                          </div>
                          {option.firstCall && (
                            <div className="text-sm text-green-600 dark:text-green-400">
                              {t('First consultation free')}
                            </div>
                          )}
                          {option.needsApproval && (
                            <div className="text-sm text-yellow-600 dark:text-yellow-400">
                              {t('Requires approval')}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTime && selectedOption && (
                  <BookingFlow
                    selectedDateTime={selectedDate.set({ hour: parseInt(selectedTime) })}
                    selectedOption={selectedOption}
                    onBook={handleBook}
                  />
                )}
                
                {selectedTime && !selectedOption && availableOptions.length === 0 && (
                  <div className="text-muted-foreground">
                    {t('No available options for this time slot')}
                  </div>
                )}
                
                {!selectedTime && (
                  <div className="text-muted-foreground">
                    {t('Select a time slot to see available options')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule; 