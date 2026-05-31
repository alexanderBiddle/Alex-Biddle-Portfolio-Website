/* Focus cards use compact labels and tone hooks for the professional-summary strip. */
type FocusArea = {
  number: string;
  label: string;
  tone: string;
};

/* Process steps provide reusable timeline copy for the operating-method grid. */
type ProcessStep = {
  number: string;
  title: string;
  text: string;
};

export default function About() {
  /* Focus areas become short identity cards before the more detailed method explanation. */
  const focusAreas: FocusArea[] = [
    { number: '01', label: 'Red Team Mindset', tone: 'offense' },
    { number: '02', label: 'Defensive Engineering', tone: 'defense' },
    { number: '03', label: 'Analyst Reporting', tone: 'analysis' },
    { number: '04', label: 'Secure Development', tone: 'build' },
  ];

  /* Ordered steps explain how security work moves from discovery to actionable reporting. */
  const processSteps: ProcessStep[] = [
    {
      number: '01',
      title: 'Recon',
      text: 'Map assets, assumptions, user flows, and exposed surfaces before deciding where to test.',
    },
    {
      number: '02',
      title: 'Validate',
      text: 'Confirm findings with controlled evidence, clear reproduction notes, and realistic impact framing.',
    },
    {
      number: '03',
      title: 'Build',
      text: 'Create clean React interfaces, workflow automation, and documentation that make security work easier to act on.',
    },
    {
      number: '04',
      title: 'Defend',
      text: 'Reduce attack surface through hardening, access review, logging awareness, and secure configuration choices.',
    },
    {
      number: '05',
      title: 'Report',
      text: 'Translate technical evidence into prioritized actions that developers, analysts, and stakeholders can use.',
    },
  ];

  return (
    <section className="page-shell about" id="about">
      {/* Shared page heading pattern gives each route a consistent intro block. */}
      <div className="section-heading">
        <p className="eyebrow">About</p>
        <h1>Cybersecurity engineering with red-team range and defensive discipline.</h1>
        <p>
          I focus on practical security work that connects offensive thinking, defensive controls, analyst-quality evidence, and clean software delivery. The goal is to understand how systems can fail, then help make them harder to break.
        </p>
      </div>

      {/* Focus cards summarize the professional identity before the long-form process details. */}
      <div className="scope-strip" aria-label="Cybersecurity engineering focus areas">
        {focusAreas.map((area) => (
          <article className={`scope-card ${area.tone}`} key={area.label}>
            <strong>{area.number}</strong>
            <span>{area.label}</span>
          </article>
        ))}
      </div>

      {/* Split layout pairs long-form process copy with a step-by-step timeline. */}
      <div className="split-layout">
        <div className="glass-panel">
          <p className="panel-kicker">Operating Method</p>
          <h2>How I Work</h2>
          <p>
            I approach security work by asking what an attacker would try, what a defender needs to see, and what a team needs to change next. That keeps the work grounded in evidence instead of theatrics.
          </p>
          <p>
            My supporting strength is software development: building clear interfaces, repeatable workflows, and documentation surfaces that make technical findings easier to understand and act on.
          </p>
        </div>

        {/* Process cards stay modular so future experience details can be inserted without redesigning the page. */}
        <div className="method-grid">
          {processSteps.map((step) => (
            <article className="process-card" key={step.title}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
