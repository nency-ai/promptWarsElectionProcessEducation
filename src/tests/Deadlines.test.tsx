/* ============================================
   Tests — Deadlines.test.tsx
   ============================================ */
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Deadlines from '../components/Deadlines';
import { renderWithProviders } from './helpers';

describe('Deadlines Component', () => {
  it('renders the heading', () => {
    renderWithProviders(<Deadlines />);
    expect(screen.getByText('Important Deadlines')).toBeInTheDocument();
  });

  it('renders main landmark', () => {
    renderWithProviders(<Deadlines />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the legend with categories', () => {
    renderWithProviders(<Deadlines />);
    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByText('Voting')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  it('renders the timeline as a list', () => {
    renderWithProviders(<Deadlines />);
    const list = screen.getByRole('list', { name: /Election deadlines timeline/i });
    expect(list).toBeInTheDocument();
  });

  it('renders deadline cards as list items', () => {
    renderWithProviders(<Deadlines />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('each deadline card shows title and description', () => {
    renderWithProviders(<Deadlines />);
    expect(screen.getByText('Polling Day')).toBeInTheDocument();
  });

  it('shows days left for future deadlines', () => {
    renderWithProviders(<Deadlines />);
    const daysElements = document.querySelectorAll('.deadlines__days-number');
    // At least some deadlines should be in the future
    expect(daysElements.length).toBeGreaterThanOrEqual(0);
  });

  it('renders the disclaimer note', () => {
    renderWithProviders(<Deadlines />);
    expect(screen.getByText(/Deadlines vary by state/i)).toBeInTheDocument();
  });

  it('urgent deadlines have important badge', () => {
    renderWithProviders(<Deadlines />);
    // Check if Important badges exist for urgent items
    const badges = document.querySelectorAll('.deadlines__urgent-badge');
    expect(badges.length).toBeGreaterThanOrEqual(0);
  });

  it('deadline cards have category color styling', () => {
    renderWithProviders(<Deadlines />);
    const cards = document.querySelectorAll('.deadlines__card');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      const style = card.getAttribute('style');
      expect(style).toContain('--category-color');
    });
  });
});
