type FocusArea = {
  label: string;
  tone: string;
};

type ProcessStep = {
  title: string;
  text: string;
};

export default function About() {
  const focusAreas: FocusArea[] = [
    { label: 'Red Team Mindset', tone: 'offense' },
    { label: 'Defensive Engineering', tone: 'defense' },
    { label: 'Analyst Reporting', tone: 'analysis' },
    { label: 'Secure Development', tone: 'build' },
  ];

  const processSteps: ProcessStep[] = [
    {
      title: 'Recon',
      text: 'Map assets, assumptions, user flows, and exposed surfaces before deciding where to test.',
    },
    {
      title: 'Validate',
      text: 'Confirm findings with controlled evidence, clear reproduction notes, and realistic impact framing.',
    },
    {
      title: 'Build',
      text: 'Create clean React interfaces, workflow automation, and documentation that make security work easier to act on.',
    },
    {
      title: 'Defend',
      text: 'Reduce attack surface through hardening, access review, logging awareness, and secure configuration choices.',
    },
    {
      title: 'Report',
      text: 'Translate technical evidence into prioritized actions that developers, analysts, and stakeholders can use.',
    },
  ];

  return (
    <section className="page-shell about" id="about">
      <div className="section-heading">
        <p className="eyebrow">About</p>
        <h1>Cybersecurity engineering with red-team range and defensive discipline.</h1>
        <p>
          I focus on practical security work that connects offensive thinking, defensive controls, analyst-quality evidence, and clean software delivery. The goal is to understand how systems can fail, then help make them harder to break.
        </p>
      </div>

      <div className="scope-strip" aria-label="Cybersecurity engineering focus areas">
        {focusAreas.map((area) => (
          <article className={`scope-card spotlight-card ${area.tone}`} key={area.label}>
            <span>{area.label}</span>
          </article>
        ))}
      </div>

      <div className="split-layout">
        <div className="glass-panel spotlight-card">
          <p className="panel-kicker">Operating Method</p>
          <h2>How I Work</h2>
          <p>
            I approach security work by asking what an attacker would try, what a defender needs to see, and what a team needs to change next. That keeps the work grounded in evidence instead of theatrics.
          </p>
          <p>
            My supporting strength is software development: building clear interfaces, repeatable workflows, and documentation surfaces that make technical findings easier to understand and act on.
          </p>
        </div>

        <div className="method-grid">
          {processSteps.map((step) => (
            <article className="process-card spotlight-card" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
