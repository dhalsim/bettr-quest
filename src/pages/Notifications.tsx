
import React, { useState } from 'react';
import { Bell, MessageCircle, Zap, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

// Mock notification types
type NotificationType = 'zap' | 'review' | 'proof' | 'reminder' | 'message';

interface Notification {
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

const Notifications = () => {
  const { isLoggedIn } = useNostrAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  // Mark single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Helper to format timestamp
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

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'zap':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'review':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'proof':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Notifications</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to view your notifications.
          </p>
          <Link to="/connect">
            <Button>Connect with Nostr</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground mb-6">
              You don't have any notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`glass rounded-xl p-4 transition-all ${
                  !notification.read 
                    ? 'border-l-4 border-primary' 
                    : ''
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {notification.username && (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage 
                                src={notification.userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} 
                                alt={notification.username} 
                              />
                              <AvatarFallback>{notification.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Link to={`/profile/${notification.username}`} className="font-medium hover:underline">
                              @{notification.username}
                            </Link>
                          </>
                        )}
                        <span className={`${notification.username ? 'text-muted-foreground' : 'font-medium'}`}>
                          {notification.message}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    
                    {notification.questId && (
                      <Link to={`/quest/${notification.questId}`} className="font-medium text-primary hover:underline block mb-1">
                        {notification.questTitle}
                      </Link>
                    )}
                    
                    {notification.type === 'zap' && notification.amount && (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-500">
                        <Zap className="h-4 w-4" />
                        {notification.amount} sats
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
