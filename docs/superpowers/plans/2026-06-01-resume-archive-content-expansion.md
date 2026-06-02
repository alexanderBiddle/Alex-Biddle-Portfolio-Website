# Resume Archive Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic portfolio placeholders with a complete, verified resume archive across Experience, Education, Skills, Projects, and Contact routes.

**Architecture:** Keep each routed page self-contained, following the repository's existing pattern of typed data arrays rendered into repeated DOM sections. Add focused archive styles to `src/index.css` without altering the existing navbar, animated backdrop, or spotlight behavior. Extend the static source tests so unsupported placeholders and protocol wording regressions fail before build verification.

**Tech Stack:** React 19, TypeScript, Vite, Node test runner, CSS

---

## File Structure

- Modify: `tests/portfolioRoutes.test.ts`
  - Add source-level assertions for the verified professional record and remove-placeholder requirements.
- Modify: `src/pages/Experience.tsx`
  - Render the verified NSWC Dahlgren progression and C2 - Essentials internship.
- Modify: `src/pages/Education.tsx`
  - Render Randolph-Macon credentials, certifications, grouped completed coursework, and catalog-backed competency summaries.
- Modify: `src/pages/Skills.tsx`
  - Render programming, tooling, security engineering, systems, networking, analysis, simulation, and quantitative foundations.
- Modify: `src/pages/Projects.tsx`
  - Render the full CipherSafe and Security & Defense Labs case studies.
- Modify: `src/pages/Contact.tsx`
  - Replace placeholder destinations with the corrected email, LinkedIn, and GitHub URLs.
- Modify: `src/index.css`
  - Add archive-specific list, metadata, coursework, and project-section styles. Preserve pre-existing uncommitted navbar CSS changes.

## Accuracy Guardrails

- Do not publish a degree type because the resume does not state one.
- Do not claim completion of courses absent from the resume.
- Treat every course listed in the supplied resume as completed coursework.
- Use `HTTP/3 with TLS 1.3`, never `HTTPS 3.0`.
- Describe the current Mission Analyst role conservatively because the user confirmed the title, department, and date but did not provide a new responsibility list.
- Preserve the existing uncommitted liquid-glass navbar work.

### Task 1: Add Resume Archive Regression Tests

**Files:**
- Modify: `tests/portfolioRoutes.test.ts`

- [ ] **Step 1: Add failing route-content assertions**

Append:

```ts
test('experience page publishes the verified employment timeline', () => {
  const source = readFileSync(new URL('../src/pages/Experience.tsx', import.meta.url), 'utf8');

  assert.match(source, /Mission Analyst/);
  assert.match(source, /V Department/);
  assert.match(source, /March 2026 - Present/);
  assert.match(source, /SSEP Mission Analyst Intern/);
  assert.match(source, /M Department/);
  assert.match(source, /June 2024 - March 2026/);
  assert.match(source, /C2 - Essentials/);
  assert.doesNotMatch(source, /Verified role names, organizations, and dates can be added/);
});

test('education page publishes verified Randolph-Macon credentials and completed coursework', () => {
  const source = readFileSync(new URL('../src/pages/Education.tsx', import.meta.url), 'utf8');

  assert.match(source, /Randolph-Macon College/);
  assert.match(source, /February 2026/);
  assert.match(source, /Cybersecurity/);
  assert.match(source, /Computer Science/);
  assert.match(source, /Engineering Physics/);
  assert.match(source, /Mathematics/);
  assert.match(source, /CS & Cybersecurity GPA: 4\.0/);
  assert.match(source, /CompTIA Security\+/);
  assert.match(source, /System Security & Defense/);
  assert.match(source, /Higher Geometry/);
  assert.doesNotMatch(source, /Bachelor of (Arts|Science)/);
});

test('skills page publishes the resume technical archive', () => {
  const source = readFileSync(new URL('../src/pages/Skills.tsx', import.meta.url), 'utf8');

  assert.match(source, /Rust/);
  assert.match(source, /MIPS/);
  assert.match(source, /AFSIM/);
  assert.match(source, /Wireshark/);
  assert.match(source, /Systems Programming and Operating Systems/);
  assert.match(source, /Threat-Driven Security Analysis/);
});

test('projects page publishes verified case studies with corrected protocol wording', () => {
  const source = readFileSync(new URL('../src/pages/Projects.tsx', import.meta.url), 'utf8');

  assert.match(source, /CipherSafe/);
  assert.match(source, /Security & Defense Labs/);
  assert.match(source, /HTTP\/3 with TLS 1\.3/);
  assert.match(source, /RSA-2048 OAEP/);
  assert.match(source, /AES-256-GCM/);
  assert.match(source, /Argon2id/);
  assert.match(source, /ICMP reflection attacks/);
  assert.doesNotMatch(source, /HTTPS 3\.0/);
  assert.doesNotMatch(source, /Representative directions/);
});

test('contact page uses the verified external destinations', () => {
  const source = readFileSync(new URL('../src/pages/Contact.tsx', import.meta.url), 'utf8');

  assert.match(source, /mailto:Alexbid2004@gmail\.com/);
  assert.match(source, /https:\/\/www\.linkedin\.com\/in\/alex-biddle12/);
  assert.match(source, /https:\/\/github\.com\/AlexanderBiddle/);
  assert.doesNotMatch(source, /alexander@example\.com/);
  assert.doesNotMatch(source, /href="#"/);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```powershell
