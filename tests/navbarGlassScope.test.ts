import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const navbarSource = readFileSync(new URL('../src/components/NavBar.tsx', import.meta.url), 'utf8');
const stylesSource = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

test('navbar limits liquid-glass surfaces to route buttons', () => {
  assert.doesNotMatch(navbarSource, /role="navbar"/);
  assert.doesNotMatch(navbarSource, /role="badge"/);
  assert.doesNotMatch(navbarSource, /className="nav-brand"/);
  assert.match(navbarSource, /role="button"/);
});

test('navbar shell no longer uses the liquid-glass wrapper styles', () => {
  assert.doesNotMatch(stylesSource, /\.site-nav-glass\b/);
  assert.doesNotMatch(stylesSource, /\.liquid-glass-navbar\b/);
  assert.doesNotMatch(stylesSource, /\.nav-brand\b/);
  assert.match(stylesSource, /\.nav-link-glass\b/);
});

test('navbar centers the route-button group', () => {
  assert.match(stylesSource, /\.nav-links\s*\{[^}]*justify-content:\s*center;/);
});
