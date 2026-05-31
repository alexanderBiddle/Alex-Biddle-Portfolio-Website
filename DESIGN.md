---
name: BiddleSec Portfolio
description: Cybersecurity engineering portfolio with ink-black infrastructure and electric blue signal light.
colors:
  void-ink: "#000407"
  deep-cyber: "#000D16"
  grid-blue: "#001A2B"
  signal-deep: "#002945"
  signal-muted: "#006CB4"
  signal: "#0067AB"
  signal-bright: "#0D9EFF"
  signal-highlight: "#AEDFFF"
  text-primary: "#ACDEFF"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(3.8rem, 9vw, 9.6rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.09em"
  headline:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(2.05rem, 5vw, 4.8rem)"
    fontWeight: 800
    lineHeight: 1.01
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(1rem, 1.45vw, 1.18rem)"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(0.72rem, 1vw, 0.82rem)"
    fontWeight: 800
    letterSpacing: "0.14em"
  mono:
    fontFamily: "Consolas, Courier New, monospace"
    fontSize: "clamp(0.85rem, 1.2vw, 0.96rem)"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  framed: "8px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "clamp(3rem, 10vh, 7.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-highlight}"
    textColor: "{colors.void-ink}"
    rounded: "{rounded.framed}"
    padding: "0 18px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.signal-bright}"
    textColor: "{colors.void-ink}"
  button-secondary:
    backgroundColor: "{colors.deep-cyber}"
    textColor: "{colors.signal-highlight}"
    rounded: "{rounded.framed}"
    padding: "0 18px"
    height: "52px"
  card:
    backgroundColor: "{colors.deep-cyber}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.framed}"
    padding: "clamp(1.25rem, 2.5vw, 1.75rem)"
  chip:
    backgroundColor: "{colors.signal-deep}"
    textColor: "{colors.signal-highlight}"
    rounded: "{rounded.framed}"
    padding: "7px 10px"
---

# Design System: BiddleSec Portfolio

## Overview

**Creative North Star: "The Abyssal Blue Signal Grid"**

The interface is an ink-black security surface lit by selective electric-blue signals. Near-black infrastructure keeps the content grounded, while brighter blues appear where the system is active: focus rings, links, status markers, tags, radar geometry, and particle connections. The effect is cyberpunk without becoming costume.

The atmospheric galaxy keeps its existing broader low-volume spectrum of blue, violet, muted magenta, and warm energy. That local artwork is intentionally protected from interface palette changes. Content remains readable above the canvas and motion stays secondary to the portfolio narrative.

**Key Characteristics:**
- Ink-black core surfaces with controlled dark-blue depth.
- Saturated electric-blue signals used for hierarchy and interaction.
- Pale sky-blue text highlights for readable contrast.
- Square-framed controls with restrained 8px corners.
- Reactive canvas imagery that yields to content and reduced-motion settings.

## Colors

The palette separates infrastructure from illumination. Ink black and deep-space blue own the surface area; brighter Yale blue owns the signal.

### Primary
- **Cobalt Signal** (`signal`): Primary active-state color for status, selected states, and controlled glow.
- **Live Trace** (`signal-bright`): High-energy border, radar, network, and hover accent.
- **Signal Ice** (`signal-highlight`): Bright highlight for hero emphasis, focus rings, and primary controls.

### Secondary
- **Deep Relay** (`signal-deep`): Dark blue tint for quiet chips, framed outcomes, and subtle fills.
- **Muted Channel** (`signal-muted`): Supporting Yale blue for low-intensity visual layers.

### Neutral
- **Ink Void** (`void-ink`): Page and canvas base.
- **Deep Cyber Blue** (`deep-cyber`): Default panel and secondary-button surface.
- **Grid Blue** (`grid-blue`): Elevated panel surface and hover depth.
- **Readable Sky** (`text-primary`): Primary text color.

### Named Rules

**The Signal, Not Wash Rule.** Bright blue is prohibited as an all-screen overlay. Use ink black and deep-space blue for large surfaces, then reserve brighter Yale blue for meaningful illumination.

**The Protected Galaxy Rule.** The local galaxy renderer keeps its existing blue, violet, muted magenta, and warm spectrum. Product controls and the connection network stay within the supplied ink-black, deep-space-blue, and Yale-blue scales.

## Typography

**Display Font:** Plus Jakarta Sans (with sans-serif fallback)  
**Body Font:** Plus Jakarta Sans (with sans-serif fallback)  
**Label/Mono Font:** Consolas (with Courier New and monospace fallbacks)

**Character:** The primary type system is compact, direct, and contemporary. Monospace appears only where command-surface language is useful, never as a blanket shorthand for technical credibility.

### Hierarchy
- **Display** (800, `clamp(3.8rem, 9vw, 9.6rem)`, `0.88`): Home hero statement only.
- **Headline** (800, `clamp(2.05rem, 5vw, 4.8rem)`, `1.01`): Routed-page titles and major panels.
- **Title** (700 to 800, `clamp(1.15rem, 2vw, 1.42rem)`): Cards and grouped content.
- **Body** (400, `clamp(1rem, 1.45vw, 1.18rem)`, `1.75`): Supporting content with a readable maximum line length near 70 characters.
- **Label** (800, `clamp(0.72rem, 1vw, 0.82rem)`, `0.14em`, uppercase when used as metadata): Eyebrows, case-study fields, and compact status language.

### Named Rules

**The Technical Restraint Rule.** Use monospace only inside terminal-like content. Primary navigation, headings, and body text remain in the committed sans family.

## Elevation

Depth comes from ink-black and dark-blue tonal layering, thin blue-aware borders, and one ambient shadow. The system avoids decorative glass stacks. Blur is allowed only where a foreground control must remain readable over the animated canvas.

### Shadow Vocabulary
- **Ambient Panel** (`0 24px 70px rgba(0, 3, 5, 0.62)`): Shared panel and card separation from the reactive background.
- **Navigation Depth** (`0 16px 40px rgba(0, 3, 5, 0.54)`): Fixed navigation separation without a heavy drop shadow.
- **Signal Glow** (`0 0 18px rgba(0, 103, 171, 0.9)`): Status dots and rare active indicators only.

### Named Rules

**The Dark Infrastructure Rule.** Shadows remain ink-black. Blue glow is reserved for active signals and never used as a general elevation effect.

## Components

### Buttons
- **Shape:** Compact framed rectangle with gently controlled corners (`8px`).
- **Primary:** Signal Ice background with Ink Void text, minimum height `52px`.
- **Hover / Focus:** Primary hover shifts to Live Trace. All keyboard focus rings use Signal Ice with a `4px` offset.
- **Secondary:** Deep Cyber Blue surface, Signal Ice text, and a thin blue-aware border.

### Chips
- **Style:** Dark-blue tint, thin Live Trace border, Signal Ice text, and compact `7px 10px` spacing.
- **State:** Chips summarize technology and work types. They remain quiet enough to support card content.

### Cards / Containers
- **Corner Style:** Framed corners (`8px`), not soft rounded cards.
- **Background:** Deep Cyber Blue at rest and Grid Blue on interactive hover.
- **Shadow Strategy:** Use Ambient Panel only.
- **Border:** Thin, low-opacity Live Trace stroke.
- **Internal Padding:** `clamp(1.25rem, 2.5vw, 1.75rem)` for feature and project cards.

### Navigation
- **Style:** Fixed ink-black bar with a thin signal divider and restrained blur. Active links receive a low-opacity blue fill and a Live Trace border.
- **Mobile Treatment:** Stack brand and route controls below `860px`; preserve horizontal scrolling for links.

### Aether Signal Backdrop
- **Style:** A protected local galaxy renderer sits beneath an electric-blue particle network. The galaxy keeps its existing controlled blue, violet, muted magenta, and warm energy.
- **Behavior:** Pointer response never blocks foreground controls. Respect `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** use Ink Void and Deep Cyber Blue for most surface area.
- **Do** reserve Cobalt Signal and Live Trace for interactive, status, and hierarchy signals.
- **Do** preserve visible keyboard focus rings and reduced-motion behavior.
- **Do** use the atmospheric canvas as supporting imagery, with content readability taking priority.
- **Do** keep the cyberpunk feel controlled, technical, and credible.

### Don't:
- **Don't** create generic hacker-movie interfaces with a green wash over every surface.
- **Don't** use multicolor neon nightclub palettes that compete with the content.
- **Don't** introduce generic AI SaaS glassmorphism, soft gradient blobs, or repeated feature-card templates.
- **Don't** use editorial magazine styling that distracts from the security engineering focus.
- **Don't** add dense terminal cosplay that makes the portfolio harder to scan.
- **Don't** use colored side-stripe borders on cards or outcomes. Use a complete frame or tonal fill.
