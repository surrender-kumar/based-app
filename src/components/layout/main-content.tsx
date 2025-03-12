"use client";

import { usePathname } from "next/navigation";
import { MessageInput } from "@/components/layout/message-input";

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  const pathname = usePathname();
  
  // Skip showing message input on special pages
  const hideMessageInput = [
    "/settings",
    "/search",
    "/profile-test",
    "/ui-test"
  ].includes(pathname);

  // Get channel or conversation name from path
  const getTitle = () => {
    if (pathname.startsWith("/channels/")) {
      const channelId = pathname.split("/").pop();
      // Mock data - this would be fetched from API
      const channelNames: Record<string, string> = {
        "1": "general",
        "2": "random",
        "3": "introductions"
      };
      return `# ${channelNames[channelId || ""] || "unknown"}`;
    }
    
    if (pathname.startsWith("/dm/")) {
      const userId = pathname.split("/").pop();
      // Mock data - this would be fetched from API
      const userNames: Record<string, string> = {
        "1": "John Doe",
        "2": "Jane Smith"
      };
      return userNames[userId || ""] || "Unknown User";
    }
    
    // Default for other pages
    return "";
  };

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Header */}
      {getTitle() && (
        <div className="h-14 border-b border-border px-4 flex items-center">
          <h1 className="font-semibold text-lg">{getTitle()}</h1>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Message input */}
      {!hideMessageInput && (
        <div className="p-4 border-t border-border">
          <MessageInput />
        </div>
      )}
    </div>
  );
}; 