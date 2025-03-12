"use server";

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import { mockNotifications, Notification } from "../../mocks/notification-data";

/**
 * Get all notifications for a user
 */
export async function getNotifications(profileId: string) {
  try {
    // In a real app, we would query the database for notifications
    const notifications = mockNotifications
      .filter(notification => notification.profileId === profileId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return { success: true, data: notifications };
  } catch (error) {
    console.error("[GET_NOTIFICATIONS_ERROR]", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(profileId: string) {
  try {
    const unreadCount = mockNotifications
      .filter(notification => notification.profileId === profileId && !notification.isRead)
      .length;
    
    return { success: true, data: unreadCount };
  } catch (error) {
    console.error("[GET_UNREAD_COUNT_ERROR]", error);
    return { success: false, error: "Failed to fetch unread count" };
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string) {
  try {
    // In a real app, we would update the database
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex !== -1) {
      mockNotifications[notificationIndex].isRead = true;
      mockNotifications[notificationIndex].updatedAt = new Date();
      
      revalidatePath("/");
      return { success: true };
    }
    
    return { success: false, error: "Notification not found" };
  } catch (error) {
    console.error("[MARK_AS_READ_ERROR]", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(profileId: string) {
  try {
    // In a real app, we would update the database
    mockNotifications
      .filter(notification => notification.profileId === profileId && !notification.isRead)
      .forEach(notification => {
        notification.isRead = true;
        notification.updatedAt = new Date();
      });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[MARK_ALL_AS_READ_ERROR]", error);
    return { success: false, error: "Failed to mark all notifications as read" };
  }
}

/**
 * Create a new notification
 */
export async function createNotification({
  profileId,
  type,
  title,
  content,
  sourceId,
  sourceType,
  channelId,
  messageId,
}: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>) {
  try {
    // In a real app, we would insert into the database
    const newNotification: Notification = {
      id: uuidv4(),
      profileId,
      type,
      title,
      content,
      isRead: false,
      sourceId,
      sourceType,
      channelId,
      messageId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockNotifications.push(newNotification);
    
    revalidatePath("/");
    return { success: true, data: newNotification };
  } catch (error) {
    console.error("[CREATE_NOTIFICATION_ERROR]", error);
    return { success: false, error: "Failed to create notification" };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    // In a real app, we would delete from the database
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex !== -1) {
      mockNotifications.splice(notificationIndex, 1);
      
      revalidatePath("/");
      return { success: true };
    }
    
    return { success: false, error: "Notification not found" };
  } catch (error) {
    console.error("[DELETE_NOTIFICATION_ERROR]", error);
    return { success: false, error: "Failed to delete notification" };
  }
} 