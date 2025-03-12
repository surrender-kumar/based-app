"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePreferences } from "@/hooks/use-preferences";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeSettings() {
  const { theme: systemTheme, setTheme } = useTheme();
  const { preferences, updateTheme } = usePreferences();
  const [mounted, setMounted] = useState(false);

  // Make sure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme options
  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Light mode with bright background"
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Dark mode with dimmed background"
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Follow your system preferences"
    }
  ];

  // Handle theme change
  const handleThemeChange = async (value: string) => {
    // Update the next-themes theme
    setTheme(value);
    
    // Only update preferences if we have a profile
    if (preferences) {
      await updateTheme(value as 'light' | 'dark' | 'system');
    }
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how the app looks on your device
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <RadioGroup 
          defaultValue={preferences?.theme || systemTheme || "system"} 
          onValueChange={handleThemeChange}
          className="grid gap-4 md:grid-cols-3"
        >
          {themeOptions.map((option) => (
            <div key={option.value}>
              <RadioGroupItem
                value={option.value}
                id={`theme-${option.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`theme-${option.value}`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <option.icon className="mb-3 h-6 w-6" />
                <div className="text-center space-y-1">
                  <p className="font-medium leading-none">{option.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
} 