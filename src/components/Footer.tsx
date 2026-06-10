export default function Footer() {
  return (
    <footer className="footer">
      <strong className="footer-name">Alexander Biddle</strong>

      <div className="footer-center">
        <div className="social-links">
          <a
            href="https://github.com/AlexanderBiddle"
            className="social-link"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/alex-biddle12"
            className="social-link"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      <p className="copyright">© 2026 Alexander Biddle. All rights reserved.</p>
    </footer>
  );
};
