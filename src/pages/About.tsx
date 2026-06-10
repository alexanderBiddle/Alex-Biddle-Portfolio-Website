import { Link } from 'react-router';

type ProcessStep = {
  title: string;
  text: string;
};

/* Compact headline stats rendered in the proof strip under the focus areas. */
type SnapshotStat = {
  value: string;
  label: string;
};

/* Each profile panel summarizes one detailed page and links out to it. */
type ProfilePanel = {
  kicker: string;
  title: string;
  paragraphs: string[];
  tags: { label: string; tone: 'tech' | 'cert' | 'honor' }[];
  to: string;
  linkLabel: string;
};

export default function About() {

  const snapshotStats: SnapshotStat[] = [
    {
      value: '4.0',
      label: 'CS & Cybersecurity GPA at Randolph-Macon College',
    },

    {
      value: '2024',
      label: 'At NSWC Dahlgren since June 2024 — SSEP intern to full-time Mission Analyst',
    },
  ];

  const processSteps: ProcessStep[] = [
    {
      title: 'Discovery',
      text: 'Map assets, assumptions, user flows, and exposed surfaces before deciding where to test.',
    },
    {
      title: 'Data Validation',
      text: 'Confirm findings with controlled evidence, clear reproduction notes, and realistic impact framing.',
    },
    {
      title: 'Frontend Design',
      text: 'Create clean React interfaces, workflow automation, and documentation that make security work easier to act on.',
    },
    {
      title: 'Code Security',
      text: 'Reduce attack surface through hardening, access review, logging awareness, and secure configuration choices.',
    },
    {
      title: 'Analysis Reports',
      text: 'Translate technical evidence into prioritized actions that developers, analysts, and stakeholders can use.',
    },
    {
      title: 'Threat Defense',
      text: 'Model adversary behavior, identify failure modes, and apply defensive controls to harden systems against real attack paths.',
    },
  ];

  const profilePanels: ProfilePanel[] = [
    {
      kicker: 'Experience',
      title: 'Mission analysis at NSWC Dahlgren',
      paragraphs: [
        'At the Naval Surface Warfare Center Dahlgren Division I lead development of simulation models in AFSIM, build behavior logic that drives Red vs Blue scenarios, and write the MATLAB, Python, and Excel tools to process Monte Carlo outputs into usable mission-analysis results.',
        'Before Dahlgren, an IT internship at C2-Essentials grounded me in the practical side of technology work. Supporting staff, maintaining systems, and troubleshooting hardware and software under real constraints.',
      ],
      tags: [
        { label: 'AFSIM', tone: 'tech' },
        { label: 'MATLAB', tone: 'tech' },
        { label: 'Python', tone: 'tech' },
        { label: 'Monte Carlo Analysis', tone: 'tech' },
      ],
      to: '/Experience',
      linkLabel: 'Full experience',
    },
    {
      kicker: 'Education',
      title: 'Randolph-Macon College, February 2026',
      paragraphs: [
        'Dual majors in Cybersecurity and Computer Science with minors in Engineering Physics and Mathematics, completed with a 4.0 GPA across CS and cybersecurity coursework — software security, operating systems, network architecture, system security and defense, and machine learning.',
      ],
      tags: [
        { label: "Dean's List", tone: 'honor' },
        { label: 'ODAC All-Academic', tone: 'honor' },
        { label: 'ODAC All-Conference', tone: 'honor' },
      ],
      to: '/Education',
      linkLabel: 'Full education record',
    },
    {
      kicker: 'Projects',
      title: 'Security engineering with documented evidence',
      paragraphs: [
        'CipherSafe, my senior capstone, is a zero-knowledge password manager that encrypts credentials on the client behind a custom four-way handshake — TLS 1.3, RSA-2048, AES-256-GCM, and Argon2id — so user plaintext stays unreachable even under full database compromise.',
        'The RMC Security & Defense Labs collect controlled adversarial exercises: UDP and ICMP flood attacks, ARP cache poisoning, and reflection analysis measured with packet-level evidence, plus an end-to-end encrypted chat server written in C using Diffie-Hellman key exchange.',
      ],
      tags: [
        { label: 'Zero-Knowledge Design', tone: 'tech' },
        { label: 'AES-256-GCM', tone: 'tech' },
        { label: 'Argon2id', tone: 'tech' },
        { label: 'DoS Analysis', tone: 'tech' },
        { label: 'ARP Poisoning', tone: 'tech' },
      ],
      to: '/Projects',
      linkLabel: 'Open project case studies',
    },
    {
      kicker: 'Technical Toolkit',
      title: 'Languages, systems, and security tooling',
      paragraphs: [
        'Python, C and C++, Java, JavaScript, and MATLAB are my working languages, backed by systems-programming fundamentals — UNIX syscalls, threads, and memory management — and network analysis with Wireshark, tcpdump, and nmap. Secure-software practice ties it together: input validation, memory safety, and security testing from design through delivery.',
      ],
      tags: [
        { label: 'Python', tone: 'tech' },
        { label: 'C / C++', tone: 'tech' },
        { label: 'Java', tone: 'tech' },
        { label: 'JavaScript', tone: 'tech' },
        { label: 'MATLAB', tone: 'tech' },
        { label: 'Wireshark', tone: 'tech' },
        { label: 'nmap', tone: 'tech' },
        { label: 'Linux', tone: 'tech' },
      ],
      to: '/Skills',
      linkLabel: 'Full skills breakdown',
    },
  ];

  /* Tag tones reuse the site-wide chip styles: cert/honor from Education, tech from Projects. */
  const tagClass = (tone: 'tech' | 'cert' | 'honor') =>
    tone === 'cert' ? 'cert-tag' : tone === 'honor' ? 'honor-tag' : 'tech-tag';

  return (
    <section className="page-shell about" id="about">
      <div className="section-heading">
        <p className="eyebrow">About</p>
        <h1>Security engineering with secure software development and mission analysis.</h1>
      </div>

      <div className="proof-strip" aria-label="Profile snapshot">
        {snapshotStats.map((stat) => (
          <article className="spotlight-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>

      <div className="split-layout">
        <div className="glass-panel spotlight-card">
          <p className="panel-kicker">Profile</p>
          <h2>Who I Am</h2>
          <p>
            I joined the Naval Surface Warfare Center Dahlgren Division through the SSEP internship program in June 2024 and progressed into a full-time Mission Analyst role in March 2026. Day to day I develop AFSIM simulation models, design the Red vs Blue behavior logic that models how systems respond to threat conditions, and write the MATLAB and Python tooling that turns Monte Carlo simulation runs into mission-analysis results people can act on.
          </p>
          <p>
            I graduated from Randolph-Macon College in February 2026 with dual majors in Cybersecurity and Computer Science and minors in Engineering Physics and Mathematics, finishing with a 4.0 GPA across my CS and cybersecurity coursework. Along the way I made the Dean's List and competed as a student-athlete with ODAC All-Academic and All-Conference honors.
          </p>
          <p>
            Threat defense is a core strength — modeling adversary behavior, identifying failure modes before they're exploited, and applying the controls that actually reduce risk rather than just checking compliance boxes. I approach security work by asking what an attacker would try, what a defender needs to see, and what a team needs to change next. That keeps the work grounded in evidence instead of theatrics. My supporting strength is software development with a security-first mindset: building clear interfaces, repeatable workflows, and documentation surfaces that make technical findings easier to understand and act on — with input validation, memory safety, and least-privilege design built in from the start, not patched in after the fact.
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

      <div className="archive-section-grid about-profile-grid">
        {profilePanels.map((panel) => (
          <section className="glass-panel spotlight-card" key={panel.kicker}>
            <p className="panel-kicker">{panel.kicker}</p>
            <h2>{panel.title}</h2>
            {panel.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="archive-tags">
              {panel.tags.map((tag) => (
                <span className={tagClass(tag.tone)} key={tag.label}>{tag.label}</span>
              ))}
            </div>
            <div className="panel-actions">
              <Link className="button secondary" to={panel.to}>{panel.linkLabel}</Link>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};
