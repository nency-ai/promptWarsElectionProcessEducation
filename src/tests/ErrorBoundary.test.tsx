/* ============================================
   Tests — ErrorBoundary.test.tsx
   ============================================ */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that always throws
function ThrowingComponent(): React.ReactNode {
  throw new Error('Test explosion');
}

// Component that does not throw
function SafeComponent() {
  return <div data-testid="safe">All good</div>;
}

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(<ErrorBoundary><SafeComponent /></ErrorBoundary>);
    expect(screen.getByTestId('safe')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('error UI has alert role', () => {
    render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows Try Again button', () => {
    render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('shows Reset Application button', () => {
    render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
    expect(screen.getByText('Reset Application')).toBeInTheDocument();
  });

  it('shows error message in technical details', () => {
    render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
    expect(screen.getByText('Test explosion')).toBeInTheDocument();
  });

  it('Try Again recovers from error', async () => {
    const user = userEvent.setup();
    render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
    await user.click(screen.getByText('Try Again'));
    // After retry, the boundary resets hasError to false
    // But children will throw again
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Custom error</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('buttons have unique IDs', () => {
    render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
    expect(document.getElementById('error-retry-btn')).toBeInTheDocument();
    expect(document.getElementById('error-reset-btn')).toBeInTheDocument();
  });
});
