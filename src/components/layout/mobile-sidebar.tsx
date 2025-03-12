"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageSquare, Users, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import ChannelList from "@/components/channels/channel-list";
import DmList from "@/components/direct-messages/dm-list";
import CreateChannelModal from "@/components/channels/create-channel-modal";
import { toast } from "sonner";

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("channels");
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const { profile } = useCurrentProfile();
  
  // Show sidebar button only on channel and DM pages
  const showSidebarButton = pathname.startsWith("/channels/") || pathname.startsWith("/dm/");
  
  if (!showSidebarButton) return null;
  
  const handleCreateChannelSuccess = (channel: any) => {
    setIsCreateChannelOpen(false);
    toast.success(`Channel ${channel.name} created successfully`);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed bottom-4 right-4 z-50 md:hidden h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 md:hidden w-72 max-w-full">
          <div className="flex flex-col h-full overflow-hidden">
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab}
              className="flex flex-col h-full overflow-hidden"
            >
              <TabsList className="flex w-full h-12 bg-muted/30 border-b border-border rounded-none p-0">
                <TabsTrigger 
                  value="channels" 
                  className="flex-1 h-full rounded-none data-[state=active]:bg-background"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Channels
                </TabsTrigger>
                <TabsTrigger 
                  value="dms" 
                  className="flex-1 h-full rounded-none data-[state=active]:bg-background"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent 
                value="channels" 
                className="flex-1 px-2 py-4 overflow-y-auto space-y-4 mt-0"
              >
                {profile && (
                  <Button 
                    onClick={() => setIsCreateChannelOpen(true)}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Channel</span>
                  </Button>
                )}
                <ChannelList 
                  onSelect={() => setOpen(false)}
                />
              </TabsContent>
              
              <TabsContent 
                value="dms" 
                className="flex-1 px-2 py-4 overflow-y-auto mt-0"
              >
                <DmList 
                  onSelect={() => setOpen(false)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
      
      {profile && (
        <CreateChannelModal
          isOpen={isCreateChannelOpen}
          onClose={() => setIsCreateChannelOpen(false)}
          onCreateSuccess={handleCreateChannelSuccess}
          profileId={profile.id}
        />
      )}
    </>
  );
} 