"use client";

import { useEffect } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationItem } from "./notification-item";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const NotificationList = () => {
  const {
    notifications,
    loading,
    error,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    refreshNotifications,
  } = useNotifications();

  // Refresh notifications every minute
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNotifications();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  if (loading) {
    return (
      <div className="w-full p-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshNotifications}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="w-full p-6 text-center">
        <p className="text-sm text-muted-foreground">No notifications</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h3 className="text-sm font-medium">Notifications</h3>
        <Button
          onClick={markAllNotificationsAsRead}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          Mark all as read
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={markNotificationAsRead}
            onDelete={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}; 