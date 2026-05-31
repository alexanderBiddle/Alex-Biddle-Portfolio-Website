---
name: BiddleSec Portfolio
description: Cybersecurity engineering portfolio with graphite infrastructure and emerald signal light.
colors:
  void-graphite: "#05080B"
  deep-cyber: "#0B1115"
  grid-graphite: "#111C1E"
  signal-deep: "#064E3B"
  signal-muted: "#0B6B58"
  signal: "#0A8F68"
  signal-bright: "#35D39A"
  signal-highlight: "#B7F7DD"
  text-primary: "#DCEFE8"
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
    textColor: "{colors.void-graphite}"
    rounded: "{rounded.framed}"
    padding: "0 18px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.signal-bright}"
    textColor: "{colors.void-graphite}"
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

**Creative North Star: "The Emerald Signal Grid"**

The interface is a graphite security surface lit by selective emerald signals. Near-black infrastructure keeps the content grounded, while cyber-green appears where the system is active: focus rings, links, status markers, tags, radar geometry, and particle connections. The effect is cyberpunk without becoming costume.

The atmospheric backdrop uses a broader low-volume spectrum of blue, violet, muted magenta, mint, and emerald energy. This prevents a green wash while preserving the electronic signal-field identity. Content remains readable above the canvas and motion stays secondary to the portfolio narrative.

**Key Characteristics:**
- Graphite-black core surfaces with controlled depth.
- Saturated emerald signals used for hierarchy and interaction.
- Pale mint text highlights for readable contrast.
- Square-framed controls with restrained 8px corners.
- Reactive canvas imagery that yields to content and reduced-motion settings.

## Colors

The palette separates infrastructure from illumination. Graphite owns the surface area; emerald owns the signal.

### Primary
- **Encrypted Emerald** (`signal`): Primary active-state color for status, selected states, and controlled glow.
- **Live Trace** (`signal-bright`): High-energy border, radar, network, and hover accent.
- **Signal Mint** (`signal-highlight`): Bright highlight for hero emphasis, focus rings, and primary controls.

### Secondary
- **Deep Relay** (`signal-deep`): Dark green tint for quiet chips, framed outcomes, and subtle fills.
- **Muted Channel** (`signal-muted`): Supporting dark teal-green for low-intensity visual layers.

### Neutral
- **Graphite Void** (`void-graphite`): Page and canvas base.
- **Deep Cyber Graphite** (`deep-cyber`): Default panel and secondary-button surface.
- **Grid Graphite** (`grid-graphite`): Elevated panel surface and hover depth.
- **Readable Mineral** (`text-primary`): Primary text color.

### Named Rules

**The Signal, Not Wash Rule.** Green is prohibited as an all-screen overlay. Use graphite for large surfaces and emerald for meaningful illumination.

**The Controlled Spectrum Rule.** Blue, violet, and muted magenta may appear inside the atmospheric canvas only. Product controls stay graphite, emerald, and mint.

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

Depth comes from graphite tonal layering, thin emerald-aware borders, and one ambient shadow. The system avoids decorative glass stacks. Blur is allowed only where a foreground control must remain readable over the animated canvas.

### Shadow Vocabulary
- **Ambient Panel** (`0 24px 70px rgba(2, 6, 9, 0.62)`): Shared panel and card separation from the reactive background.
- **Navigation Depth** (`0 16px 40px rgba(2, 6, 9, 0.54)`): Fixed navigation separation without a heavy drop shadow.
- **Signal Glow** (`0 0 18px rgba(10, 143, 104, 0.9)`): Status dots and rare active indicators only.

### Named Rules

**The Dark Infrastructure Rule.** Shadows remain graphite-black. Green glow is reserved for active signals and never used as a general elevation effect.

## Components

### Buttons
- **Shape:** Compact framed rectangle with gently controlled corners (`8px`).
- **Primary:** Signal Mint background with Graphite Void text, minimum height `52px`.
- **Hover / Focus:** Primary hover shifts to Live Trace. All keyboard focus rings use Signal Mint with a `4px` offset.
- **Secondary:** Deep Cyber Graphite surface, Signal Mint text, and a thin mint-aware border.

### Chips
- **Style:** Dark emerald tint, thin Live Trace border, Signal Mint text, and compact `7px 10px` spacing.
- **State:** Chips summarize technology and work types. They remain quiet enough to support card content.

### Cards / Containers
- **Corner Style:** Framed corners (`8px`), not soft rounded cards.
- **Background:** Deep Cyber Graphite at rest and Grid Graphite on interactive hover.
- **Shadow Strategy:** Use Ambient Panel only.
- **Border:** Thin, low-opacity Live Trace stroke.
- **Internal Padding:** `clamp(1.25rem, 2.5vw, 1.75rem)` for feature and project cards.

### Navigation
- **Style:** Fixed graphite bar with a thin signal divider and restrained blur. Active links receive a low-opacity emerald fill and a Live Trace border.
- **Mobile Treatment:** Stack brand and route controls below `860px`; preserve horizontal scrolling for links.

### Aether Signal Backdrop
- **Style:** A local galaxy renderer sits beneath a mint-and-emerald particle network. The galaxy may contain controlled blue, violet, and muted magenta energy so emerald remains an accent.
- **Behavior:** Pointer response never blocks foreground controls. Respect `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** use Graphite Void and Deep Cyber Graphite for most surface area.
- **Do** reserve Encrypted Emerald and Live Trace for interactive, status, and hierarchy signals.
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
