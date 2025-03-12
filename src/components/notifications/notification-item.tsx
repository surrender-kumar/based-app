"use client";

import { useRouter } from "next/navigation";
import { Notification } from "@/mocks/notification-data";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const router = useRouter();
  
  // Handle click on notification
  const handleClick = () => {
    // Mark as read if not already read
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to the source
    if (notification.channelId && notification.messageId) {
      if (notification.sourceType === 'thread') {
        router.push(`/channels/${notification.channelId}/thread/${notification.messageId}`);
      } else {
        router.push(`/channels/${notification.channelId}`);
      }
    } else if (notification.channelId) {
      router.push(`/channels/${notification.channelId}`);
    }
  };
  
  // Format the time
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'mention':
        return <Bell className="h-4 w-4 text-indigo-500" />;
      case 'reply':
        return <Bell className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  return (
    <div 
      className={cn(
        "relative flex items-start gap-x-4 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-200 dark:border-neutral-800",
        !notification.isRead && "bg-neutral-50 dark:bg-neutral-900"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-primary">
            {notification.title}
          </p>
          <div className="flex items-center gap-x-2">
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {timeAgo}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              &times;
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {notification.content}
        </p>
      </div>
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
      )}
    </div>
  );
}; 