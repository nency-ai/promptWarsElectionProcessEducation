/* ============================================
   Tests — Eligibility.test.tsx
   ============================================ */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Eligibility from '../components/Eligibility';
import { renderWithProviders } from './helpers';

describe('Eligibility Component', () => {
  beforeEach(() => localStorage.clear());

  it('renders the heading', () => {
    renderWithProviders(<Eligibility />);
    expect(screen.getByText('Eligibility Checker')).toBeInTheDocument();
  });

  it('renders main landmark', () => {
    renderWithProviders(<Eligibility />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders all eligibility items with checkboxes', () => {
    renderWithProviders(<Eligibility />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(5);
  });

  it('checkboxes have aria-checked attribute', () => {
    renderWithProviders(<Eligibility />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(cb => {
      expect(cb).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('toggling a checkbox updates its state', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Eligibility />);
    const firstCb = screen.getAllByRole('checkbox')[0];
    await user.click(firstCb);
    expect(firstCb).toHaveAttribute('aria-checked', 'true');
  });

  it('shows progress ring with count', () => {
    renderWithProviders(<Eligibility />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/\/ 5/)).toBeInTheDocument();
  });

  it('shows "Start checking below" when none checked', () => {
    renderWithProviders(<Eligibility />);
    expect(screen.getByText('Start checking below')).toBeInTheDocument();
  });

  it('shows remaining count when some are checked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Eligibility />);
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getByText(/4 remaining/)).toBeInTheDocument();
  });

  it('shows eligible banner when all checked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Eligibility />);
    const checkboxes = screen.getAllByRole('checkbox');
    for (const cb of checkboxes) {
      await user.click(cb);
    }
    expect(screen.getByText("You're Eligible to Vote!")).toBeInTheDocument();
  });

  it('renders disclaimer', () => {
    renderWithProviders(<Eligibility />);
    expect(screen.getByText(/general eligibility overview/i)).toBeInTheDocument();
  });

  it('each checkbox has aria-describedby', () => {
    renderWithProviders(<Eligibility />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(cb => {
      expect(cb).toHaveAttribute('aria-describedby');
    });
  });

  it('items have unique IDs', () => {
    renderWithProviders(<Eligibility />);
    expect(document.getElementById('eligibility-citizenship')).toBeInTheDocument();
    expect(document.getElementById('eligibility-age')).toBeInTheDocument();
  });
});
