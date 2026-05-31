export default function Footer() {
  return (
    <footer className="footer">
      {/* Brand summary gives the footer a persistent identity block across every route. */}
      <div>
        <strong>BiddleDev</strong>
        <p>Cybersecurity Engineer focused on red-team thinking, defensive engineering, analyst reporting, and secure software.</p>
      </div>

      {/* Icon-only anchors use aria labels so assistive tech can identify each social link. */}
      <div className="social-links">
        <a href="#" className="social-link" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
        <a href="#" className="social-link" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
      </div>

      {/* Copyright text is separate so CSS can position it independently from the links. */}
      <p className="copyright">© 2026 BiddleDev. All rights reserved.</p>
    </footer> 
  );
};
