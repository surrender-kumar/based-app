"use client";

import { useState } from "react";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { createNotification } from "@/lib/actions/notifications";
import { MOCK_CHANNEL_ID_1 } from "@/mocks/notification-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export default function NotificationTestPage() {
  const { profile } = useCurrentProfile();
  const [title, setTitle] = useState("New test notification");
  const [content, setContent] = useState("This is a test notification message");
  const [type, setType] = useState<"message" | "mention" | "reply">("message");
  const [loading, setLoading] = useState(false);

  const handleCreateNotification = async () => {
    if (!profile) {
      toast.error("Please select a profile first");
      return;
    }

    setLoading(true);
    try {
      const result = await createNotification({
        profileId: profile.id,
        type,
        title,
        content,
        sourceId: uuidv4(),
        sourceType: type === "reply" ? "thread" : "message",
        channelId: MOCK_CHANNEL_ID_1, // Using a default channel ID for testing
        messageId: uuidv4(),
      });

      if (result.success) {
        toast.success("Test notification created!");
        // Don't reset form to allow for quick multiple test creations
      } else {
        toast.error(result.error || "Failed to create notification");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const createMultipleNotifications = async () => {
    if (!profile) {
      toast.error("Please select a profile first");
      return;
    }

    setLoading(true);
    try {
      // Create 5 test notifications
      for (let i = 0; i < 5; i++) {
        await createNotification({
          profileId: profile.id,
          type: ["message", "mention", "reply"][Math.floor(Math.random() * 3)] as "message" | "mention" | "reply",
          title: `Test notification ${i + 1}`,
          content: `This is test notification number ${i + 1}`,
          sourceId: uuidv4(),
          sourceType: Math.random() > 0.5 ? "thread" : "message",
          channelId: MOCK_CHANNEL_ID_1,
          messageId: uuidv4(),
        });
      }
      toast.success("Created 5 test notifications");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Notification Test Panel</CardTitle>
          <CardDescription>
            Create test notifications to verify the notification system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Notification Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter notification content"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Notification Type</Label>
            <Select
              value={type}
              onValueChange={(value: "message" | "mention" | "reply") => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="mention">Mention</SelectItem>
                <SelectItem value="reply">Reply</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2 items-start">
          <div className="flex gap-2 w-full">
            <Button 
              onClick={handleCreateNotification} 
              disabled={loading || !profile}
              className="flex-1"
            >
              Create Notification
            </Button>
            <Button 
              onClick={createMultipleNotifications} 
              disabled={loading || !profile}
              variant="outline"
              className="flex-1"
            >
              Create 5 Random Notifications
            </Button>
          </div>
          {!profile && (
            <p className="text-sm text-red-500">
              Please select a profile from the sidebar first
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 