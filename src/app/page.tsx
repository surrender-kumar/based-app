"use client";

import { useCurrentProfile, ProfileContextType } from "@/hooks/use-current-profile";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hash, MessageCircle } from "lucide-react";

export default function Home() {
  const { profile, isLoading } = useCurrentProfile() as ProfileContextType;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Based App</h1>
        
        {isLoading ? (
          <div className="animate-pulse h-4 bg-muted rounded w-1/2 mx-auto" />
        ) : profile ? (
          <p className="text-xl">
            Welcome back, <span className="font-medium">{profile.name}</span>!
          </p>
        ) : (
          <p className="text-muted-foreground">
            Select a profile to get started
          </p>
        )}
        
        <div className="mt-8 space-y-2">
          <h2 className="text-lg font-medium">Quick Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link href="/channels/1" className="w-full">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
              >
                <Hash className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">general</div>
                  <div className="text-xs text-muted-foreground">The main chat channel</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dm/1" className="w-full">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">John Doe</div>
                  <div className="text-xs text-muted-foreground">Direct message</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="pt-8 text-sm text-muted-foreground">
          <p>
            Visit the <Link href="/profile-test" className="underline">Profile Test</Link> or <Link href="/ui-test" className="underline">UI Test</Link> pages to test components.
          </p>
        </div>
      </div>
    </div>
  );
}
