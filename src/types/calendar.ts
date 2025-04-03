export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  username: string;
} 