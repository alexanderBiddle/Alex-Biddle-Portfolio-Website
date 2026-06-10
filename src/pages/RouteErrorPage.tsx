/* React Router routes rendering errors here so one crashing page cannot blank the whole site. */
import { Link, isRouteErrorResponse, useRouteError } from 'react-router';

/* Error detail is only surfaced during development; production visitors see a calm generic notice. */
const describeError = (error: unknown): string => {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export default function RouteErrorPage() {
  const error = useRouteError();

  return (
    /* The boundary replaces the routed tree, so it carries its own page shell and glass styling. */
    <section className="page-shell">
      <div className="glass-panel spotlight-card">
        <p className="eyebrow">Error</p>
        <h1>Something Broke</h1>
        <p>This page hit an unexpected error while rendering. The rest of the site is unaffected.</p>
        {import.meta.env.DEV && (
          <p>
            <code>{describeError(error)}</code>
          </p>
        )}
        <div className="hero-actions">
          <Link className="button primary" to="/">Go Back to Home</Link>
        </div>
      </div>
    </section>
  );
}
