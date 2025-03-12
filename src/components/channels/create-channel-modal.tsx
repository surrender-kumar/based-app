"use client";

import { useState } from "react";
import { createChannel } from "@/lib/actions/channels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Using a type that matches the database schema
type Channel = {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: (channel: Channel) => void;
  profileId: string;
}

export default function CreateChannelModal({
  isOpen,
  onClose,
  onCreateSuccess,
  profileId,
}: CreateChannelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Channel name cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createChannel({
        name: name.trim(),
        description: description.trim() || undefined,
        isPrivate,
        createdById: profileId,
      });
      
      if (result.success && result.data) {
        toast.success("Channel created successfully");
        onCreateSuccess(result.data);
        resetForm();
      } else {
        toast.error(result.error || "Failed to create channel");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("[CREATE_CHANNEL_ERROR]", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName("");
    setDescription("");
    setIsPrivate(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new channel</DialogTitle>
            <DialogDescription>
              Create a new channel for your team to collaborate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="required">
                Channel Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. announcements"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description <span className="text-xs text-gray-500">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this channel about?"
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={(checked: boolean) => setIsPrivate(checked)}
                disabled={isSubmitting}
              />
              <Label htmlFor="isPrivate" className="cursor-pointer">
                Make this channel private
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 