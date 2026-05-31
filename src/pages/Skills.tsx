import type { CSSProperties } from 'react'

/* Card data drives the skill grid so adding a capability creates one matching DOM card. */
type SkillGroup = {
  title: string;
  icon: string;
  items: string[];
};

/* The custom --i property gives CSS an index for positioning labels around the orbit. */
type OrbitStyle = CSSProperties & {
  '--i': number;
};

const skills: SkillGroup[] = [
  {
    title: 'Red Team Foundations',
    icon: 'fa-shield-halved',
    items: ['Recon workflows', 'Web app testing', 'Exploitation labs', 'Privilege escalation concepts'],
  },
  {
    title: 'Defensive Security',
    icon: 'fa-shield-virus',
    items: ['System hardening', 'Access control', 'Logging awareness', 'Incident response mindset'],
  },
  {
    title: 'Cybersecurity Engineering',
    icon: 'fa-user-shield',
    items: ['Threat modeling', 'Risk reduction', 'Secure configuration', 'Control validation'],
  },
  {
    title: 'Software Development',
    icon: 'fa-code',
    items: ['React interfaces', 'Vite builds', 'Responsive layouts', 'Component organization'],
  },
  {
    title: 'Analyst Workflow',
    icon: 'fa-magnifying-glass-chart',
    items: ['Evidence capture', 'Technical writing', 'Prioritization', 'Stakeholder-ready reporting'],
  },
  {
    title: 'Automation and Tooling',
    icon: 'fa-terminal',
    items: ['Git workflows', 'Node scripts', 'Repeatable validation', 'Documentation systems'],
  },
];

export default function Skills() {
  return (
    <section className="page-shell skills" id="skills">
      {/* Intro copy uses the same section-heading classes as the other routed pages. */}
      <div className="section-heading">
        <p className="eyebrow">Skills</p>
        <h1>Security capabilities built around offense, defense, engineering, and analysis.</h1>
        <p>Technical strengths shaped around testing assumptions, hardening systems, writing clear findings, and building software that supports security work.</p>
      </div>

      {/* Orbit labels receive an index-based CSS variable so each span can be positioned around the circle. */}
      <div className="skill-orbit" aria-label="Core skill orbit">
        {['Recon', 'Defense', 'Linux', 'Reports', 'Git', 'React', 'Risk', 'Logs'].map((skill, index) => (
          <span style={{ '--i': index } as OrbitStyle} key={skill}>{skill}</span>
        ))}
        <strong>Cyber<br />Ops</strong>
      </div>

      {/* Each skill object renders as a feature card with an icon, title, and list of supporting items. */}
      <div className="card-grid">
        {skills.map((skill) => (
          <article className="feature-card" key={skill.title}>
            <i className={`fa-solid ${skill.icon}`}></i>
            <h2>{skill.title}</h2>
            <ul>
              {skill.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
