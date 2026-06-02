/* Card data drives a complete technical archive grounded in the resume and completed coursework. */
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
      'Object-oriented design using efficient data structures and algorithms',
      'Input validation, access control, audit logging, and defensive design',
      'Memory-safe programming and mitigation of buffer overflows, race conditions, injection, and insecure deserialization',
      'Static, dynamic, integration, and security-focused testing principles',
    ],
  },
  {
    title: 'Systems Programming and Operating Systems',
    icon: 'fa-microchip',
    items: [
      'C/C++ systems programming with memory management and pointers',
      'UNIX shells, system calls, signals, process management, interprocess communication, and concurrency',
      'Processes, threads, scheduling, synchronization, deadlocks, and memory management',
      'Computer organization, digital logic, memory organization, machine language, and MIPS assembly foundations',
    ],
  },
  {
    title: 'Network Architecture and Secure Communications',
    icon: 'fa-network-wired',
    items: [
      'TCP/IP, UDP, HTTP/HTTPS, routing, switching, and client-server network applications',
      'Protocol trust boundaries, spoofing risk, reflection and amplification attacks, and layered defense strategies',
      'Confidentiality, integrity, authentication, authorization, session management, and encrypted exchange',
      'Packet capture, traffic generation, and behavior analysis with Wireshark, tcpdump, nmap, hping3, bmon, and ping',
    ],
  },
  {
    title: 'Threat-Driven Security Analysis',
    icon: 'fa-shield-halved',
    items: [
      'Attacker-behavior modeling, attack-surface identification, and failure-mode evaluation',
      'System hardening assessment, protocol misuse analysis, and control validation',
      'DoS analysis using UDP floods, ICMP floods, and ICMP reflection attacks',
      'Measurement of resource exhaustion, packet loss, latency degradation, and service availability',
    ],
  },
  {
    title: 'Simulation and Mission Analysis',
    icon: 'fa-chart-line',
    items: [
      'AFSIM scenario modeling and threat-condition behavior logic',
      'Red vs Blue system-response modeling',
      'MATLAB processing of Monte Carlo simulation outputs',
      'Documented analysis for mission-oriented environments',
    ],
  },
  {
    title: 'Quantitative Engineering Foundations',
    icon: 'fa-calculator',
    items: [
      'Calculus, multivariable analysis, linear algebra, and differential-equation modeling',
      'Physics laboratory analysis, computer modeling, and context-rich problem solving',
      'Statics, dynamics, stress, strain, deformation, and solid-material failure analysis',
      'Geometric reasoning and mathematical-physics foundations',
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

      <div className="archive-summary glass-panel spotlight-card">
        <p className="panel-kicker">Technical Archive</p>
        <h2>Security engineering backed by systems, networking, simulation, and quantitative analysis.</h2>
        <p>
          The archive combines implementation skills with threat-driven reasoning: understand the system, validate its assumptions, measure its behavior, and document the result.
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
