import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.unmock('../services/analytics');
vi.unmock('../firebase');

import * as analytics from '../services/analytics';
import * as firebaseAnalytics from 'firebase/analytics';
import type { AppView } from '../types';

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(),
}));

vi.mock('../firebase', () => ({
  analytics: {}, // mock analytics object
}));

describe('Analytics Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('trackPageView should log event', () => {
    analytics.trackPageView('dashboard' as AppView);
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'page_view', expect.anything());
  });

  it('trackNavigation should log event', () => {
    analytics.trackNavigation('onboarding' as AppView, 'dashboard' as AppView);
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'navigate', expect.anything());
  });

  it('trackOnboardingStart should log event', () => {
    analytics.trackOnboardingStart();
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'onboarding_start', undefined);
  });

  it('trackOnboardingComplete should log event', () => {
    analytics.trackOnboardingComplete('Delhi', 'registered', 'register');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'onboarding_complete', expect.anything());
  });

  it('trackOnboardingStep should log event', () => {
    analytics.trackOnboardingStep('step1');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'onboarding_step', expect.anything());
  });

  it('trackStepComplete should log event', () => {
    analytics.trackStepComplete('step1');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'step_completed', expect.anything());
  });

  it('trackStepUncomplete should log event', () => {
    analytics.trackStepUncomplete('step1');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'step_uncompleted', expect.anything());
  });

  it('trackEligibilityCheck should log event', () => {
    analytics.trackEligibilityCheck('item1', true);
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'eligibility_check', expect.anything());
  });

  it('trackEligibilityComplete should log event', () => {
    analytics.trackEligibilityComplete();
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'eligibility_all_met', undefined);
  });

  it('trackChatMessage should log event', () => {
    analytics.trackChatMessage(true);
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'chat_message', expect.anything());
  });

  it('trackChatQuickQuestion should log event', () => {
    analytics.trackChatQuickQuestion('q1');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'chat_quick_question', expect.anything());
  });

  it('trackChatFallback should log event', () => {
    analytics.trackChatFallback('error');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'chat_fallback', expect.anything());
  });

  it('trackMythFlip should log event', () => {
    analytics.trackMythFlip('myth1');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'myth_card_flip', expect.anything());
  });

  it('trackMythCategoryFilter should log event', () => {
    analytics.trackMythCategoryFilter('general');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'myth_category_filter', expect.anything());
  });

  it('trackProfileReset should log event', () => {
    analytics.trackProfileReset();
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'profile_reset', undefined);
  });

  it('trackError should log event', () => {
    analytics.trackError('ui_error', 'message');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'app_error', expect.anything());
  });
});