npm.cmd test
```

Expected: FAIL because the routed pages still contain placeholders and do not publish the verified archive.

- [ ] **Step 3: Commit the failing regression tests if the worktree policy allows it**

```powershell
git add -- tests/portfolioRoutes.test.ts
git commit -m "test: define resume archive route content"
```

### Task 2: Replace Experience Placeholders

**Files:**
- Modify: `src/pages/Experience.tsx`
- Test: `tests/portfolioRoutes.test.ts`

- [ ] **Step 1: Replace practice placeholders with typed professional entries**

Use:

```tsx
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
```

Render each entry as one `timeline` article with:

```tsx
<span>{entry.number}</span>
<div className="archive-meta">
  <h3>{entry.title}</h3>
  <p>{entry.organization}</p>
  {entry.department && <p>{entry.department}</p>}
  <strong>{entry.dates}</strong>
</div>
<p>{entry.summary}</p>
<ul className="archive-list">
  {entry.details.map((detail) => <li key={detail}>{detail}</li>)}
</ul>
```

Update the page heading and supporting panel to describe a professional timeline, not an unpublished record.

- [ ] **Step 2: Run the Experience-related tests**

Run:

```powershell
npm.cmd test
```

Expected: Experience assertions PASS. Remaining new archive assertions still FAIL until later tasks.

- [ ] **Step 3: Commit the Experience route if requested**

```powershell
git add -- src/pages/Experience.tsx
git commit -m "feat: publish mission analyst experience"
```

### Task 3: Publish Education And Completed Coursework

**Files:**
- Modify: `src/pages/Education.tsx`
- Test: `tests/portfolioRoutes.test.ts`

- [ ] **Step 1: Replace placeholder education entries with verified credentials**

Define:

```tsx
const honors = ["Dean's List", 'ODAC All-Academic Award', 'ODAC All-Conference Award'];
const certifications = ['CompTIA Security+', 'CompTIA Network+', 'CompTIA Cloud Essentials'];

const courseGroups = [
  {
    title: 'Computer Science and Cybersecurity',
    summary: 'Completed work spanning software design, low-level systems, network protocols, secure software, attack defense, and applied machine learning.',
    courses: [
      'Data Structures',
      'Systems Programming',
      'Computer Organization',
      'Object-Oriented Programming',
      'Algorithms',
      'Machine Learning',
      'Privacy and Security',
      'Software Security',
      'Network Architecture and Protocols',
      'Computer and Data Security',
      'Operating Systems',
      'System Security & Defense',
    ],
  },
  {
    title: 'Mathematics and Engineering Physics',
    summary: 'Completed quantitative study covering calculus, differential-equation modeling, linear algebra, geometry, physics, statics, dynamics, and solid mechanics.',
    courses: [
      'Calculus I & II',
      'Differential Equations',
      'Multivariable Calculus',
      'Higher Geometry',
      'Linear Algebra',
      'Mathematical Physics',
      'Physics I & II',
      'Engineering Statics',
      'Mechanics of Solids',
      'Dynamics of Engineering Mechanics',
      'Modern Physics',
    ],
  },
];
```

Render:

```tsx
<div className="education-record glass-panel spotlight-card">
  <p className="panel-kicker">Randolph-Macon College</p>
  <h2>Cybersecurity and Computer Science</h2>
  <p>Graduated February 2026</p>
  <dl className="credential-grid">
    <div><dt>Majors</dt><dd>Cybersecurity & Computer Science</dd></div>
    <div><dt>Minors</dt><dd>Engineering Physics & Mathematics</dd></div>
    <div><dt>Academic Record</dt><dd>CS & Cybersecurity GPA: 4.0</dd></div>
  </dl>
