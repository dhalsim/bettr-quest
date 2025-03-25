
import { useState, useEffect } from 'react';

// Mock notification types
export type NotificationType = 'zap' | 'review' | 'proof' | 'reminder' | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  username?: string;
  userAvatar?: string;
  questId?: string;
  questTitle?: string;
  amount?: number;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'zap',
    message: 'sent you a zap for your quest',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    read: false,
    username: 'satoshi_nakamoto',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=satoshi',
    questId: '1',
    questTitle: 'Meditate for 20 minutes tomorrow',
    amount: 500
  },
  {
    id: '2',
    type: 'review',
    message: 'reviewed your quest',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    username: 'bitcoin_maximalist',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bitcoin',
    questId: '4',
    questTitle: 'Build a simple calculator app'
  },
  {
    id: '3',
    type: 'proof',
    message: 'Your proof was verified for',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    questId: '5',
    questTitle: 'Write a reflection journal entry'
  },
  {
    id: '4',
    type: 'reminder',
    message: 'Your quest is due tomorrow:',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    questId: '4',
    questTitle: 'Build a simple calculator app'
  },
  {
    id: '5',
    type: 'message',
    message: 'sent you a message',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    username: 'lightning_user',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lightning',
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  // Mark single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };
  
  // Format timestamp helper
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins} min${diffInMins !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return {
    notifications,
    markAllAsRead,
    markAsRead, 
    getUnreadCount,
    formatTimestamp,
    hasUnread: getUnreadCount() > 0
  };
};
