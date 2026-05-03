/* ============================================
   Analytics Service — Firebase Analytics Integration
   Tracks user interactions for improving the
   election education experience.
   Non-PII, aggregated event data only.
   ============================================ */

import { analytics } from '../firebase';
import { logEvent as firebaseLogEvent, type Analytics } from 'firebase/analytics';
import type { AppView, VoterStatus, UserGoal } from '../types';

/**
 * Safely log a Firebase Analytics event.
 * Gracefully degrades if analytics is unavailable (e.g. SSR, ad-blockers).
 */
function safeLogEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  try {
    if (analytics) {
      firebaseLogEvent(analytics as Analytics, eventName, params);
    }
  } catch {
    // Analytics may be blocked by ad-blockers or privacy settings.
    // Fail silently — analytics is non-critical.
  }
}

/* ── Navigation Events ── */

export function trackPageView(view: AppView): void {
  safeLogEvent('page_view', {
    page_title: view,
    page_location: window.location.href,
  });
}

export function trackNavigation(from: AppView, to: AppView): void {
  safeLogEvent('navigate', {
    from_view: from,
    to_view: to,
  });
}

/* ── Onboarding Events ── */

export function trackOnboardingStart(): void {
  safeLogEvent('onboarding_start');
}

export function trackOnboardingComplete(state: string, voterStatus: VoterStatus, goal: UserGoal | null): void {
  safeLogEvent('onboarding_complete', {
    user_state: state,
    voter_status: voterStatus,
    goal: goal ?? 'none',
  });
}

export function trackOnboardingStep(step: string): void {
  safeLogEvent('onboarding_step', {
    step_name: step,
  });
}

/* ── Step Guide Events ── */

export function trackStepComplete(stepId: string): void {
  safeLogEvent('step_completed', {
    step_id: stepId,
  });
}

export function trackStepUncomplete(stepId: string): void {
  safeLogEvent('step_uncompleted', {
    step_id: stepId,
  });
}

/* ── Eligibility Events ── */

export function trackEligibilityCheck(itemId: string, checked: boolean): void {
  safeLogEvent('eligibility_check', {
    item_id: itemId,
    is_checked: checked,
  });
}

export function trackEligibilityComplete(): void {
  safeLogEvent('eligibility_all_met');
}

/* ── Chat Events ── */

export function trackChatMessage(isAI: boolean): void {
  safeLogEvent('chat_message', {
    sender: isAI ? 'assistant' : 'user',
  });
}

export function trackChatQuickQuestion(questionKey: string): void {
  safeLogEvent('chat_quick_question', {
    question_key: questionKey,
  });
}

export function trackChatFallback(reason: string): void {
  safeLogEvent('chat_fallback', {
    fallback_reason: reason,
  });
}

/* ── Myth Card Events ── */

export function trackMythFlip(mythId: string): void {
  safeLogEvent('myth_card_flip', {
    myth_id: mythId,
  });
}

export function trackMythCategoryFilter(category: string): void {
  safeLogEvent('myth_category_filter', {
    category,
  });
}

/* ── User Profile Events ── */

export function trackProfileReset(): void {
  safeLogEvent('profile_reset');
}

/* ── Error Events ── */

export function trackError(errorType: string, errorMessage: string): void {
  safeLogEvent('app_error', {
    error_type: errorType,
    error_message: errorMessage.slice(0, 100),
  });
}
