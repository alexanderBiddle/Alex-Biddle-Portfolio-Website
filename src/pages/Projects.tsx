import { useEffect, useRef, useState } from 'react';

/* A single documented field section inside a project record. */
type ProjectSection = {
  label: string;
  items: string[];
};

/* A downloadable/viewable paper stored under public/documents and linked by absolute path. */
type ProjectDocument = {
  label: string;
  description: string;
  meta: string;
  file: string;
};

/* Each project becomes one side-nav tab plus its documented case-study content. */
type Project = {
  id: string;
  navbarTitle: string;
  title: string;
  authors: string[];
  icon: string;
  summary: string;
  sections: ProjectSection[];
  tech: string[];
  documents?: ProjectDocument[];
};

/* Adding a new entry here automatically renders a new scrollable side-nav tab. */
const projects: Project[] = [
  {
    id: 'ciphersafe',
    navbarTitle: 'CipherSafe',
    title: 'CipherSafe - Zero Knowledge Cryptographic Vault',
    authors: ['Alex Biddle', 'Braeden Kinloch'],
    icon: 'fa-shield-halved',
    summary: 'A zero-knowledge web-based password manager built so credentials are encrypted on the client before they ever reach the network. A split two-server design — a client view server and an isolated private API server — combined with end-to-end encryption, least privilege, and key separation keeps user plaintext unreachable even under full database compromise. Senior capstone project (CSCI 403) with Braeden Kinloch, advised by Dr. Elouni.',
    sections: [
      {
        label: 'Four-Way Handshake Protocol',
        items: [
          'Designed a custom four-way handshake — Client Hello, Server Hello, Client Encrypted Request, Server Encrypted Response — running entirely over TLS 1.3 and HTTP/3 to authenticate both parties, exchange keys, and establish an encrypted session.',
          'Client Hello transmits the client RSA-2048 public key, username, and ISO-8601 timestamp in the clear so the server can authenticate the message format and wrap a session key to that key.',
          'Server Hello generates a fresh 32-byte AES-256 session key, wraps it with RSA-OAEP (SHA-256) under the client public key, and returns an RSA-PSS signature over the session key, key identifier, and timestamp.',
          'After unwrapping the session key, all further payloads move to AES-256-GCM, ending RSA use for bulk data; every server response is RSA-PSS signed and verified before processing.',
        ],
      },
      {
        label: 'Zero-Knowledge Authentication',
        items: [
          'Implemented two-stage Argon2id derivation: the client hashes the master password with a client salt before transmission, and the server re-hashes that value with a separate server salt for storage.',
          'The plaintext master password never touches the server, and only the final server hash plus the two salts are persisted — preserving a true zero-knowledge model.',
          'Separated the salt-storage table from the master-user table so neither table alone can reconstruct a password if exposed.',
        ],
      },
      {
        label: 'Session & Key Management',
        items: [
          'AES-256-GCM authenticated encryption with a unique 12-byte nonce and 16-byte tag per ciphertext, with associated data binding timestamps and usernames to each message.',
          'Automatic RSA-2048 key-pair rotation every 24 hours; the private key is stored on disk under AES file encryption with restricted permissions while the public key is derived dynamically.',
          'Enforced a ±5-second timestamp drift window, per-session nonce tracking, and 15-minute session TTLs, with a cleanup thread destroying expired sessions every 60 seconds.',
        ],
      },
      {
        label: 'Database & Defensive Controls',
        items: [
          'PostgreSQL storage with per-user vault tables referenced by non-guessable UUIDs and AES-encrypted account entries; no plaintext credential is ever written to disk.',
          'BLAKE2b-256 message checksums validated before any decryption or signature verification to detect tampering across transit.',
          'Rate limiting to three login attempts per minute per IP, plus audit logging of request metadata, outcomes, key identifiers, and checksums; all server errors normalize through a single handler to prevent cryptographic oracle and timing leaks.',
        ],
      },
    ],
    tech: ['Python', 'Flask', 'Apache','PostgreSQL', 'JavaScript', 'TLS 1.3 / HTTP/3', 'RSA-2048 OAEP/PSS', 'AES-256-GCM', 'Argon2id', 'BLAKE2b-256'],
    documents: [
      {
        label: 'CipherSafe Capstone Paper',
        description: 'Full senior capstone write-up: system design, two-server zero-knowledge architecture, database schema, security practices, and future work.',
        meta: 'PDF · 14 pages',
        file: '/documents/CipherSafe-Capstone-Paper.pdf',
      },
      {
        label: 'Four-Way Handshake Specification',
        description: 'Protocol deep-dive: per-step JSON packet fields, HTTP interfaces, the encryption process, and the cryptographic properties of each handshake phase.',
        meta: 'PDF · 6 pages',
        file: '/documents/CipherSafe-Four-Way-Handshake.pdf',
      },
    ],
  },
  {
    id: 'security-defense-labs',
    navbarTitle: 'RMC Security & Defense Labs',
    title: 'RMC Security & Defense Labs - Adversarial Network Analysis',
    authors: ['Alex Biddle'],
    icon: 'fa-network-wired',
    summary: 'Controlled security exercises used to evaluate system behavior, resilience, and service availability under realistic network-based attack conditions.',
    sections: [
      {
        label: 'Attack Modeling',
        items: [
          'Mapped attack surfaces across a controlled lab range with assigned target and attacker hosts, identifying protocol and configuration weaknesses to drive each exercise.',
          'Executed UDP flood attacks with hping3 from parallel spoofed-source SSH sessions, sweeping payloads from 64 to 5000 bytes across multiple ports (80, 123) to maximize resource consumption.',
          'Carried out ICMP flood and ICMP reflection attacks using spoofed source and reflector addresses, escalating payloads up to 5120 bytes to compare direct flooding against amplification through a misconfigured reflector.',
          'Built an ARP cache poisoning tool (poisonarp.py) that forges spoofed ARP replies binding a victim IP to the attacker MAC, continuously re-poisoning the cache to hold a man-in-the-middle position and intercept redirected traffic.',
        ],
      },
      {
        label: 'Evidence Collection',
        items: [
          'Established per-host baselines with bmon (~200–400 bytes/sec at rest) and ping round-trip times (~0.7–0.9 ms) before each attack to quantify impact.',
          'Captured and correlated traffic volume, payload size, packet loss, and latency using bmon, tcpdump, Wireshark, nmap, hping3, and ping across attacker, target, and reflector nodes.',
          'Measured DoS effectiveness directly: floods drove the target from a ~400 byte/sec baseline to 11–12 MiB/sec, degrading echo-reply latency from under 1 ms to 8–9 ms and forcing packet-queue drops.',
          'Verified ARP poisoning by diffing the victim ARP table before and after and confirming through tcpdump that traffic for the spoofed host was rerouted to the attacker, with normal routing restored once the attack stopped.',
        ],
      },
      {
        label: 'Defensive Reasoning',
        items: [
          'Evaluated host-hardening effectiveness and spoofing behavior — including why a correctly configured Linux host drops unsolicited ICMP reflection requests while a misconfigured reflector amplifies them.',
          'Analyzed defense-in-depth across the network stack: OSI versus Internet-model layering, tunneling, and VPNs for confidentiality and integrity over untrusted networks.',
          'Documented mitigations — rate limiting, ingress/egress filtering, and anti-spoofing — from observed outcomes and residual availability, noting SSH and other TCP services surviving an ICMP flood.',
          'Implemented defensive countermeasures in practice by building an end-to-end encrypted chat server in C, using Diffie-Hellman (ffdhe2048) key exchange, SHA-256 key derivation, and AES-256-CTR over OpenSSL 3.0 so a relay server never sees plaintext, then flagged its MITM exposure from unauthenticated public keys.',
        ],
      },
    ],
    tech: ['System Security & Defense', 'DoS Analysis', 'ARP Poisoning', 'Diffie-Hellman', 'AES-256-CTR', 'OpenSSL', 'Wireshark', 'tcpdump', 'nmap', 'hping3', 'bmon', 'ping'],
  },
];

