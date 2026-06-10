import { useEffect, useRef, useState } from 'react';

/* A single documented field section inside a project record. */
type ProjectSection = {
  label: string;
  items: string[];
};

/* A credited author; an optional email renders the name as a mailto link (used for co-authors). */
type ProjectAuthor = {
  name: string;
  email?: string;
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
  authors: ProjectAuthor[];
  github?: string;
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
    authors: [
      { name: 'Alex Biddle' },
      /* Co-author: fill in Braeden's email to turn his name into a mailto link. */
      { name: 'Braeden Kinloch', email: 'kinlochbraeden@gmail.com' },
    ],
    /* Public repository link; leave empty to hide the source button. */
    github: 'https://github.com/alexanderBiddle/CipherSafe---Senior-Capstone-Password-Manager',
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
    authors: [{ name: 'Alex Biddle' }],
    /* Public repository link; leave empty to hide the source button. */
    github: '',
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

  /* trackRef = the tall pin spacer · consoleRef = the sticky card · contentRef = the clip window ·
     innerRef = the content that translates up as the pinned console is scrolled through. */
  const trackRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((project) => project.id === activeTab) ?? null;

  /* Switching tabs resets the record to its top. If the console is already pinned (or scrolled past),
     bring the page to the pin line so the new record reads from its first line. */
  useEffect(() => {
    const track = trackRef.current;
    const inner = innerRef.current;
    const nav = document.querySelector('.site-nav');

    if (!inner) {
      return;
    }

    inner.style.transform = 'translate3d(0, 0, 0)';

    if (!track || window.innerWidth <= 860) {
      return;
    }

    const navOffset = (nav instanceof HTMLElement ? nav.offsetHeight : 82) + 12;
    const pinStart = track.getBoundingClientRect().top + window.scrollY - navOffset;

    if (window.scrollY > pinStart) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: pinStart, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }, [activeTab]);

  /* Native sticky hand-off: the browser scrolls the page normally (stays on the compositor, so it is
     always smooth), the console is pinned with CSS `position: sticky`, and a passive scroll listener
     translates the inner content up as the page scrolls through the pin zone. The flow reads as one
     continuous motion — page scroll → pinned console reveals its content → page scroll — with no wheel
     interception and nothing to "jump", because control is never wrested from the browser. */
  useEffect(() => {
    const track = trackRef.current;
    const consoleEl = consoleRef.current;
    const viewport = contentRef.current;
    const inner = innerRef.current;

    if (!track || !consoleEl || !viewport || !inner) {
      return;
    }

    const nav = document.querySelector('.site-nav');
    const pinGap = 12;
    const clampValue = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    /* reel = how far the content overflows the clip window · pinStart = the page scroll position at
       which the console becomes pinned. Both are cached and only recomputed on layout changes. */
    let reel = 0;
    let pinStart = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      if (reel <= 0) {
        inner.style.transform = 'translate3d(0, 0, 0)';
        return;
      }
      const progress = clampValue(window.scrollY - pinStart, 0, reel);
      inner.style.transform = `translate3d(0, ${-progress}px, 0)`;
    };

    const measure = () => {
      /* The stacked mobile layout flows naturally — clear the pin spacer and any transform. */
      if (window.innerWidth <= 860) {
        reel = 0;
        track.style.height = '';
        inner.style.transform = '';
        return;
      }

      const navOffset = (nav instanceof HTMLElement ? nav.offsetHeight : 82) + pinGap;
      reel = Math.max(0, inner.scrollHeight - viewport.clientHeight);
      pinStart = track.getBoundingClientRect().top + window.scrollY - navOffset;
      /* Give the sticky console exactly `reel` worth of extra scroll distance to stay pinned. */
      track.style.height = `${consoleEl.offsetHeight + reel}px`;
      render();
    };

    /* Coalesce scroll events into one transform write per frame. */
    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(render);
      }
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    /* Re-measure when the record's height changes (tab switches, font/layout shifts). */
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(inner);
    resizeObserver.observe(viewport);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      resizeObserver.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      track.style.height = '';
      inner.style.transform = '';
    };
  }, []);

  return (
    <section className="page-shell projects-workspace" id="projects">
      <div className="section-heading">
        <p className="eyebrow">Projects</p>
        <h1>Implemented security engineering and controlled adversarial analysis.</h1>
        <p>
          Browse documented project records from the side navigation. Each tab opens a full case study.
        </p>
      </div>

      {/* The pin track is a tall spacer that gives the sticky console room to stay pinned while its
          inner content is scrolled through; its height is set in JS to match the content overflow. */}
      <div className="project-pin-track" ref={trackRef}>
      {/* The console is the expanded card surface: scrollable tab rail on the left, case study on the right. */}
      <div className="project-console spotlight-card" ref={consoleRef}>
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
          {/* This inner wrapper is translated up by the scroll listener to reveal lower content. */}
          <div className="project-content-scroll" ref={innerRef}>
          {activeProject ? (
            <article className="project-record">
              <div className="case-study-meta">
                <strong>{activeProject.title}</strong>
                {(activeProject.authors.length > 0 || activeProject.github) && (
                  <div className="project-byline">
                    {activeProject.authors.length > 0 && (
                      <div className="project-authors">
                        <span className="project-authors-label">
                          {activeProject.authors.length > 1 ? 'Authors' : 'Author'}
                        </span>
                        <p>
                          {activeProject.authors.map((author, index) => (
                            <span key={author.name}>
                              {index > 0 && ', '}
                              {author.email ? (
                                <a className="project-author-link" href={`mailto:${author.email}`}>
                                  {author.name}
                                </a>
                              ) : (
                                author.name
                              )}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                    {activeProject.github && (
                      <div className="project-links">
                        <a
                          className="project-doc-action"
                          href={activeProject.github}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-github"></i>
                          <span>View Source</span>
                        </a>
                      </div>
                    )}
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
      </div>
      </div>
    </section>
  );
};
