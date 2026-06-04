type SkillGroup = {
  title: string;
  icon: string;
  items: string[];
};

const skillGroups: SkillGroup[] = [
  {
    title: 'Programming Languages',
    icon: 'fa-code',
    items: ['Python', 'C', 'C++', 'Rust', 'Java', 'JavaScript', 'MIPS'],
  },
  {
    title: 'Tools and Environments',
    icon: 'fa-terminal',
    items: ['Windows', 'Linux', 'SSH', 'Apache', 'MATLAB', 'AFSIM', 'Git', 'Overleaf', 'Wireshark', 'nmap', 'tcpdump'],
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
      'Packet capture with Wireshark, tcpdump, nmap',
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
    ],
  },
  {
    title: 'Simulation and Mission Analysis',
    icon: 'fa-chart-line',
    items: [
      'AFSIM scenario & behavior modeling',
      'Red vs Blue system-response logic',
      'MATLAB Monte Carlo output processing',
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
        <h1>Technical range across secure software, systems, networks, simulation, and analysis.</h1>
        <p>
          Capabilities are grounded in completed coursework, applied projects, controlled labs, and mission-analysis experience.
        </p>
      </div>

      <div className="card-grid archive-card-grid">
        {skillGroups.map((skill) => (
          <article className="feature-card spotlight-card" key={skill.title}>
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