</div>
```

Then render honors, certifications, and `courseGroups` with `.archive-tags`, `.coursework-grid`, `.coursework-group`, and `.archive-list`.

- [ ] **Step 2: Run the Education-related tests**

Run:

```powershell
npm.cmd test
```

Expected: Experience and Education assertions PASS. Skills, Projects, and Contact assertions still FAIL.

- [ ] **Step 3: Commit the Education route if requested**

```powershell
git add -- src/pages/Education.tsx
git commit -m "feat: publish education and completed coursework"
```

### Task 4: Expand The Skills Archive

**Files:**
- Modify: `src/pages/Skills.tsx`
- Test: `tests/portfolioRoutes.test.ts`

- [ ] **Step 1: Replace generic cards and remove the orbit-only summary**

Keep typed repeated data but replace the current six generic groups with:

```tsx
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
```

Render a compact summary panel before the card grid:

```tsx
<div className="archive-summary glass-panel spotlight-card">
  <p className="panel-kicker">Technical Archive</p>
  <h2>Security engineering backed by systems, networking, simulation, and quantitative analysis.</h2>
  <p>Capabilities are grounded in completed coursework, applied projects, controlled labs, and mission-analysis experience.</p>
</div>
```

Render `skillGroups` with the existing `.card-grid` and `.feature-card` pattern.

- [ ] **Step 2: Run the Skills-related tests**

Run:

```powershell
npm.cmd test
```

Expected: Experience, Education, and Skills assertions PASS. Projects and Contact assertions still FAIL.

- [ ] **Step 3: Commit the Skills route if requested**

```powershell
git add -- src/pages/Skills.tsx
git commit -m "feat: expand technical skills archive"
```

### Task 5: Publish The Verified Project Case Studies

**Files:**
- Modify: `src/pages/Projects.tsx`
- Test: `tests/portfolioRoutes.test.ts`

- [ ] **Step 1: Replace placeholder project data with two detailed project records**

Use:

```tsx
type Project = {
  title: string;
  area: string;
  summary: string;
  sections: { label: string; items: string[] }[];
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
```

Render each project with:

```tsx
<article className="project-card case-study-card spotlight-card" key={project.title}>
  <div className="project-info">
    <div className="case-study-meta">
      <span>{project.area}</span>
      <strong>{project.title}</strong>
    </div>
    <p className="project-summary">{project.summary}</p>
    {project.sections.map((section) => (
      <section className="case-study-section" key={section.label}>
        <h3>{section.label}</h3>
        <ul className="archive-list">
          {section.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    ))}
    <div className="project-tech">
      {project.tech.map((tech) => <span className="tech-tag" key={tech}>{tech}</span>)}
    </div>
  </div>
</article>
```

Update the heading copy to state that these are implemented projects and controlled labs.

- [ ] **Step 2: Run the Projects-related tests**

Run:

```powershell
npm.cmd test
```

Expected: Experience, Education, Skills, and Projects assertions PASS. Contact assertions still FAIL.

- [ ] **Step 3: Commit the Projects route if requested**

```powershell
git add -- src/pages/Projects.tsx
git commit -m "feat: publish security project case studies"
```

### Task 6: Correct Contact Destinations

**Files:**
- Modify: `src/pages/Contact.tsx`
- Test: `tests/portfolioRoutes.test.ts`

- [ ] **Step 1: Replace placeholder href values and visible labels**

Use:

```tsx
<div className="contact-panel">
  <a className="contact-link spotlight-card" href="mailto:Alexbid2004@gmail.com">
    <i className="fa-solid fa-envelope"></i>
    Alexbid2004@gmail.com
  </a>
  <a className="contact-link spotlight-card" href="https://www.linkedin.com/in/alex-biddle12" target="_blank" rel="noreferrer">
    <i className="fa-brands fa-linkedin-in"></i>
    linkedin.com/in/alex-biddle12
  </a>
  <a className="contact-link spotlight-card" href="https://github.com/AlexanderBiddle" target="_blank" rel="noreferrer">
    <i className="fa-brands fa-github"></i>
    github.com/AlexanderBiddle
  </a>
</div>
```

- [ ] **Step 2: Run the route-content test suite**

Run:

```powershell
npm.cmd test
```

Expected: PASS.

- [ ] **Step 3: Commit the Contact route if requested**

```powershell
git add -- src/pages/Contact.tsx
git commit -m "fix: publish verified contact links"
```

### Task 7: Add Archive Layout Styles

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add focused archive styles after the existing timeline styles**

Add:

```css
/* Archive metadata keeps role and credential details close to their primary heading. */
.archive-meta {
  display: grid;
  gap: 5px;
  margin-bottom: 14px;
}

.archive-meta p,
.archive-meta strong {
  color: var(--cyan);
  line-height: 1.45;
}

/* Dense archive lists use signal dots and readable line spacing without nested cards. */
.archive-list {
  display: grid;
  gap: 9px;
  margin-top: 14px;
  padding: 0;
  list-style: none;
}

.archive-list li {
  color: var(--muted);
  line-height: 1.68;
}

.archive-list li::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 50%;
  background: var(--signal);
}

/* Credential blocks group related academic facts while preserving the shared dark surface. */
.education-record,
.archive-summary {
  margin-bottom: 20px;
}

.credential-grid,
.coursework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 14px;
  margin-top: 18px;
}

