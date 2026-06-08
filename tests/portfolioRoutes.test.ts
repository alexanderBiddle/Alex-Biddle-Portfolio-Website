import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const navbarSource = readFileSync(new URL('../src/components/NavBar.tsx', import.meta.url), 'utf8');
const routerSource = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');

test('navbar places Experience after About and Education after Skills', () => {
  const labels = [...navbarSource.matchAll(/label: '([^']+)'/g)].map((match) => match[1]);

  assert.deepEqual(labels, [
    'Home',
    'About',
    'Experience',
    'Skills',
    'Education',
    'Projects',
    'Contact',
  ]);
});

test('router exposes Experience and Education pages', () => {
  assert.match(routerSource, /import Experience\s+from "\.\/pages\/Experience\.tsx"/);
  assert.match(routerSource, /import Education\s+from "\.\/pages\/Education\.tsx"/);
  assert.match(routerSource, /\{ path: "\/Experience",\s+element: <Experience\s+\/> \}/);
  assert.match(routerSource, /\{ path: "\/Education",\s+element: <Education\s+\/> \}/);
});

test('new portfolio pages use the existing routed-page structure', () => {
  const experienceSource = readFileSync(new URL('../src/pages/Experience.tsx', import.meta.url), 'utf8');
  const educationSource = readFileSync(new URL('../src/pages/Education.tsx', import.meta.url), 'utf8');

  assert.match(experienceSource, /className="page-shell experience"/);
  assert.match(experienceSource, /className="timeline"/);
  assert.match(educationSource, /className="page-shell education"/);
  assert.match(educationSource, /className="education-record glass-panel spotlight-card"/);
  assert.match(educationSource, /className="coursework-grid"/);
});

test('experience page publishes the verified employment timeline', () => {
  const source = readFileSync(new URL('../src/pages/Experience.tsx', import.meta.url), 'utf8');

  assert.match(source, /Mission Analyst/);
  assert.match(source, /M Department → V Department/);
  assert.match(source, /June 2024 – Present/);
  assert.match(source, /SSEP Mission Analyst Intern/);
  assert.match(source, /converted to a full-time Mission Analyst in V Department in March 2026/);
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
