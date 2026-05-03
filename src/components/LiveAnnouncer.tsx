/* ============================================
   Live Announcer — Screen Reader Notifications
   Provides accessible announcements for dynamic
   content changes (view switches, actions, etc.)
   ============================================ */

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

type Politeness = 'polite' | 'assertive';

interface AnnouncerContextType {
  announce: (message: string, politeness?: Politeness) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

/**
 * Hook for announcing messages to screen readers.
 * Must be used within a LiveAnnouncerProvider.
 */
export function useAnnouncer(): AnnouncerContextType {
  const context = useContext(AnnouncerContext);
  if (!context) {
    throw new Error('useAnnouncer must be used within a LiveAnnouncerProvider');
  }
  return context;
}

/**
 * Provider that renders hidden ARIA live regions and
 * exposes an `announce()` function via context.
 */
export function LiveAnnouncerProvider({ children }: { children: ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const announce = useCallback((message: string, politeness: Politeness = 'polite') => {
    // Clear previous message briefly to force re-announcement of the same text
    if (politeness === 'polite') {
      setPoliteMessage('');
    } else {
      setAssertiveMessage('');
    }

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new message after a brief delay so the empty string is registered first
    timeoutRef.current = setTimeout(() => {
      if (politeness === 'polite') {
        setPoliteMessage(message);
      } else {
        setAssertiveMessage(message);
      }
    }, 100);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Hidden live regions for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="live-announcer-polite"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        data-testid="live-announcer-assertive"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}
