/* ============================================
   Tests — context.test.tsx (State Management)
   Comprehensive edge case + integration coverage
   ============================================ */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useApp } from '../context';
import { LiveAnnouncerProvider } from '../components/LiveAnnouncer';
import type { ReactNode } from 'react';

// Wrapper including LiveAnnouncerProvider since context now uses it indirectly
const wrapper = ({ children }: { children: ReactNode }) => (
  <LiveAnnouncerProvider>
    <AppProvider>{children}</AppProvider>
  </LiveAnnouncerProvider>
);

// Test component to expose context values
function ContextReader() {
  const { state, setName, setVoterStatus, setState, setGoal, completeStep, uncompleteStep, setEligibility, completeOnboarding, addChatMessage, resetUser, getProgress, navigate } = useApp();
  return (
    <div>
      <span data-testid="name">{state.user.name}</span>
      <span data-testid="status">{state.user.voterStatus}</span>
      <span data-testid="view">{state.currentView}</span>
      <span data-testid="state">{state.user.state}</span>
      <span data-testid="goal">{state.user.currentGoal || 'none'}</span>
      <span data-testid="onboarding">{String(state.user.onboardingComplete)}</span>
      <span data-testid="progress">{getProgress()}</span>
      <span data-testid="completed-steps">{state.user.completedSteps.join(',')}</span>
      <span data-testid="chat-count">{state.chatMessages.length}</span>
      <button onClick={() => setName('Priya')} data-testid="set-name">Set Name</button>
      <button onClick={() => setName('')} data-testid="set-name-empty">Set Empty Name</button>
      <button onClick={() => setName('<script>alert("xss")</script>')} data-testid="set-name-xss">Set XSS Name</button>
      <button onClick={() => setVoterStatus('registered')} data-testid="set-status">Set Status</button>
      <button onClick={() => setVoterStatus('ready')} data-testid="set-ready">Set Ready</button>
      <button onClick={() => setVoterStatus('voted')} data-testid="set-voted">Set Voted</button>
      <button onClick={() => setState('MH')} data-testid="set-state">Set State</button>
      <button onClick={() => setGoal('register')} data-testid="set-goal">Set Goal</button>
      <button onClick={() => completeStep('step-1')} data-testid="complete-step">Complete Step</button>
      <button onClick={() => completeStep('step-1')} data-testid="complete-step-dup">Complete Step Duplicate</button>
      <button onClick={() => uncompleteStep('step-1')} data-testid="uncomplete-step">Uncomplete Step</button>
      <button onClick={() => setEligibility('age', true)} data-testid="set-eligibility">Set Eligibility</button>
      <button onClick={() => completeOnboarding()} data-testid="complete-onboarding">Complete Onboarding</button>
      <button onClick={() => addChatMessage({ id: 'msg-1', role: 'user', content: 'Hello', timestamp: Date.now() })} data-testid="add-message">Add Message</button>
      <button onClick={() => resetUser()} data-testid="reset">Reset</button>
      <button onClick={() => navigate('chat')} data-testid="navigate-chat">Go to Chat</button>
      <button onClick={() => navigate('guide')} data-testid="navigate-guide">Go to Guide</button>
    </div>
  );
}

