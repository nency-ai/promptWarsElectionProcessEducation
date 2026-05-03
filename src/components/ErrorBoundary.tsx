/* ============================================
   Error Boundary — Graceful Error Handling
   Catches React render errors and displays
   a user-friendly recovery UI.
   ============================================ */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { trackError } from '../services/analytics';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI to render on error */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    trackError('render_error', error.message);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleFullReset = (): void => {
    try {
      localStorage.removeItem('election-companion-user');
    } catch {
      // localStorage may be unavailable
    }
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <div className="error-boundary__container">
            <span className="error-boundary__icon" aria-hidden="true">⚠️</span>
            <h1 className="error-boundary__title">Something went wrong</h1>
            <p className="error-boundary__message">
              We encountered an unexpected error. Your data is safe — 
              try refreshing or resetting the application.
            </p>
            {this.state.error && (
              <details className="error-boundary__details">
                <summary>Technical Details</summary>
                <pre className="error-boundary__stack">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="error-boundary__actions">
              <button
                className="error-boundary__btn error-boundary__btn--primary"
                onClick={this.handleReset}
                id="error-retry-btn"
              >
                Try Again
              </button>
              <button
                className="error-boundary__btn error-boundary__btn--secondary"
                onClick={this.handleFullReset}
                id="error-reset-btn"
              >
                Reset Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
