/* ============================================
   Tests — Chat.test.tsx
   ============================================ */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from '../components/Chat';
import { renderWithProviders } from './helpers';

// Mock the GoogleGenAI module
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({ text: 'Mock AI response' }),
    },
  })),
}));

describe('Chat Component', () => {
  beforeEach(() => localStorage.clear());

  it('renders the chat heading', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByText('Election Guide AI')).toBeInTheDocument();
  });

  it('renders main landmark', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the chat message area with log role', () => {
    renderWithProviders(<Chat />);
    const log = screen.getByRole('log');
    expect(log).toBeInTheDocument();
    expect(log).toHaveAttribute('aria-live', 'polite');
  });

  it('renders the chat input with aria-label', () => {
    renderWithProviders(<Chat />);
    const input = screen.getByLabelText('Type your question');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('maxLength', '500');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it('renders the send button', () => {
    renderWithProviders(<Chat />);
    const btn = screen.getByLabelText('Send message');
    expect(btn).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    renderWithProviders(<Chat />);
    const btn = screen.getByLabelText('Send message');
    expect(btn).toBeDisabled();
  });

  it('send button enables when text is entered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Chat />);
    const input = screen.getByLabelText('Type your question');
    await user.type(input, 'Hello');
    const btn = screen.getByLabelText('Send message');
    expect(btn).not.toBeDisabled();
  });

  it('renders quick question buttons', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByText('How do I register?')).toBeInTheDocument();
    expect(screen.getByText('Where is my polling place?')).toBeInTheDocument();
    expect(screen.getByText('What ID do I need?')).toBeInTheDocument();
  });

  it('quick question buttons have unique IDs', () => {
    renderWithProviders(<Chat />);
    expect(document.getElementById('quick-q-register')).toBeInTheDocument();
    expect(document.getElementById('quick-q-find-booth')).toBeInTheDocument();
    expect(document.getElementById('quick-q-id-requirements')).toBeInTheDocument();
  });

  it('displays user context badges', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByText('not registered')).toBeInTheDocument();
  });

  it('shows greeting messages on first load', async () => {
    renderWithProviders(<Chat />);
    // Wait for greeting messages
    await act(async () => {
      await new Promise(r => setTimeout(r, 600));
    });
    expect(screen.getByText(/Welcome to Election Companion/i)).toBeInTheDocument();
  });

  it('sends a user message on form submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Chat />);
    const input = screen.getByLabelText('Type your question');
    await user.type(input, 'Tell me about voting rules');
    const form = input.closest('form')!;
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    // The user message should appear in a chat bubble
    const userMessages = document.querySelectorAll('.chat__message--user');
    expect(userMessages.length).toBeGreaterThan(0);
  });

  it('clears input after sending a message', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Chat />);
    const input = screen.getByLabelText('Type your question') as HTMLInputElement;
    await user.type(input, 'Test question');
    const form = input.closest('form')!;
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    expect(input.value).toBe('');
  });

  it('renders avatar for assistant messages', async () => {
    renderWithProviders(<Chat />);
    await act(async () => {
      await new Promise(r => setTimeout(r, 600));
    });
    const avatars = document.querySelectorAll('.chat__message-avatar');
    expect(avatars.length).toBeGreaterThan(0);
  });
});