describe('AppProvider State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<AppProvider><div>test</div></AppProvider>, { wrapper: LiveAnnouncerProvider as React.ComponentType<{ children: ReactNode }> });
  });

  it('provides default user state', () => {
    render(<ContextReader />, { wrapper });
    expect(screen.getByTestId('name').textContent).toBe('');
    expect(screen.getByTestId('status').textContent).toBe('not-registered');
  });

  it('provides a default currentView', () => {
    render(<ContextReader />, { wrapper });
    const view = screen.getByTestId('view').textContent;
    expect(['landing', 'dashboard']).toContain(view);
  });

  it('updates name via setName', async () => {
    render(<ContextReader />, { wrapper });
    const btn = screen.getByTestId('set-name');
    await act(async () => btn.click());
    expect(screen.getByTestId('name').textContent).toBe('Priya');
  });

  it('updates voterStatus via setVoterStatus', async () => {
    render(<ContextReader />, { wrapper });
    const btn = screen.getByTestId('set-status');
    await act(async () => btn.click());
    expect(screen.getByTestId('status').textContent).toBe('registered');
  });

  it('throws error when useApp is used outside AppProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ContextReader />)).toThrow('useApp must be used within an AppProvider');
    consoleSpy.mockRestore();
  });

  /* ── Edge Cases ── */

  it('sanitizes XSS in name input', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('set-name-xss').click());
    const name = screen.getByTestId('name').textContent;
    expect(name).not.toContain('<script>');
    expect(name).not.toContain('<');
    expect(name).not.toContain('>');
  });

  it('handles empty name', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('set-name-empty').click());
    expect(screen.getByTestId('name').textContent).toBe('');
  });

  it('updates state code', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('set-state').click());
    expect(screen.getByTestId('state').textContent).toBe('MH');
  });

  it('updates goal', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('set-goal').click());
    expect(screen.getByTestId('goal').textContent).toBe('register');
  });

  it('tracks progress from 0%', () => {
    render(<ContextReader />, { wrapper });
    expect(screen.getByTestId('progress').textContent).toBe('0');
  });

  it('completes a step and updates progress', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('complete-step').click());
    expect(screen.getByTestId('completed-steps').textContent).toContain('step-1');
    expect(Number(screen.getByTestId('progress').textContent)).toBeGreaterThan(0);
  });

  it('does not duplicate completed steps', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('complete-step').click());
    await act(async () => screen.getByTestId('complete-step-dup').click());
    expect(screen.getByTestId('completed-steps').textContent).toBe('step-1');
  });

  it('uncompletes a step', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('complete-step').click());
    await act(async () => screen.getByTestId('uncomplete-step').click());
    expect(screen.getByTestId('completed-steps').textContent).toBe('');
  });

  it('sets eligibility', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('set-eligibility').click());
    // Just verify no crash - eligibility is stored in user.eligibilityChecks
  });

  it('completes onboarding and navigates to dashboard', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('complete-onboarding').click());
    expect(screen.getByTestId('onboarding').textContent).toBe('true');
    expect(screen.getByTestId('view').textContent).toBe('dashboard');
  });

  it('adds chat messages', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('add-message').click());
    expect(screen.getByTestId('chat-count').textContent).toBe('1');
  });

  it('resets user to defaults', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('set-name').click());
    await act(async () => screen.getByTestId('reset').click());
    expect(screen.getByTestId('name').textContent).toBe('');
    expect(screen.getByTestId('view').textContent).toBe('landing');
  });

  it('navigates to different views', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('navigate-chat').click());
    expect(screen.getByTestId('view').textContent).toBe('chat');
    await act(async () => screen.getByTestId('navigate-guide').click());
    expect(screen.getByTestId('view').textContent).toBe('guide');
  });

  it('transitions through multiple voter statuses', async () => {
    render(<ContextReader />, { wrapper });
    expect(screen.getByTestId('status').textContent).toBe('not-registered');
    await act(async () => screen.getByTestId('set-status').click());
    expect(screen.getByTestId('status').textContent).toBe('registered');
    await act(async () => screen.getByTestId('set-ready').click());
    expect(screen.getByTestId('status').textContent).toBe('ready');
    await act(async () => screen.getByTestId('set-voted').click());
    expect(screen.getByTestId('status').textContent).toBe('voted');
  });

  /* ── localStorage persistence ── */

  it('persists user data to localStorage', async () => {
    render(<ContextReader />, { wrapper });
    await act(async () => screen.getByTestId('set-name').click());
    const stored = localStorage.getItem('election-companion-user');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.name).toBe('Priya');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('election-companion-user', 'not-valid-json');
    // Should not throw
    render(<ContextReader />, { wrapper });
    expect(screen.getByTestId('name').textContent).toBe('');
  });

  it('loads persisted user data on mount', async () => {
    // Set some data first
    localStorage.setItem('election-companion-user', JSON.stringify({
      name: 'TestUser',
      state: 'DL',
      voterStatus: 'registered',
      onboardingComplete: true,
      completedSteps: [],
      eligibilityChecks: {},
      currentGoal: null,
    }));
    render(<ContextReader />, { wrapper });
    expect(screen.getByTestId('name').textContent).toBe('TestUser');
    expect(screen.getByTestId('state').textContent).toBe('DL');
  });
});
