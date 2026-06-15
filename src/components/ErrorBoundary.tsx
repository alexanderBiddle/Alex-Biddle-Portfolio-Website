/* Last-resort error boundary that wraps the router itself. React Router's per-route errorElement
   handles errors inside the routed tree; this catches the rare error that originates outside it —
   router infrastructure, the RouterProvider render, or a synchronous failure before any route mounts —
   so a crash there shows a styled notice instead of a blank document. */
import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/* The app is served from a sub-path on GitHub Pages, so recovery must point at the configured base
   rather than the domain root. This mirrors the basename derivation in main.tsx. */
const homeHref = import.meta.env.BASE_URL || '/';

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  /* Render-phase failures flip the boundary into its fallback before the next commit. */
  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  /* Surface the error to the console so it remains diagnosable in development and production. */
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Top-level boundary caught an error:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      /* The boundary renders outside the router, so it carries its own page shell and uses a plain
         anchor (no React Router <Link>) for recovery. A full navigation reloads a clean app tree. */
      <section className="page-shell">
        <div className="glass-panel spotlight-card">
          <p className="eyebrow">Error</p>
          <h1>Something Broke</h1>
          <p>The application hit an unexpected error while starting up. Reloading usually resolves it.</p>
          {import.meta.env.DEV && (
            <p>
              <code>{error.message}</code>
            </p>
          )}
          <div className="hero-actions">
            <a className="button primary" href={homeHref}>Go Back to Home</a>
          </div>
        </div>
      </section>
    );
  }
}