.credential-grid div,
.coursework-group {
  padding: 14px;
  border: 1px solid rgb(var(--signal-bright-rgb) / 0.22);
  border-radius: var(--radius);
  background: rgb(var(--deep-cyber-rgb) / 0.42);
}

.credential-grid dt,
.coursework-group h3,
.case-study-section h3 {
  margin-bottom: 8px;
  color: var(--cyan);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.credential-grid dd,
.coursework-group p,
.project-summary {
  color: var(--muted);
  line-height: 1.68;
}

.archive-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

/* Project sections provide structure for longer verified implementation records. */
.case-study-section {
  padding: 16px 0;
  border-top: 1px solid rgb(var(--signal-bright-rgb) / 0.22);
}

.project-summary {
  margin-bottom: 14px;
}
```

- [ ] **Step 2: Inspect the CSS diff before staging**

Run:

```powershell
git diff -- src/index.css
```

Expected: the new archive styles appear alongside the already-existing liquid-glass navbar changes. Do not revert or overwrite those earlier changes.

- [ ] **Step 3: Run lint and build**

Run:

```powershell
npm.cmd run lint
npm.cmd run build
```

Expected: PASS.

- [ ] **Step 4: Leave CSS unstaged unless the user explicitly requests an implementation commit**

Because `src/index.css` already contains unrelated uncommitted navbar work, do not create a mixed commit without user approval.

### Task 8: Verify The Complete Portfolio Update

**Files:**
- Verify: `src/pages/Experience.tsx`
- Verify: `src/pages/Education.tsx`
- Verify: `src/pages/Skills.tsx`
- Verify: `src/pages/Projects.tsx`
- Verify: `src/pages/Contact.tsx`
- Verify: `src/index.css`
- Verify: `tests/portfolioRoutes.test.ts`

- [ ] **Step 1: Run automated verification**

Run:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: all commands PASS with no whitespace errors.

- [ ] **Step 2: Start or reuse the local development server**

Run:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 3000
```

Expected: Vite serves the portfolio at `http://127.0.0.1:3000/`.

- [ ] **Step 3: Inspect routed pages in the in-app browser**

Open:

```text
http://127.0.0.1:3000/#/Experience
http://127.0.0.1:3000/#/Education
http://127.0.0.1:3000/#/Skills
http://127.0.0.1:3000/#/Projects
http://127.0.0.1:3000/#/Contact
```

Verify at desktop and narrow viewport widths:

- Long bullets wrap without horizontal overflow.
- Coursework groups remain scannable.
- Project sections remain readable without nested-card clutter.
- Corrected email, LinkedIn, and GitHub destinations are present.
- Navbar controls and animated background still function.
- No placeholder professional content remains.

- [ ] **Step 4: Review the final diff without disturbing existing work**

Run:

```powershell
git status --short
git diff --stat
git diff --check
```

Expected: only intended resume-archive files plus the pre-existing liquid-glass navbar work appear.
