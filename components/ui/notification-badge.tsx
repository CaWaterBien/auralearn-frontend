'use client';

import React from 'react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  maxCount?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  className = '', 
  maxCount = 99 
}) => {
  // Don't use early return to avoid hooks ordering issues
  if (count <= 0) {
    return <></>;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div className={`absolute -top-1 -right-1 ${className}`}>
      <span className="relative flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-600 text-white text-xs font-bold">
          {displayCount}
        </span>
      </span>
    </div>
  );
};

// Alternative larger badge style
export const NotificationBadgeLarge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  className = '', 
  maxCount = 99 
}) => {
  // Don't use early return to avoid hooks ordering issues
  if (count <= 0) {
    return <></>;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full ${className}`}>
      {displayCount}
    </div>
  );
};
