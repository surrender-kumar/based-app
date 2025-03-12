"use client";

import { usePreferences } from "@/hooks/use-preferences";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSettings() {
  const { preferences, loading, toggleNotificationSetting } = usePreferences();

  // Toggle handlers
  const handleToggleNotifications = async () => {
    await toggleNotificationSetting('notificationsEnabled');
  };

  const handleToggleMessageNotifications = async () => {
    await toggleNotificationSetting('notifyOnMessage');
  };

  const handleToggleMentionNotifications = async () => {
    await toggleNotificationSetting('notifyOnMention');
  };

  const handleToggleReplyNotifications = async () => {
    await toggleNotificationSetting('notifyOnReply');
  };

  // Loading state
  if (loading || !preferences) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you want to receive notifications
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you want to receive notifications
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        {/* Enable/disable all notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base" htmlFor="notifications">Enable notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications for activity in your channels and messages
            </p>
          </div>
          <Switch
            id="notifications"
            checked={preferences.notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
        
        {/* Only show detailed settings if notifications are enabled */}
        {preferences.notificationsEnabled && (
          <>
            <Separator className="my-4" />
            
            {/* New message notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base" htmlFor="messageNotifications">Channel messages</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new messages in your channels
                </p>
              </div>
              <Switch
                id="messageNotifications"
                checked={preferences.notifyOnMessage}
                onCheckedChange={handleToggleMessageNotifications}
                disabled={!preferences.notificationsEnabled}
              />
            </div>
            
            {/* Mention notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base" htmlFor="mentionNotifications">Mentions</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone mentions you in a channel
                </p>
              </div>
              <Switch
                id="mentionNotifications"
                checked={preferences.notifyOnMention}
                onCheckedChange={handleToggleMentionNotifications}
                disabled={!preferences.notificationsEnabled}
              />
            </div>
            
            {/* Reply notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base" htmlFor="replyNotifications">Thread replies</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone replies to your messages
                </p>
              </div>
              <Switch
                id="replyNotifications"
                checked={preferences.notifyOnReply}
                onCheckedChange={handleToggleReplyNotifications}
                disabled={!preferences.notificationsEnabled}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 