"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useThreadContext } from './use-thread-context';
import { toast } from 'sonner';

interface KeyboardShortcutsOptions {
  enabled?: boolean;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const { enabled = true } = options;
  const router = useRouter();
  const { isInThread, threadChannelId } = useThreadContext();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the event target is an input field
      const target = event.target as HTMLElement;
      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      // Skip shortcuts when typing in input fields
      if (isInputField) return;

      // Ctrl+K or Cmd+K - Focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          toast.info('Search activated (Ctrl/Cmd+K)');
        }
      }

      // Escape - Exit thread view
      if (event.key === 'Escape' && isInThread && threadChannelId) {
        event.preventDefault();
        router.push(`/channels/${threadChannelId}`);
        toast.info('Exited thread view (Esc)');
      }

      // Alt+Up - Navigate to previous channel or DM
      if (event.altKey && event.key === 'ArrowUp') {
        event.preventDefault();
        // This would need to be implemented with channel navigation logic
        toast.info('Keyboard shortcut: Alt+Up (go to previous channel)');
      }

      // Alt+Down - Navigate to next channel or DM
      if (event.altKey && event.key === 'ArrowDown') {
        event.preventDefault();
        // This would need to be implemented with channel navigation logic
        toast.info('Keyboard shortcut: Alt+Down (go to next channel)');
      }

      // Ctrl+/ or Cmd+/ - Show keyboard shortcuts help
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        showKeyboardShortcutsHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, router, isInThread, threadChannelId]);

  const showKeyboardShortcutsHelp = () => {
    toast.info(
      <div className="space-y-2">
        <h3 className="font-semibold">Keyboard Shortcuts</h3>
        <ul className="text-sm space-y-1">
          <li><span className="font-mono bg-muted px-1 rounded">Ctrl/Cmd+K</span> Search</li>
          <li><span className="font-mono bg-muted px-1 rounded">Esc</span> Exit thread view</li>
          <li><span className="font-mono bg-muted px-1 rounded">Alt+↑</span> Previous channel</li>
          <li><span className="font-mono bg-muted px-1 rounded">Alt+↓</span> Next channel</li>
          <li><span className="font-mono bg-muted px-1 rounded">Ctrl/Cmd+/</span> Show shortcuts</li>
        </ul>
      </div>,
      { duration: 8000 }
    );
  };

  return { showKeyboardShortcutsHelp };
} 