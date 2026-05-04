/* ============================================
   App — Root Component
   Routes views based on state.
   Wraps with ErrorBoundary & LiveAnnouncer.
   ============================================ */

import { useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context';
import { LiveAnnouncerProvider, useAnnouncer } from './components/LiveAnnouncer';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Landing from './components/Landing';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import StepGuide from './components/StepGuide';
import Eligibility from './components/Eligibility';
import MythsFacts from './components/MythsFacts';
import Deadlines from './components/Deadlines';
import Chat from './components/Chat';
import { trackPageView } from './services/analytics';
import './App.css';

/** Human-readable titles for each view (used for announcements & document title) */
const VIEW_TITLES: Record<string, string> = {
  landing: 'Welcome',
  onboarding: 'Setup Your Profile',
  dashboard: 'Dashboard',
  guide: 'Step-by-Step Voting Guide',
  eligibility: 'Eligibility Checker',
  myths: 'Myths & Facts',
  deadlines: 'Important Deadlines',
  chat: 'AI Election Guide Chat',
};

function AppContent() {
  const { state } = useApp();
  const { currentView } = state;
  const { announce } = useAnnouncer();
  const mainRef = useRef<HTMLDivElement>(null);
  const previousViewRef = useRef<string>(currentView);

  // Announce view changes for screen readers + manage focus + update document title
  useEffect(() => {
    const title = VIEW_TITLES[currentView] || 'Election Companion';
    document.title = `${title} — Election Companion`;

    // Track page view in analytics
    trackPageView(currentView);

    // Only announce and manage focus on actual navigation (not initial render)
    if (previousViewRef.current !== currentView) {
      announce(`Navigated to ${title}`);

      // Move focus to the main content area for keyboard users
      if (mainRef.current) {
        mainRef.current.focus({ preventScroll: true });
      }
    }

    previousViewRef.current = currentView;
  }, [currentView, announce]);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing />;
      case 'onboarding':
        return <Onboarding />;
      case 'dashboard':
        return <Dashboard />;
      case 'guide':
        return <StepGuide />;
      case 'eligibility':
        return <Eligibility />;
      case 'myths':
        return <MythsFacts />;
      case 'deadlines':
        return <Deadlines />;
      case 'chat':
        return <Chat />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="app">
      <a href="#main-content" className="sr-only sr-only--focusable">
        Skip to main content
      </a>
      <Header />
      <div
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        style={{ outline: 'none' }}
        role="region"
        aria-label="Main content"
      >
        {renderView()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LiveAnnouncerProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </LiveAnnouncerProvider>
    </ErrorBoundary>
  );
}
