/* ============================================
   Test Setup — Global mocks & matchers
   ============================================ */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

// Mock Element.scrollIntoView (not available in jsdom)
Element.prototype.scrollIntoView = vi.fn();

// Mock Firebase modules
vi.mock('./firebase', () => ({
  app: {},
  db: {},
  analytics: null,
  submitFeedback: vi.fn().mockResolvedValue('mock-id'),
  logUsageEvent: vi.fn().mockResolvedValue(undefined),
  getRecentFeedback: vi.fn().mockResolvedValue([]),
}));

// Mock analytics service
vi.mock('./services/analytics', () => ({
  trackPageView: vi.fn(),
  trackNavigation: vi.fn(),
  trackOnboardingStart: vi.fn(),
  trackOnboardingComplete: vi.fn(),
  trackOnboardingStep: vi.fn(),
  trackStepComplete: vi.fn(),
  trackStepUncomplete: vi.fn(),
  trackEligibilityCheck: vi.fn(),
  trackEligibilityComplete: vi.fn(),
  trackChatMessage: vi.fn(),
  trackChatQuickQuestion: vi.fn(),
  trackChatFallback: vi.fn(),
  trackMythFlip: vi.fn(),
  trackMythCategoryFilter: vi.fn(),
  trackProfileReset: vi.fn(),
  trackError: vi.fn(),
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
