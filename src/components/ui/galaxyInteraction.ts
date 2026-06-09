/* Rule for galaxy drag-to-orbit: a drag may begin only over open background, never while a visitor
   is reading or selecting text inside a card surface. The ambient AetherFlow particle field stays
   pointer-reactive everywhere and intentionally does not use this gate. */

/* Card surfaces plus the text/controls that live inside them — anywhere the pointer should belong
   to the page (reading, selecting, clicking) instead of repelling particles or orbiting the galaxy. */
const QUIET_SELECTOR = [
  '.spotlight-card',
  '.glass-panel',
  '.section-heading',
  'nav',
  'header',
  'footer',
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'li',
  'span',
  'strong',
  'em',
  'code',
].join(', ');

/* True when the element under the pointer is a card or text content, so galaxy interaction pauses. */
export const isGalaxyQuietTarget = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(QUIET_SELECTOR) !== null;
