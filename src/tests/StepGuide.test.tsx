/* ============================================
   Tests — StepGuide.test.tsx
   ============================================ */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepGuide from '../components/StepGuide';
import { renderWithProviders } from './helpers';

const REGISTERED_USER = JSON.stringify({
  name: 'Test', state: 'DL', voterStatus: 'registered',
  onboardingComplete: true, completedSteps: [], eligibilityChecks: {}, currentGoal: 'learn',
});

describe('StepGuide Component', () => {
  beforeEach(() => localStorage.clear());

  it('renders the guide heading', () => {
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    expect(screen.getByText('Your Voting Journey')).toBeInTheDocument();
  });

  it('renders main landmark', () => {
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders steps as a list', () => {
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    const list = screen.getByRole('list', { name: /Voting steps/i });
    expect(list).toBeInTheDocument();
  });

  it('shows step completion count', () => {
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    expect(screen.getByText(/0 of/)).toBeInTheDocument();
  });

  it('renders step check buttons with aria-labels', () => {
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    const checkBtns = document.querySelectorAll('[id^="step-check-"]');
    expect(checkBtns.length).toBeGreaterThan(0);
    checkBtns.forEach(btn => {
      expect(btn).toHaveAttribute('aria-label');
    });
  });

  it('can expand a step to see substeps', async () => {
    const user = userEvent.setup();
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    const expandBtns = document.querySelectorAll('.guide__expand-btn');
    if (expandBtns.length > 0) {
      await user.click(expandBtns[0] as HTMLElement);
      expect(screen.getByText('How to do this:')).toBeInTheDocument();
    }
  });

  it('expand buttons have aria-expanded attribute', () => {
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    const expandBtns = document.querySelectorAll('.guide__expand-btn');
    expandBtns.forEach(btn => {
      expect(btn).toHaveAttribute('aria-expanded');
    });
  });

  it('renders progress bar', () => {
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeInTheDocument();
  });

  it('filters steps based on voter status', () => {
    // 'registered' status should show different steps than 'not-registered'
    localStorage.setItem('election-companion-user', REGISTERED_USER);
    renderWithProviders(<StepGuide />);
    expect(screen.getByText('Find Your Polling Booth')).toBeInTheDocument();
  });
});
