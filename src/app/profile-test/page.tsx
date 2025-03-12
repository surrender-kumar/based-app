'use client';

import { ProfileSelector } from "@/components/profile/profile-selector";
import { useCurrentProfile, ProfileContextType } from "@/hooks/use-current-profile";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function ProfileTestPage() {
  const { profile, isLoading } = useCurrentProfile() as ProfileContextType;

  const handleTestAction = () => {
    if (profile) {
      toast.success(`Action performed as ${profile.name}`);
    } else {
      toast.error("No profile selected");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/20">
      <div className="max-w-md w-full mx-auto p-6 space-y-8 bg-background rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Profile Selector</h1>
        
        <div className="flex justify-center py-4">
          <ProfileSelector />
        </div>

        <div className="bg-card p-5 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4 text-center">Profile Details</h2>
          
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded mx-auto" />
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded mx-auto" />
            </div>
          ) : profile ? (
            <div className="space-y-3">
              <p className="text-sm"><span className="font-medium">Name:</span> {profile.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {profile.email}</p>
              <p className="text-sm"><span className="font-medium">Profile ID:</span> {profile.id}</p>
              <div className="mt-6 flex justify-center">
                <Button onClick={handleTestAction} className="w-full">
                  Perform Action as {profile.name}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No profile selected</p>
          )}
        </div>
      </div>
    </div>
  );
} 