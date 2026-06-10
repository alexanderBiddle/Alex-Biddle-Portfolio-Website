type ExperienceEntry = {
  title: string;
  organization: string;
  department?: string;
  dates: string;
  summary: string;
  details: string[];
};

const experienceEntries: ExperienceEntry[] = [
  {
    title: 'Mission Analyst',
    organization: 'Naval Surface Warfare Center Dahlgren Division',
    dates: 'June 2024 – Present',
    summary:
      'Joined through the SSEP internship program as a Mission Analyst Intern and progressed into a full-time Mission Analyst role, building simulation models and analysis tooling in support of mission analysis.',
    details: [
      'Started as an SSEP Mission Analyst Intern and converted to a full-time Mission Analyst in March 2026.',
      'Led development of simulation models in the Advanced Framework for Simulation, Integration and Modeling (AFSIM) tool, driving scenario design and model architecture decisions in support of mission analysis.',
      'Built behavior logic and interfaces to model system responses to threat conditions for Red vs Blue scenarios in AFSIM.',
      'Created MATLAB, Python and Excel analysis scripts to process Monte Carlo outputs from AFSIM, turning raw simulation runs into usable mission-analysis results.',
      'Handled cross-team communication and task coordination, managing action items, tracking deliverables, and keeping collaborative projects aligned across the analysis team.',
      'Supported collaborative projects involving strategy concepts and task management across the analysis team.',
    ],
  },
  {
    title: 'IT Intern',
    organization: 'C2 - Essentials',
    dates: 'December 2023 – January 2024',
    summary: 'Supported internal staff, website content management, system maintenance, and troubleshooting.',
    details: [
      'Provided technical support to internal staff and assisted senior developers with website content management and system maintenance.',
      'Conducted maintenance, performance optimization and addressing computer-related issues',
      'Troubleshot hardware and software problems, ensuring smooth operation of IT systems.',
    ],
  },
];

export default function Experience() {
  return (
    <section className="page-shell experience" id="experience">
      <div className="section-heading">
        <p className="eyebrow">Experience</p>
        <h1>Mission analysis, <br />simulation modeling, <br />and technical support experience.</h1>
      </div>

      <div className="timeline" aria-label="Professional experience timeline">
        {experienceEntries.map((entry) => (
          <article className="spotlight-card" key={`${entry.title}-${entry.dates}`}>
            <div className="archive-meta">
              <h3>{entry.title}</h3>
              <p>{entry.organization}</p>
              {entry.department && <p>{entry.department}</p>}
              <time>{entry.dates}</time>
            </div>
            <p>{entry.summary}</p>
            <ul className="archive-list">
              {entry.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
