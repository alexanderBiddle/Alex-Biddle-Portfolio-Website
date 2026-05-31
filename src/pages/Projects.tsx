/* Project data is separated from JSX so the card DOM can be expanded without rewriting markup. */
type Project = {
  title: string;
  area: string;
  objective: string;
  scope: string;
  signal: string;
  outcome: string;
  tech: string[];
};

const projects: Project[] = [
  {
    title: 'Red Team Lab Operations',
    area: 'Offensive Security',
    objective: 'Practice controlled exploitation paths and document how access can be gained, expanded, and explained responsibly.',
    scope: 'Recon, web testing, exploit validation, privilege escalation concepts, and remediation notes in a lab environment.',
    signal: 'Evidence-driven notes, command history, affected assumptions, and risk language a defender can act on.',
    outcome: 'Portfolio-ready red-team narratives that show method, restraint, and useful security communication.',
    tech: ['Red Team', 'Recon', 'Web App Testing', 'Reporting'],
  },
  {
    title: 'Defensive Hardening Review',
    area: 'Blue Team / Defense',
    objective: 'Review exposed surfaces and strengthen configurations before weaknesses become incidents.',
    scope: 'Access control checks, logging visibility, secure configuration review, and prioritized hardening actions.',
    signal: 'Control gaps, missing telemetry, risky defaults, and quick-win changes organized by impact.',
    outcome: 'Clear defensive roadmap for reducing attack surface and improving operational confidence.',
    tech: ['Defense', 'Hardening', 'Access Control', 'Logs'],
  },
  {
    title: 'Threat Review Workflow',
    area: 'Cybersecurity Engineering',
    objective: 'Turn risky assumptions into structured findings, owner-ready context, and practical remediation steps.',
    scope: 'Threat modeling, issue framing, severity calibration, reproduction details, and fix validation.',
    signal: 'Mapped attack paths, affected assets, likelihood notes, and recommended control changes.',
    outcome: 'A repeatable review process that helps teams decide what to fix first and why it matters.',
    tech: ['Threat Modeling', 'Risk', 'Documentation', 'Validation'],
  },
  {
    title: 'Secure Frontend Engineering',
    area: 'Software Development',
    objective: 'Build polished React interfaces that communicate trust, handle content cleanly, and support security storytelling.',
    scope: 'Responsive UI, accessible navigation, case-study layouts, motion restraint, and security-focused content structure.',
    signal: 'Stable layouts, clear hierarchy, visible focus states, and build validation through Vite.',
    outcome: 'A professional portfolio surface that positions development as a force multiplier for cybersecurity work.',
    tech: ['React', 'Vite', 'Responsive CSS', 'Accessibility'],
  },
  {
    title: 'Analyst Evidence Report',
    area: 'Security Analysis',
    objective: 'Present alerts, logs, findings, and response recommendations in a format that is easy to scan and defend.',
    scope: 'Evidence capture, timeline summaries, impact notes, root-cause framing, and action-oriented recommendations.',
    signal: 'Clear artifact references, concise summaries, and severity language paired with next steps.',
    outcome: 'Security work shown through evidence, not buzzwords.',
    tech: ['Analysis', 'Logs', 'Incident Notes', 'Reporting'],
  },
  {
    title: 'Automation Toolkit',
    area: 'Engineering Support',
    objective: 'Reduce repetitive setup and validation work so security and development feedback loops stay fast.',
    scope: 'Command-line helpers, build checks, documentation structure, Git workflow support, and repeatable local validation.',
    signal: 'Consistent commands, predictable output, fewer manual steps, and easier handoff between tasks.',
    outcome: 'Less operational friction and more time spent on actual security judgment.',
    tech: ['Automation', 'Node', 'Git', 'Ops'],
  },
];

export default function Projects() {
  return (
    <section className="page-shell projects" id="projects">
      {/* Route header explains the page before the repeated project-card region begins. */}
      <div className="section-heading">
        <p className="eyebrow">Projects</p>
        <h1>Project scope shaped like security case studies.</h1>
        <p>Representative directions for red-team labs, defensive hardening, cybersecurity engineering, analyst reporting, and secure software work. These cards are structured so real experience can drop in later without changing the design.</p>
      </div>

      {/* Mapping projects creates consistent article cards for scanning and responsive wrapping. */}
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card case-study-card" key={project.title}>
            <div className="project-info">
              {/* Structured fields make each project read like a concise security case study. */}
              <div className="case-study-meta">
                <span>{project.area}</span>
                <strong>{project.title}</strong>
              </div>
              <div className="case-study-field">
                <span>Objective</span>
                <p>{project.objective}</p>
              </div>
              <div className="case-study-field">
                <span>Scope</span>
                <p>{project.scope}</p>
              </div>
              <div className="case-study-field">
                <span>Signal</span>
                <p>{project.signal}</p>
              </div>
              <p className="project-outcome">{project.outcome}</p>

              {/* Tech tags are individual spans so CSS can wrap them like compact labels. */}
              <div className="project-tech">
                {project.tech.map((tech) => (
                  <span className="tech-tag" key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
