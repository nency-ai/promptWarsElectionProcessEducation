/* ============================================
   Tests — App.test.tsx (Root Component)
   ============================================ */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Root Component', () => {
  it('renders the application wrapper', () => {
    render(<App />);
    const appContainer = document.querySelector('.app');
    expect(appContainer).toBeInTheDocument();
  });

  it('renders the skip-to-content link', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders main content region', () => {
    render(<App />);
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('role', 'region');
    expect(main).toHaveAttribute('aria-label', 'Main content');
  });

  it('sets tabIndex on main-content for focus management', () => {
    render(<App />);
    const main = document.getElementById('main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
  });

  it('renders landing page by default for new users', () => {
    localStorage.removeItem('election-companion-user');
    render(<App />);
    // Landing page should show
    const heading = screen.getByText(/Navigate the/i);
    expect(heading).toBeInTheDocument();
  });

  it('contains the live announcer regions', () => {
    render(<App />);
    expect(screen.getByTestId('live-announcer-polite')).toBeInTheDocument();
    expect(screen.getByTestId('live-announcer-assertive')).toBeInTheDocument();
  });
});
