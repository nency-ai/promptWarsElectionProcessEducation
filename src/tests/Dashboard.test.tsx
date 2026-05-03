/* ============================================
   Tests — Dashboard.test.tsx
   ============================================ */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { renderWithProviders } from './helpers';

const ONBOARDED = JSON.stringify({
  name: 'Priya', state: 'MH', voterStatus: 'not-registered',
  onboardingComplete: true, completedSteps: [], eligibilityChecks: {}, currentGoal: 'register',
});

describe('Dashboard Component', () => {
  beforeEach(() => localStorage.clear());

  it('renders the welcome heading with user name', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Priya')).toBeInTheDocument();
  });

  it('renders the main landmark', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the welcome section with proper heading', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'welcome-heading');
  });

  it('renders the progress section with progressbar role', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    const bars = screen.getAllByRole('progressbar');
    expect(bars.length).toBeGreaterThanOrEqual(1);
  });

  it('renders quick action cards', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Step Guide')).toBeInTheDocument();
    expect(screen.getByText('Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Myths & Facts')).toBeInTheDocument();
    expect(screen.getByText('AI Guide')).toBeInTheDocument();
  });

  it('quick action buttons have unique IDs', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    expect(document.getElementById('action-guide')).toBeInTheDocument();
    expect(document.getElementById('action-eligibility')).toBeInTheDocument();
    expect(document.getElementById('action-myths')).toBeInTheDocument();
    expect(document.getElementById('action-chat')).toBeInTheDocument();
  });

  it('displays the voter status badge', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Not Registered')).toBeInTheDocument();
  });

  it('shows next step CTA when steps remain', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    const btn = document.getElementById('next-step-action-btn');
    expect(btn).toBeInTheDocument();
  });

  it('renders state name from code', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Maharashtra')).toBeInTheDocument();
  });

  it('renders sections with aria-labelledby', () => {
    localStorage.setItem('election-companion-user', ONBOARDED);
    renderWithProviders(<Dashboard />);
    expect(document.querySelector('[aria-labelledby="welcome-heading"]')).toBeInTheDocument();
    expect(document.querySelector('[aria-labelledby="progress-heading"]')).toBeInTheDocument();
    expect(document.querySelector('[aria-labelledby="actions-heading"]')).toBeInTheDocument();
  });
});
