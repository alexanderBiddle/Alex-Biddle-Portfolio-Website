import { Link } from 'react-router';

export default function Home() {
  const capabilityTags = [
    'Cybersecurity Engineer',
    'Red Team',
    'Defense',
    'Threat Analysis',
    'Secure Development',
    'Analyst Reporting',
    'Automation',
  ];

  return (
    <section className="home" id="home">
      {/* Main hero column introduces the portfolio and groups the primary calls to action. */}
      <div className="hero-content">
        <div className="status-pill">
          <span></span>
          Open to cybersecurity engineering work
        </div>
        <p className="eyebrow">Cybersecurity Engineer / Red Team / Defense</p>
        <h1>Cybersecurity Engineer building resilient systems from both sides of the signal.</h1>
        <p className="hero-copy">
          I bring red-team curiosity, defensive engineering, analyst discipline, and software development polish together to understand risk, harden systems, and communicate findings clearly.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/Projects">Review Project Scope</Link>
          <Link className="button secondary" to="/Contact">Discuss Security Work</Link>
        </div>
        {/* Repeated stack tags are generated from data so each skill label gets identical DOM styling. */}
        <div className="hero-stack" aria-label="Core technology areas">
          {capabilityTags.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      {/* Sidebar panel is presentational DOM styled to feel like a security operations terminal. */}
      <aside className="terminal-panel" aria-label="Security operations preview">
        <div className="terminal-topbar">
          <span></span>
          <span></span>
          <span></span>
          <strong>alex@biddledev:~/security</strong>
        </div>
        <div className="terminal-body">
          <p><span>$</span> initialize profile --role cyber-engineer</p>
          <p className="terminal-ok">status: red team and defense signal online</p>
          <p><span>$</span> map operating modes</p>
          <ul>
            <li>recon and controlled exploitation labs</li>
            <li>defensive hardening and access review</li>
            <li>analyst-ready evidence and reporting</li>
            <li>secure React and automation workflows</li>
          </ul>
        </div>
        {/* Radar markup provides hooks for CSS circles and the animated sweep line. */}
        <div className="radar">
          <span>RED / BLUE</span>
          <i></i>
        </div>
      </aside>
    </section>
  );
};
