export default function Contact() {
  /* Engagement labels summarize the work types that best fit the contact route. */
  const engagementTypes = [
    'Cybersecurity engineering',
    'Red-team lab writeups',
    'Defensive hardening reviews',
    'Security analyst reporting',
    'Secure React interfaces',
  ];

  return (
    <section className="page-shell contact" id="contact">
      {/* Contact heading frames the route before the actionable link panel. */}
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Let's work on security that is clear, defensible, and useful.</h1>
        <p>
          Reach out for cybersecurity engineering, red-team practice, defensive review, analyst-style documentation, secure frontend work, or technical problem solving where evidence and execution both matter.
        </p>
      </div>

      {/* Glass panel highlights best-fit work using the same surface style as other pages. */}
      <div className="glass-panel contact-copy">
        <p className="panel-kicker">Best Fits</p>
        <h2>Security work I want to support</h2>
        <div className="engagement-grid" aria-label="Best fit engagement types">
          {engagementTypes.map((type) => (
            <span className="engagement-card" key={type}>{type}</span>
          ))}
        </div>
      </div>

      {/* Contact links are large touch targets; icons visually identify the destination type. */}
      <div className="contact-panel">
        <a className="contact-link" href="mailto:alexander@example.com">
          <i className="fa-solid fa-envelope"></i>
          alexander@example.com
        </a>
        <a className="contact-link" href="#">
          <i className="fa-brands fa-linkedin-in"></i>
          LinkedIn
        </a>
        <a className="contact-link" href="#">
          <i className="fa-brands fa-github"></i>
          GitHub
        </a>
      </div>
    </section>
  );
};
