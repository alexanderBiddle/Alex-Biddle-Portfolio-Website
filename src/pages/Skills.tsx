type SkillGroup = {
  title: string;
  icon: string;
  items: string[];
};

const skillGroups: SkillGroup[] = [
  {
    title: 'Programming Languages',
    icon: 'fa-code',
    items: ['Python', 'C', 'C++', 'AFSIM', 'Java', 'JavaScript', 'TypeScript', 'MIPS', 'MATLAB', 'LaTeX'],
  },
  {
    title: 'Tools and Environments',
    icon: 'fa-terminal',
    items: ['Windows', 'Linux', 'SSH', 'Apache',  'Git', 'Overleaf', 'Wireshark', 'nmap', 'tcpdump'],
  },
  {
    title: 'Secure Software Engineering',
    icon: 'fa-user-shield',
    items: [
      'Input validation & access control',
      'Memory-safe programming',
      'Injection & deserialization defense',
      'Static, dynamic & security testing',
    ],
  },
  {
    title: 'Systems Programming and Operating Systems',
    icon: 'fa-microchip',
    items: [
      'C/C++ memory management & pointers',
      'UNIX syscalls, signals & IPC',
      'Process scheduling, threads & synchronization',
      'Multi threaded programming & performance optimization',
      'Computer organization & MIPS assembly',
    ],
  },
  {
    title: 'Network Architecture and Secure Communications',
    icon: 'fa-network-wired',
    items: [
      'TCP/IP, UDP, HTTP/HTTPS, routing & switching',
      'Protocol trust boundaries & spoofing risk',
      'Confidentiality, integrity & session management',
      'Packet capture and analysis with Wireshark, tcpdump, nmap',
    ],
  },
  {
    title: 'Threat-Driven Security Analysis',
    icon: 'fa-shield-halved',
    items: [
      'Attack-surface identification & failure-mode modeling',
      'System hardening & control validation',
      'DoS analysis: UDP/ICMP floods & reflection',
      'Resource exhaustion & latency measurement',
      'Rate limiting, filtering & access control strategies',
    ],
  },
  {
    title: 'Simulation and Mission Analysis',
    icon: 'fa-chart-line',
    items: [
      'AFSIM scenario & behavior modeling',
      'Red vs Blue system-response logic',
      'Monte Carlo output processing',
      'Mission-oriented documented analysis',
    ],
  },
  {
    title: 'Quantitative Engineering Foundations',
    icon: 'fa-calculator',
    items: [
      'Calculus, linear algebra & differential equations',
      'Physics lab analysis & computer modeling',
      'Statics, dynamics & solid mechanics',
      'Mathematical physics & geometric reasoning',
    ],
  },
];

export default function Skills() {
  return (
    <section className="page-shell skills" id="skills">
      <div className="section-heading">
        <p className="eyebrow">Skills</p>
        <h1>Technical range across<br />secure software,<br />systems, networks,<br />simulation analysis.</h1>
      </div>

      <div className="skills-grid">
        {skillGroups.map((skill) => (
          <article className="skill-card spotlight-card" key={skill.title}>
            <div className="skill-card-identity">
              <div className="skill-icon-wrap">
                <i className={`fa-solid ${skill.icon}`}></i>
              </div>
              <h2 className="skill-card-title">{skill.title}</h2>
            </div>
            <ul className="skill-tags">
              {skill.items.map((item) => (
                <li key={item}><span>{item}</span></li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