/* Public assets are served under Vite's configured base path, so document links must be prefixed with it. */
const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export default function Projects() {
  /* 'home' shows the landing/overview; any project id swaps the content panel to that record. */
  const [activeTab, setActiveTab] = useState<string>('home');

  /* The scroll panel is reset to its top whenever the active record changes. */
  const contentRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((project) => project.id === activeTab) ?? null;

  /* Switching tabs eases the panel back to the top instead of jumping, keeping scroll motion continuous. */
  useEffect(() => {
    const panel = contentRef.current;

    if (!panel) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [activeTab]);

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
                <span>{project.navbarTitle}</span>
              </button>
            ))}
          </div>

          <p className="project-sidenav-count">{projects.length} documented projects</p>
        </aside>

        <div className="project-content" role="tabpanel" ref={contentRef}>
          {activeProject ? (
            <article className="project-record">
              <div className="case-study-meta">
                <strong>{activeProject.title}</strong>
                {activeProject.authors.length > 0 && (
                  <div className="project-authors">
                    <span className="project-authors-label">
                      {activeProject.authors.length > 1 ? 'Authors' : 'Author'}
                    </span>
                    <p>{activeProject.authors.join(', ')}</p>
                  </div>
                )}
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

              {activeProject.documents && activeProject.documents.length > 0 && (
                <section className="case-study-section project-docs">
                  <h3>Documentation</h3>
                  <div className="project-doc-list">
                    {activeProject.documents.map((doc) => (
                      <article className="project-doc" key={doc.file}>
                        <div className="project-doc-icon">
                          <i className="fa-solid fa-file-pdf"></i>
                        </div>
                        <div className="project-doc-body">
                          <strong>{doc.label}</strong>
                          <span className="project-doc-meta">{doc.meta}</span>
                          <p>{doc.description}</p>
                        </div>
                        <div className="project-doc-actions">
                          <a
                            className="project-doc-action"
                            href={withBase(doc.file)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa-solid fa-eye"></i>
                            <span>View</span>
                          </a>
                          <a className="project-doc-action" href={withBase(doc.file)} download>
                            <i className="fa-solid fa-download"></i>
                            <span>Download</span>
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
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
