/* ============================================
   Test Helpers — Shared utilities for tests
   ============================================ */
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { AppProvider } from '../context';
import { LiveAnnouncerProvider } from '../components/LiveAnnouncer';

/**
 * Wraps children with all required providers (AppProvider + LiveAnnouncerProvider).
 */
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <LiveAnnouncerProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </LiveAnnouncerProvider>
  );
}

/**
 * Custom render that wraps components with all application providers.
 * Use this instead of RTL's render for component tests that need context.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Creates a wrapper for renderHook that includes all providers.
 */
export function createProviderWrapper() {
  return AllProviders;
}
