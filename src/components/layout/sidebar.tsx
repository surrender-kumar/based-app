"use client";

import { ProfileSelector } from "@/components/profile/profile-selector";
import { ThemeSwitch } from "@/components/layout/theme-switch";
import { 
  Settings,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ChannelList from "../channels/channel-list";
import { useState } from "react";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import DmList from "../direct-messages/dm-list";
import { NotificationBadge } from "../notifications/notification-badge";

export const Sidebar = () => {
  const pathname = usePathname();
  const { profile } = useCurrentProfile();

  const isActive = (href: string) => {
    return pathname === href;
  };
  
  return (
    <div className="flex flex-col h-full bg-muted/30 border-r border-border w-64">
      {/* Header section */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="font-semibold text-xl">Based App</div>
        <div className="flex items-center gap-2">
          <NotificationBadge />
          <ThemeSwitch />
        </div>
      </div>
      
      {/* Profile section */}
      <div className="flex items-center justify-center p-4 border-b border-border">
        <ProfileSelector />
      </div>
      
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search" 
            className="pl-8 bg-background text-sm"
          />
        </div>
      </div>
      
      {/* Channels */}
      <div className="px-2 py-3">
        <ChannelList />
      </div>
      
      {/* Direct Messages */}
      <div className="px-2 py-3">
        <DmList />
      </div>
      
      {/* Settings */}
      <div className="mt-auto p-2 border-t border-border">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 px-2 py-2 rounded-md text-sm w-full",
            isActive("/settings")
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 text-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}; 