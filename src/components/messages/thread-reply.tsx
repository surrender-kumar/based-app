"use client";

import { FormEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send, Loader2 } from "lucide-react";
import { Profile } from "../../types";
import { sendThreadMessage } from "../../lib/actions/thread-messages";
import { toast } from "sonner";
import { formatMessage } from "../../lib/formatters/message-formatter";

interface ThreadReplyProps {
  messageId: string;
  profile: Profile | null;
}

export default function ThreadReply({ messageId, profile }: ThreadReplyProps) {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Handle content change
  const handleContentChange = (value: string) => {
    setContent(value);
    
    if (showPreview) {
      setPreview(formatMessage(value));
    }
  };
  
  // Toggle preview
  const togglePreview = () => {
    if (!showPreview && content) {
      setPreview(formatMessage(content));
    }
    setShowPreview(!showPreview);
  };
  
  // Handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !profile) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await sendThreadMessage({
        content: content.trim(),
        messageId,
        profileId: profile.id
      });
      
      if (result.success) {
        setContent("");
        setPreview("");
        setShowPreview(false);
        toast.success("Reply sent");
      } else {
        toast.error(result.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("[SEND_THREAD_REPLY_ERROR]", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="px-4 py-4 border-t">
      <form onSubmit={handleSubmit}>
        {showPreview ? (
          <div className="border rounded-md p-3 mb-2 min-h-[100px] prose prose-sm dark:prose-invert max-w-none">
            {preview ? (
              <div dangerouslySetInnerHTML={{ __html: preview }} />
            ) : (
              <p className="text-muted-foreground">Nothing to preview</p>
            )}
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Reply in thread..."
            className="min-h-[100px] resize-none"
            disabled={isSubmitting || !profile}
          />
        )}
        
        <div className="flex justify-between mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={togglePreview}
            disabled={isSubmitting}
          >
            {showPreview ? "Edit" : "Preview"}
          </Button>
          
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting || !profile}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Reply
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 