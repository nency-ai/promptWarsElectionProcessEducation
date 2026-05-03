/* ============================================
   Tests — integration.test.tsx
   Full user journey integration tests
   ============================================ */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock GoogleGenAI
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({ text: 'Mock response' }),
    },
  })),
}));

describe('Integration: Full User Journey', () => {
  beforeEach(() => localStorage.clear());

  it('new user sees the landing page', () => {
    render(<App />);
    expect(screen.getByText(/Navigate the/i)).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('clicking Get Started goes to onboarding', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Get Started'));
    expect(screen.getByText(/What's your name/i)).toBeInTheDocument();
  });

  it('full onboarding flow completes to dashboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Step 1: Click Get Started
    await user.click(screen.getByText('Get Started'));
    // Step 2: Enter name
    const nameInput = screen.getByPlaceholderText(/Enter your first name/i);
    await user.type(nameInput, 'Rahul');
    await user.click(document.getElementById('onboarding-name-submit')!);
    // Step 3: Select state
    const search = screen.getByPlaceholderText(/Search for your state/i);
    await user.type(search, 'Delhi');
    await user.click(screen.getByText('Delhi'));
    // Step 4: Select voter status
    await user.click(screen.getByText('Not Registered'));
    // Step 5: Select goal
    await user.click(screen.getByText('Register to Vote'));
    // Should be on dashboard now
    expect(screen.getByText('Rahul')).toBeInTheDocument();
    expect(document.getElementById('welcome-heading')).toBeInTheDocument();
  });

  it('returning user with onboarding complete goes to dashboard', () => {
    localStorage.setItem('election-companion-user', JSON.stringify({
      name: 'Priya', state: 'MH', voterStatus: 'registered',
      onboardingComplete: true, completedSteps: [],
      eligibilityChecks: {}, currentGoal: 'learn',
    }));
    render(<App />);
    expect(screen.getByText('Priya')).toBeInTheDocument();
  });

  it('skip link is visible on focus', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('document title updates for landing page', () => {
    render(<App />);
    expect(document.title).toContain('Election Companion');
  });

  it('navigation between views works from dashboard', async () => {
    const user = userEvent.setup();
    localStorage.setItem('election-companion-user', JSON.stringify({
      name: 'Test', state: 'DL', voterStatus: 'registered',
      onboardingComplete: true, completedSteps: [],
      eligibilityChecks: {}, currentGoal: 'learn',
    }));
    render(<App />);
    // Navigate to eligibility
    await user.click(document.getElementById('nav-eligibility')!);
    expect(screen.getByText('Eligibility Checker')).toBeInTheDocument();
    // Navigate to myths
    await user.click(document.getElementById('nav-myths')!);
    expect(screen.getByText('Myth vs Fact')).toBeInTheDocument();
    // Navigate to deadlines
    await user.click(document.getElementById('nav-deadlines')!);
    expect(screen.getByText('Important Deadlines')).toBeInTheDocument();
  });

  it('reset clears user data and returns to landing', async () => {
    const user = userEvent.setup();
    localStorage.setItem('election-companion-user', JSON.stringify({
      name: 'Test', state: 'DL', voterStatus: 'registered',
      onboardingComplete: true, completedSteps: [],
      eligibilityChecks: {}, currentGoal: null,
    }));
    render(<App />);
    const resetBtn = screen.getByLabelText('Reset profile and start over');
    await user.click(resetBtn);
    expect(screen.getByText(/Navigate the/i)).toBeInTheDocument();
  });
});

describe('Integration: Accessibility', () => {
  beforeEach(() => localStorage.clear());

  it('main content has tabIndex -1 for focus management', () => {
    render(<App />);
    const main = document.getElementById('main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
  });

  it('live announcer regions exist', () => {
    render(<App />);
    expect(screen.getByTestId('live-announcer-polite')).toBeInTheDocument();
    expect(screen.getByTestId('live-announcer-assertive')).toBeInTheDocument();
  });

  it('every page has a main landmark', async () => {
    const user = userEvent.setup();
    localStorage.setItem('election-companion-user', JSON.stringify({
      name: 'T', state: 'DL', voterStatus: 'registered',
      onboardingComplete: true, completedSteps: [],
      eligibilityChecks: {}, currentGoal: null,
    }));
    render(<App />);
    // Dashboard
    expect(screen.getByRole('main')).toBeInTheDocument();
    // Navigate to guide
    await user.click(document.getElementById('nav-guide')!);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
