"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Users, Settings, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileSelector } from "@/components/profile/profile-selector";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitch } from "@/components/layout/theme-switch";
import { NotificationBadge } from "@/components/notifications/notification-badge";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home
    },
    {
      href: "/channels",
      label: "Channels",
      icon: MessageSquare
    },
    {
      href: "/dm",
      label: "Messages",
      icon: Users
    },
    {
      href: "/search",
      label: "Search",
      icon: Search
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings
    }
  ];

  return (
    <div className="sticky top-0 z-50 bg-background">
      <div className="flex h-14 items-center px-4 border-b border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 flex flex-col">
                <div className="p-4 border-b border-border">
                  <ProfileSelector />
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <nav className="flex flex-col gap-2">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                          isActive(route.href)
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <route.icon className="h-4 w-4" />
                        {route.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="font-semibold text-xl">
              Based App
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBadge />
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  );
} 