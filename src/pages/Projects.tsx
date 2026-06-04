type Project = {
  title: string;
  area: string;
  summary: string;
  sections: {
    label: string;
    items: string[];
  }[];
  tech: string[];
};

const projects: Project[] = [
  {
    title: 'CipherSafe',
    area: 'Zero-Knowledge Cryptographic Vault Platform',
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
    title: 'Security & Defense Labs',
    area: 'Adversarial Network Analysis',
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
  return (
    <section className="page-shell projects" id="projects">
      <div className="section-heading">
        <p className="eyebrow">Projects</p>
        <h1>Implemented security engineering and controlled adversarial analysis.</h1>
        <p>
          Detailed project records for a zero-knowledge cryptographic platform and hands-on security-defense labs.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card case-study-card spotlight-card project-info" key={project.title}>
            <div className="case-study-meta">
              <span>{project.area}</span>
              <strong>{project.title}</strong>
            </div>
            <p className="project-summary">{project.summary}</p>
            {project.sections.map((section) => (
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
              {project.tech.map((tech) => (
                <span className="tech-tag" key={tech}>{tech}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
