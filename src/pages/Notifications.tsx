
import React, { useEffect } from 'react';
import { Bell, MessageCircle, Zap, Calendar, CheckCircle } from 'lucide-react';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {
  const { isLoggedIn } = useNostrAuth();
  const { notifications, markAllAsRead, markAsRead, formatTimestamp, hasUnread } = useNotifications();

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
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

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    // We don't need additional state update here since the hook now handles it
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {hasUnread && (
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
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        {notification.username && (
                          <div className="flex items-center gap-2">
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
                          </div>
                        )}
                        <span className={`${notification.username ? 'text-muted-foreground sm:ml-0' : 'font-medium'}`}>
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

                    {notification.type === 'message' && notification.messageContent && (
                      <div className="mt-2 bg-muted/50 p-3 rounded-lg text-sm">
                        {notification.messageContent}
                      </div>
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
