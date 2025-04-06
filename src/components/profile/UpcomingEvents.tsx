import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { BookedSchedule } from '@/types/schedule';

interface UpcomingEventsProps {
  events: BookedSchedule[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const { t, i18n } = useTranslation(null, { keyPrefix: 'profile.upcoming-events' });

  console.log('UpcomingEvents received events:', events);

  // Group events by time period
  const today = DateTime.now().startOf('day');
  const tomorrow = today.plus({ days: 1 });
  const endOfWeek = today.plus({ days: 7 });
  const endOfNextWeek = today.plus({ days: 14 });

  console.log('Date ranges:', {
    today: today.toISO(),
    tomorrow: tomorrow.toISO(),
    endOfWeek: endOfWeek.toISO(),
    endOfNextWeek: endOfNextWeek.toISO()
  });

  const groupedEvents = events.reduce((acc, event) => {
    const eventDate = DateTime.fromJSDate(event.date);
    
    if (eventDate >= today && eventDate < tomorrow) {
      acc.today.push(event);
    } else if (eventDate >= tomorrow && eventDate < endOfWeek) {
      acc.thisWeek.push(event);
    } else if (eventDate >= endOfWeek && eventDate < endOfNextWeek) {
      acc.nextWeek.push(event);
    } else if (eventDate >= endOfNextWeek) {
      acc.later.push(event);
    }
    
    return acc;
  }, {
    today: [] as BookedSchedule[],
    thisWeek: [] as BookedSchedule[],
    nextWeek: [] as BookedSchedule[],
    later: [] as BookedSchedule[]
  });

  console.log('Grouped events:', groupedEvents);

  const renderEventGroup = (title: string, events: BookedSchedule[]) => {
    if (events.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="space-y-3">
          {events.map((event) => {
            const eventDate = DateTime.fromJSDate(event.date);
            return (
              <div key={event.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.username}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {eventDate.toFormat('EEEE, MMMM d, yyyy', { locale: i18n.language })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {eventDate.toFormat('h:mm a', { locale: i18n.language })} - 
                      {DateTime.fromJSDate(event.date).plus({ minutes: event.duration }).toFormat('h:mm a', { locale: i18n.language })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (events.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">{t('No upcoming events')}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('Upcoming Events')}</h2>
        <button className="text-primary hover:text-primary-dark">
          {t('View All')}
        </button>
      </div>

      {renderEventGroup(t('Today'), groupedEvents.today)}
      {renderEventGroup(t('This Week'), groupedEvents.thisWeek)}
      {renderEventGroup(t('Next Week'), groupedEvents.nextWeek)}
      {renderEventGroup(t('Later'), groupedEvents.later)}
    </div>
  );
};

export default UpcomingEvents; 