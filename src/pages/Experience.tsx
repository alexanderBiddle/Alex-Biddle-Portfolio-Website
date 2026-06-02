/* Experience entries publish the verified professional timeline without inventing role details. */
type ExperienceEntry = {
  number: string;
  title: string;
  organization: string;
  department?: string;
  dates: string;
  summary: string;
  details: string[];
};

const experienceEntries: ExperienceEntry[] = [
  {
    number: '01',
    title: 'Mission Analyst',
    organization: 'Naval Surface Warfare Center Dahlgren Division',
    department: 'V Department',
    dates: 'March 2026 - Present',
    summary: 'Progressed from the SSEP internship program into a full-time Mission Analyst role.',
    details: [
      'Transitioned from the SSEP Mission Analyst Intern role into full-time employment in March 2026.',
    ],
  },
  {
    number: '02',
    title: 'SSEP Mission Analyst Intern',
    organization: 'Naval Surface Warfare Center Dahlgren Division',
    department: 'M Department',
    dates: 'June 2024 - March 2026',
    summary: 'Developed simulation models and analysis scripts in support of mission analysis.',
    details: [
      'Developed simulation models in the Advanced Framework for Simulation, Integration and Modeling (AFSIM) tool to run simulated scenarios in support of mission analysis.',
      'Developed behavior logic and interfaces to model system responses to threat conditions for Red vs Blue scenarios in AFSIM.',
      'Supported collaborative projects involving strategy concepts and task management.',
      'Created MATLAB analysis scripts to process Monte Carlo outputs from AFSIM.',
    ],
  },
  {
    number: '03',
    title: 'IT Intern',
    organization: 'C2 - Essentials',
    dates: 'December 2023 - January 2024',
    summary: 'Supported internal staff, website content management, system maintenance, and troubleshooting.',
    details: [
      'Provided technical support to internal staff and assisted senior developers with website content management and system maintenance.',
      'Performed maintenance and performance optimization while troubleshooting hardware and software issues.',
    ],
  },
];

export default function Experience() {
  return (
    <section className="page-shell experience" id="experience">
      <div className="section-heading">
        <p className="eyebrow">Experience</p>
        <h1>Mission analysis, simulation modeling, and technical support experience.</h1>
        <p>
          A professional record shaped by mission-oriented analysis, AFSIM scenario modeling, MATLAB output processing, collaborative strategy work, and hands-on IT support.
        </p>
      </div>

      <div className="split-layout archive-layout">
        <div className="glass-panel spotlight-card">
          <p className="panel-kicker">Professional Timeline</p>
          <h2>From analyst internship to full-time mission analysis</h2>
          <p>
            My work at Naval Surface Warfare Center Dahlgren Division began through the SSEP internship program and progressed into a full-time Mission Analyst role in March 2026.
          </p>
          <p>
            That foundation combines simulation, threat-condition modeling, quantitative output analysis, teamwork, and clear technical documentation.
          </p>
        </div>

        <div className="timeline" aria-label="Professional experience timeline">
          {experienceEntries.map((entry) => (
            <article className="spotlight-card" key={`${entry.title}-${entry.dates}`}>
              <span>{entry.number}</span>
              <div className="archive-meta">
                <h3>{entry.title}</h3>
                <p>{entry.organization}</p>
                {entry.department && <p>{entry.department}</p>}
                <strong>{entry.dates}</strong>
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
      </div>
    </section>
  );
};
