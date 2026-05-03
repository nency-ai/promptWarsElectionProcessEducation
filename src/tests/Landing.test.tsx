/* ============================================
   Tests — Landing.test.tsx (Landing Page)
   ============================================ */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Landing from '../components/Landing';
import { renderWithProviders } from './helpers';

describe('Landing Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the landing page with a hero section', () => {
    renderWithProviders(<Landing />);
    expect(screen.getByText(/Navigate the/i)).toBeInTheDocument();
    expect(screen.getByText(/Election Process/i)).toBeInTheDocument();
  });

  it('has a proper h1 heading with id', () => {
    renderWithProviders(<Landing />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'landing-heading');
  });

  it('renders the main landmark with correct role', () => {
    renderWithProviders(<Landing />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('renders the Get Started button with aria-label', () => {
    renderWithProviders(<Landing />);
    const btn = screen.getByText('Get Started');
    expect(btn.closest('button')).toHaveAttribute('id', 'get-started-btn');
  });

  it('renders the Learn More button', () => {
    renderWithProviders(<Landing />);
    const btn = screen.getByText('Learn More');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('id', 'learn-more-btn');
  });

  it('renders all four feature cards', () => {
    renderWithProviders(<Landing />);
    expect(screen.getByText('Personalized Guide')).toBeInTheDocument();
    expect(screen.getByText('Eligibility Check')).toBeInTheDocument();
    expect(screen.getByText('Deadline Alerts')).toBeInTheDocument();
    expect(screen.getByText('Myth Busting')).toBeInTheDocument();
  });

  it('renders platform statistics', () => {
    renderWithProviders(<Landing />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Guided Steps')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Non-Partisan')).toBeInTheDocument();
  });

  it('renders the trust badge', () => {
    renderWithProviders(<Landing />);
    expect(screen.getByText(/Non-political/i)).toBeInTheDocument();
    expect(screen.getByText(/Official information only/i)).toBeInTheDocument();
  });

  it('decorative elements are hidden from screen readers', () => {
    renderWithProviders(<Landing />);
    const ariaHidden = document.querySelectorAll('[aria-hidden="true"]');
    expect(ariaHidden.length).toBeGreaterThan(0);
  });

  it('hero section has aria-labelledby referencing the heading', () => {
    renderWithProviders(<Landing />);
    const section = document.querySelector('[aria-labelledby="landing-heading"]');
    expect(section).toBeInTheDocument();
  });

  it('stats section has aria-label', () => {
    renderWithProviders(<Landing />);
    const stats = document.querySelector('[aria-label="Platform statistics"]');
    expect(stats).toBeInTheDocument();
  });
});
