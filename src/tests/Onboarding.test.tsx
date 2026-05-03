/* ============================================
   Tests — Onboarding.test.tsx
   ============================================ */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Onboarding from '../components/Onboarding';
import { renderWithProviders } from './helpers';

describe('Onboarding Component', () => {
  beforeEach(() => localStorage.clear());

  it('renders the first step (name input)', () => {
    renderWithProviders(<Onboarding />);
    expect(screen.getByText(/What's your name/i)).toBeInTheDocument();
  });

  it('renders main landmark', () => {
    renderWithProviders(<Onboarding />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the progress bar with ARIA attributes', () => {
    renderWithProviders(<Onboarding />);
    const bar = screen.getByRole('progressbar', { name: /Onboarding progress/i });
    expect(bar).toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows step counter', () => {
    renderWithProviders(<Onboarding />);
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
  });

  it('name input has correct attributes', () => {
    renderWithProviders(<Onboarding />);
    const input = screen.getByPlaceholderText(/Enter your first name/i);
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('autoComplete', 'given-name');
    expect(input).toHaveAttribute('id', 'onboarding-name-input');
  });

  it('continue button is disabled when name is empty', () => {
    renderWithProviders(<Onboarding />);
    const btn = document.getElementById('onboarding-name-submit');
    expect(btn).toBeDisabled();
  });

  it('continue button enables when name is entered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Onboarding />);
    const input = screen.getByPlaceholderText(/Enter your first name/i);
    await user.type(input, 'Rahul');
    const btn = document.getElementById('onboarding-name-submit');
    expect(btn).not.toBeDisabled();
  });

  it('advances to state selection after name submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Onboarding />);
    const input = screen.getByPlaceholderText(/Enter your first name/i);
    await user.type(input, 'Rahul');
    const btn = document.getElementById('onboarding-name-submit')!;
    await user.click(btn);
    expect(screen.getByText(/Where are you located/i)).toBeInTheDocument();
  });

  it('state search filters results', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Onboarding />);
    // Go to state step
    const input = screen.getByPlaceholderText(/Enter your first name/i);
    await user.type(input, 'Test');
    await user.click(document.getElementById('onboarding-name-submit')!);
    // Search for Maharashtra
    const search = screen.getByPlaceholderText(/Search for your state/i);
    await user.type(search, 'Maha');
    expect(screen.getByText('Maharashtra')).toBeInTheDocument();
  });

  it('back button renders with aria-label', () => {
    renderWithProviders(<Onboarding />);
    const backBtn = screen.getByLabelText('Go back');
    expect(backBtn).toBeInTheDocument();
  });

  it('status options use radiogroup role', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Onboarding />);
    // Navigate to status step
    await user.type(screen.getByPlaceholderText(/Enter your first name/i), 'T');
    await user.click(document.getElementById('onboarding-name-submit')!);
    await user.click(screen.getByText('Maharashtra'));
    // Check radiogroup
    const rg = document.querySelector('[role="radiogroup"]');
    expect(rg).toBeInTheDocument();
  });
});
