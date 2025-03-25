
import React from 'react';

interface NotificationBadgeProps {
  count?: number;
  showDot?: boolean;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  showDot = false,
  className = "" 
}) => {
  if (!count && !showDot) return null;
  
  if (showDot) {
    return (
      <span className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ${className}`} />
    );
  }
  
  return (
    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ${className}`}>
      {count}
    </span>
  );
};

export default NotificationBadge;
