"use client";

import { ProfileSelector } from "@/components/profile/profile-selector";
import { ThemeSwitch } from "@/components/layout/theme-switch";
import { 
  Hash, 
  Users, 
  Plus, 
  MessageCircle,
  Settings,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Temporary mock data
const channels = [
  { id: "1", name: "general" },
  { id: "2", name: "random" },
  { id: "3", name: "introductions" }
];

const directMessages = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" }
];

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };
  
  return (
    <div className="flex flex-col h-full bg-muted/30 border-r border-border w-64">
      {/* Header section */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="font-semibold text-xl">Based App</div>
        <ThemeSwitch />
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
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Channels
          </h3>
          <Button size="icon" variant="ghost" className="h-5 w-5">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <ul className="space-y-1">
          {channels.map(channel => (
            <li key={channel.id}>
              <Link
                href={`/channels/${channel.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                  isActive(`/channels/${channel.id}`)
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 text-foreground"
                )}
              >
                <Hash className="h-4 w-4" />
                <span>{channel.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Direct Messages */}
      <div className="px-2 py-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Direct Messages
          </h3>
          <Button size="icon" variant="ghost" className="h-5 w-5">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <ul className="space-y-1">
          {directMessages.map(dm => (
            <li key={dm.id}>
              <Link
                href={`/dm/${dm.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                  isActive(`/dm/${dm.id}`)
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 text-foreground"
                )}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{dm.name}</span>
              </Link>
            </li>
          ))}
        </ul>
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