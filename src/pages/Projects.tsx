import { useState } from 'react';

/* A single documented field section inside a project record. */
type ProjectSection = {
  label: string;
  items: string[];
};

/* Each project becomes one side-nav tab plus its documented case-study content. */
type Project = {
  id: string;
  title: string;
  area: string;
  icon: string;
  summary: string;
  sections: ProjectSection[];
  tech: string[];
};

/* Adding a new entry here automatically renders a new scrollable side-nav tab. */
const projects: Project[] = [
  {
    id: 'ciphersafe',
    title: 'CipherSafe',
    area: 'Zero-Knowledge Cryptographic Vault Platform',
    icon: 'fa-shield-halved',
    summary: 'A secure password-vault platform designed so sensitive fields, including vault metadata, remain encrypted end to end and server-side plaintext exposure is prevented even under database compromise.',
    sections: [
      {
        label: 'Protocol Design',
        items: [
          'Engineered a custom four-way handshake protocol using HTTP/3 with TLS 1.3 to enforce explicit cryptographic state transitions, session binding, replay resistance, and authenticated key exchange.',
          'Implemented RSA-2048 OAEP for session-key wrapping and RSA-PSS for digital signatures across handshake phases.',
        ],
      },
      {
        label: 'Session Protection',
        items: [
          'Built AES-256-GCM session encryption with strict nonce tracking and replay detection.',
          'Added per-session nonce sets, TTL-based expiration, and atomic session-key rotation.',
          'Designed dual-salt Argon2id password derivation to separate client-side and server-side salts.',
        ],
      },
      {
        label: 'Boundary Hardening',
        items: [
          'Rejected base64 smuggling, oversized payloads, malformed ciphertext, and deserialization abuse at cryptographic boundaries.',
          'Implemented RSA key rotation with key identifiers, expiration enforcement, and backward-compatible active-session handling.',
          'Centralized error normalization and auditing to prevent cryptographic oracle leaks, timing disclosures, and sensitive error propagation.',
        ],
      },
    ],
    tech: ['Python', 'Flask', 'PostgreSQL', 'JavaScript', 'HTTP/3 with TLS 1.3', 'RSA-OAEP/PSS', 'AES-256-GCM', 'Argon2id'],
  },
  {
    id: 'security-defense-labs',
    title: 'Security & Defense Labs',
    area: 'Adversarial Network Analysis',
    icon: 'fa-network-wired',
    summary: 'Controlled security exercises used to evaluate system behavior, resilience, and service availability under realistic network-based attack conditions.',
    sections: [
      {
        label: 'Attack Modeling',
        items: [
          'Modeled network and system attack surfaces, protocol weaknesses, configuration weaknesses, and vulnerability impact.',
          'Implemented and analyzed UDP floods, ICMP floods, and ICMP reflection attacks.',
        ],
      },
      {
        label: 'Evidence Collection',
        items: [
          'Measured resource exhaustion, packet loss, latency degradation, and service availability.',
          'Correlated traffic volume, payload size, and system responsiveness using hping3, tcpdump, Wireshark, nmap, bmon, and ping.',
        ],
      },
      {
        label: 'Defensive Reasoning',
        items: [
          'Evaluated system-hardening effectiveness, spoofed source addressing, protocol misuse, and resilience against network attacks.',
          'Documented mitigation considerations based on observed attack outcomes.',
        ],
      },
    ],
    tech: ['System Security & Defense', 'DoS Analysis', 'Wireshark', 'tcpdump', 'nmap', 'hping3', 'bmon', 'ping'],
  },
];

export default function Projects() {
  /* 'home' shows the landing/overview; any project id swaps the content panel to that record. */
  const [activeTab, setActiveTab] = useState<string>('home');

  const activeProject = projects.find((project) => project.id === activeTab) ?? null;

  return (
    <section className="page-shell projects-workspace" id="projects">
      <div className="section-heading">
        <p className="eyebrow">Projects</p>
        <h1>Implemented security engineering and controlled adversarial analysis.</h1>
        <p>
          Browse documented project records from the side navigation. Each tab opens a full case study.
        </p>
      </div>

      {/* The console is the expanded card surface: scrollable tab rail on the left, case study on the right. */}
      <div className="project-console spotlight-card">
        <aside className="project-sidenav" aria-label="Project navigation">
          <p className="project-sidenav-label">Directory</p>

          {/* Scrollable wheel grows as more projects are added without resizing the console. */}
          <div className="project-sidenav-scroll" role="tablist" aria-orientation="vertical">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'home'}
              className={`project-tab${activeTab === 'home' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </button>

            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={activeTab === project.id}
                className={`project-tab${activeTab === project.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(project.id)}
              >
                <i className={`fa-solid ${project.icon}`}></i>
                <span>{project.title}</span>
              </button>
            ))}
          </div>

          <p className="project-sidenav-count">{projects.length} documented projects</p>
        </aside>

        <div className="project-content" role="tabpanel">
          {activeProject ? (
            <article className="project-record">
              <div className="case-study-meta">
                <span>{activeProject.area}</span>
                <strong>{activeProject.title}</strong>
              </div>
              <p className="project-summary">{activeProject.summary}</p>
              {activeProject.sections.map((section) => (
                <section className="case-study-section" key={section.label}>
                  <h3>{section.label}</h3>
                  <ul className="archive-list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
              <div className="project-tech">
                {activeProject.tech.map((tech) => (
                  <span className="tech-tag" key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ) : (
            <div className="project-landing">
              <p className="eyebrow">Project Archive</p>
              <h2>Documented security engineering work, organized as a reference.</h2>
              <p className="project-landing-lead">
                This space collects detailed records of implemented security projects and controlled adversarial
                analysis. Select a project from the directory to open its full case study, including design decisions,
                evidence collected, and the technologies involved.
              </p>

              <p className="project-landing-kicker">Open a project</p>
              <div className="project-directory">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className="project-directory-card"
                    onClick={() => setActiveTab(project.id)}
                  >
                    <div className="project-directory-icon">
                      <i className={`fa-solid ${project.icon}`}></i>
                    </div>
                    <div className="project-directory-body">
                      <span>{project.area}</span>
                      <strong>{project.title}</strong>
                      <p>{project.summary}</p>
                    </div>
                    <i className="fa-solid fa-arrow-right project-directory-go"></i>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
