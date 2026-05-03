/* ============================================
   Tests — Header.test.tsx (Navigation Bar)
   ============================================ */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Header from '../components/Header';
import { renderWithProviders } from './helpers';

const ONBOARDED_USER = JSON.stringify({
  name: 'Test', state: 'DL', voterStatus: 'registered',
  onboardingComplete: true, completedSteps: [], eligibilityChecks: {}, currentGoal: null,
});

describe('Header Component', () => {
  beforeEach(() => localStorage.clear());

  it('does not render on landing page', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.header')).not.toBeInTheDocument();
  });

  it('renders on dashboard after onboarding', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    expect(document.querySelector('.header')).toBeInTheDocument();
  });

  it('renders logo with aria-label', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    expect(screen.getByLabelText('Go to dashboard')).toBeInTheDocument();
  });

  it('renders main navigation with role', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    const navs = screen.getAllByRole('navigation');
    expect(navs.find(n => n.getAttribute('aria-label') === 'Main navigation')).toBeTruthy();
  });

  it('renders nav items with unique IDs', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    ['nav-dashboard','nav-guide','nav-eligibility','nav-myths','nav-deadlines','nav-chat'].forEach(id => {
      expect(document.getElementById(id)).toBeInTheDocument();
    });
  });

  it('shows progress ring with ARIA attributes', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    const p = screen.getByRole('progressbar', { name: /Overall voting progress/i });
    expect(p).toHaveAttribute('aria-valuemin', '0');
    expect(p).toHaveAttribute('aria-valuemax', '100');
  });

  it('displays user avatar initial', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders reset button with aria-label', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    expect(screen.getByLabelText('Reset profile and start over')).toBeInTheDocument();
  });

  it('renders mobile navigation', () => {
    localStorage.setItem('election-companion-user', ONBOARDED_USER);
    renderWithProviders(<Header />);
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
  });
});
