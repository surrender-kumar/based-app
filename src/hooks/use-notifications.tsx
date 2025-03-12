"use client";

import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/mocks/notification-data";
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from "@/lib/actions/notifications";
import { useCurrentProfile } from "./use-current-profile";

export const useNotifications = () => {
  const { profile } = useCurrentProfile();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const notificationsResult = await getNotifications(profile.id);
      const unreadCountResult = await getUnreadCount(profile.id);
      
      if (notificationsResult.success && unreadCountResult.success) {
        if (notificationsResult.data) {
          setNotifications(notificationsResult.data);
        }
        if (typeof unreadCountResult.data === 'number') {
          setUnreadCount(unreadCountResult.data);
        }
      } else {
        setError(notificationsResult.error || unreadCountResult.error || "Failed to fetch notifications");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Mark a notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      const result = await markAsRead(notificationId);
      
      if (result.success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
        
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      } else {
        setError(result.error || "Failed to mark notification as read");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    if (!profile) return;
    
    try {
      const result = await markAllAsRead(profile.id);
      
      if (result.success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, isRead: true }))
        );
        
        setUnreadCount(0);
      } else {
        setError(result.error || "Failed to mark all notifications as read");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  }, [profile]);

  // Delete a notification
  const removeNotification = useCallback(async (notificationId: string) => {
    try {
      const result = await deleteNotification(notificationId);
      
      if (result.success) {
        setNotifications(prevNotifications => 
          prevNotifications.filter(notification => notification.id !== notificationId)
        );
        
        // Update unread count if necessary
        const wasUnread = notifications.find(n => n.id === notificationId)?.isRead === false;
        if (wasUnread) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
      } else {
        setError(result.error || "Failed to delete notification");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  }, [notifications]);

  // Initial fetch
  useEffect(() => {
    if (profile) {
      fetchNotifications();
    }
  }, [profile, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    refreshNotifications: fetchNotifications,
  };
}; 