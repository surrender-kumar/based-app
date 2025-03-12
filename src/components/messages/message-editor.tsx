"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Paperclip, Send, Bold, Italic, Code, Strikethrough, Link } from "lucide-react";
import { cn } from "../../lib/utils";
import { toast } from "sonner";
import { Profile } from "../../types";
import { sendMessage } from "../../lib/actions/messages";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "../ui/tooltip";

interface MessageEditorProps {
  channelId: string;
  profile: Profile | null;
  placeholder?: string;
  onMessageSent?: () => void;
}

export default function MessageEditor({
  channelId,
  profile,
  placeholder = "Write a message...",
  onMessageSent
}: MessageEditorProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0";
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 40),
        200
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content]);

  // Handle message send
  const handleSend = async () => {
    if (!profile) {
      toast.error("Please select a profile to send messages");
      return;
    }

    if (!content.trim()) return;

    setIsSending(true);
    try {
      const result = await sendMessage({
        content: content.trim(),
        channelId,
        profileId: profile.id
      });

      if (result.success) {
        setContent("");
        onMessageSent?.();
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("[SEND_MESSAGE_ERROR]", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Insert formatting at cursor position
  const insertFormatting = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    // If text is selected, wrap it with formatting
    if (selectedText) {
      setContent(beforeText + prefix + selectedText + suffix + afterText);
      // Set cursor position after formatting
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          end + prefix.length
        );
      }, 0);
    } else {
      // If no text is selected, just insert the formatting markers
      setContent(beforeText + prefix + suffix + afterText);
      // Place cursor between the formatting markers
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length
        );
      }, 0);
    }
  };

  const handleBold = () => insertFormatting("**", "**");
  const handleItalic = () => insertFormatting("*", "*");
  const handleCode = () => insertFormatting("`", "`");
  const handleStrikethrough = () => insertFormatting("~~", "~~");
  const handleLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      if (!textareaRef.current) return;
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const beforeText = content.substring(0, start);
      const afterText = content.substring(end);
      
      const linkText = selectedText || "link text";
      setContent(beforeText + `[${linkText}](${url})` + afterText);
    }
  };

  return (
    <div className="border rounded-md p-2 bg-background">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="min-h-[40px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
        disabled={isSending || !profile}
      />
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBold}
                  disabled={isSending || !profile}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Bold (Ctrl+B)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleItalic}
                  disabled={isSending || !profile}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Italic (Ctrl+I)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCode}
                  disabled={isSending || !profile}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Code (Ctrl+Shift+C)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleStrikethrough}
                  disabled={isSending || !profile}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Strikethrough</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleLink}
                  disabled={isSending || !profile}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Link (Ctrl+K)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={true} // Not implemented yet
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach file (coming soon)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Button
          onClick={handleSend}
          size="sm"
          className={cn("gap-1", (!content.trim() || !profile) && "opacity-50")}
          disabled={!content.trim() || isSending || !profile}
        >
          <span>Send</span>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 