# Resume Archive Content Expansion Design

## Goal

Replace generic portfolio placeholders with a complete, resume-style professional archive. The routed pages should present Alexander Biddle's verified work history, education, completed coursework, technical capabilities, projects, and contact links with enough depth for technical hiring teams to inspect the record.

## Scope

Update these routes:

- `Experience`
- `Education`
- `Skills`
- `Projects`
- `Contact`

Preserve the current BiddleSec visual system, responsive layouts, navbar work, animated backdrop, and spotlight behavior. This is a content expansion with targeted layout support, not a broader redesign.

## Source Of Truth

Use the supplied resume as the primary source for claims. Use the Randolph-Macon 2025-2026 catalog descriptions to expand listed completed courses into accurate competency language.

The user confirmed:

- Every course listed in the resume was completed.
- Randolph-Macon graduation was in February 2026.
- The current NSWC Dahlgren role is `Mission Analyst`, beginning March 2026.
- The current role is in `V Department`.
- The prior `SSEP Mission Analyst Intern` role ran from June 2024 through March 2026 in `M Department`.
- The corrected email address is `Alexbid2004@gmail.com`.
- Contact placeholders should be replaced with the resume's email, LinkedIn, and GitHub links.

Do not infer or publish a degree type because the supplied resume does not state whether the degree was a Bachelor of Arts or Bachelor of Science.

## Content Strategy

Use the user-selected resume-style archive approach. Favor completeness while grouping dense material into clearly labeled sections. Each page should be readable as a technical record rather than a marketing teaser.

Catalog descriptions may clarify demonstrated academic foundations, but they must not imply completion of courses that are absent from the resume. Catalog-backed summaries should paraphrase relevant course outcomes rather than reproduce catalog copy.

## Route Design

### Experience

Replace generic practice-area placeholders with a chronological professional record:

1. `Mission Analyst`, Naval Surface Warfare Center Dahlgren Division, `V Department`, `March 2026 - Present`
2. `SSEP Mission Analyst Intern`, Naval Surface Warfare Center Dahlgren Division, `M Department`, `June 2024 - March 2026`
3. `IT Intern`, `C2 - Essentials`, `December 2023 - January 2024`

The current Mission Analyst entry should accurately describe the same mission-analysis domain while avoiding invented changes in responsibility. The internship entry should preserve the resume's verified AFSIM, Red vs Blue behavior modeling, collaborative strategy support, and MATLAB Monte Carlo analysis bullets. The IT internship should preserve support, website content management, maintenance, performance optimization, and troubleshooting details.

### Education

Present the Randolph-Macon record prominently:

- Randolph-Macon College
- Graduated `February 2026`
- Majors: `Cybersecurity` and `Computer Science`
- Minors: `Engineering Physics` and `Mathematics`
- `CS & Cybersecurity GPA: 4.0`
- Honors: `Dean's List`, `ODAC All-Academic Award`, `ODAC All-Conference Award`
- Certifications: `CompTIA Security+`, `CompTIA Network+`, `CompTIA Cloud Essentials`

Add completed coursework grouped by discipline:

- Computer science and cybersecurity
- Mathematics and engineering physics

Use compact course labels and supporting competency summaries so the page remains navigable despite the amount of material.

### Skills

Replace the generic capability cards with a comprehensive technical archive:

- Programming languages: Python, C, C++, Rust, Java, JavaScript, MIPS
- Tools and environments: Windows, Linux, SSH, Apache, MATLAB, AFSIM, Git, Overleaf, Wireshark, nmap, tcpdump
- Secure software engineering
- Systems programming and operating systems
- Network architecture, protocols, and client-server security
- Threat-driven security analysis
- Adversarial traffic analysis and defensive assessment
- Simulation, modeling, and engineering analysis
- Mathematical and physics foundations

Use the resume bullets as the basis for detailed list items. Supplement them only with catalog-backed competency language tied to listed completed courses.

### Projects

Replace all placeholder project cards with two detailed case studies.

#### CipherSafe

Present:

- Zero-knowledge encrypted vault architecture
- Custom four-way handshake over TLS 1.3 and HTTP/3
- RSA-2048 OAEP and RSA-PSS
- AES-256-GCM with nonce tracking, replay detection, TTL expiration, and session key rotation
- Dual-salt Argon2id password derivation
- Protocol-level validation
- Cryptographic key lifecycle management
- Centralized error normalization and audit controls
- Technology stack

Use `HTTP/3`, not the resume's mistaken `HTTPS 3.0` wording.

#### Security & Defense Labs

Present:

- Controlled adversarial and defensive security analysis
- Attack-surface modeling
- DoS experimentation using UDP floods, ICMP floods, and ICMP reflection attacks
- Resource exhaustion, packet loss, latency degradation, and service-availability analysis
- Tooling such as hping3, tcpdump, Wireshark, nmap, bmon, and ping
- Mitigation reasoning around system hardening, spoofed source addressing, protocol misuse, and resilience

### Contact

Replace placeholders with:

- `mailto:Alexbid2004@gmail.com`
- `https://www.linkedin.com/in/alex-biddle12`
- `https://github.com/AlexanderBiddle`

Use destination labels that expose the actual identity or URL clearly enough for visitors to understand where each action leads.

## Layout Support

Reuse the existing dark infrastructure, thin signal borders, spotlight surfaces, section headings, and responsive route shell. Add only the CSS needed for:

- Expanded resume bullets
- Experience metadata
- Education credential groups
- Coursework groups
- Project case-study sections
- Skills category lists

Avoid nested decorative cards. Use tonal grouping, headings, compact tags, and complete-frame borders where separation is needed.

## Error Handling And Accuracy

- Keep external links explicit and valid.
- Use the corrected email address.
- Omit degree type.
- Do not claim unlisted coursework.
- Do not invent new responsibilities for the current Mission Analyst role.
- Use `HTTP/3 over TLS 1.3` language for CipherSafe where protocol details are described.

## Verification

Run:

- `npm test`
- `npm run lint`
- `npm run build`
- `git diff --check`

Then inspect the routed pages in the local browser at desktop and narrow viewport widths to confirm:

- Long resume bullets wrap cleanly.
- Dense coursework remains scannable.
- External contact links are correct.
- Existing navigation and backdrop behavior still work.
- No placeholder professional content remains on the updated routes.
