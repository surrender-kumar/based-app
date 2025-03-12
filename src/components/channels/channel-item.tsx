"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hash, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ChannelItemProps {
  channel: Channel;
}

export default function ChannelItem({ channel }: ChannelItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/channels/${channel.id}`;
  
  return (
    <Link
      href={`/channels/${channel.id}`}
      className={cn(
        "group px-3 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        isActive && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <div className="flex items-center justify-center w-5 h-5">
        {channel.isPrivate ? (
          <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <Hash className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
      <p className={cn(
        "line-clamp-1 font-medium text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
        isActive && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
      )}>
        {channel.name}
      </p>
    </Link>
  );
} 