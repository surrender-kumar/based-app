"use client";

import { ReactNode } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  
  return <>{children}</>;
} 