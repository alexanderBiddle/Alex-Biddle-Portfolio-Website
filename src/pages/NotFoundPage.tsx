/* React Router's Link returns visitors to the configured home route without a full page reload. */
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    /* Fallback route renders when no configured path matches the browser URL. */
    <section className="page-shell error-page">
      {/* Reuses the glass panel and hero button styles so the error page feels integrated. */}
      <div className="glass-panel spotlight-card">
        <p className="eyebrow">404</p>
        <h1>Signal Lost</h1>
        <p>The route you tried to open is not mapped in this security command surface.</p>
        <div className="hero-actions">
          <Link className="button primary" to="/">Go Back to Home</Link>
        </div>
      </div>
    </section>
  );
};
