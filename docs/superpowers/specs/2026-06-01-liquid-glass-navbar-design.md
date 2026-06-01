# Liquid Glass Navbar Design

## Goal

Adapt the refraction effect from `dashersw/liquid-glass-js` to the persistent BiddleSec top navigation without replacing React Router links or weakening the existing accessibility behavior.

## Source Analysis

The reference repository is a vanilla JavaScript WebGL prototype built around `Container` and `Button` classes. Each glass surface owns a canvas and shader. The shader:

- Samples a page snapshot produced by `html2canvas`.
- Applies shape-aware masks for rounded rectangles, pills, and circles.
- Distorts texture coordinates near edges and rims.
- Applies optional center warp, ripple texture, corner enhancement, blur, and tint.
- Supports nested glass by allowing child controls to sample a parent container output.

The demo captures the page once and is optimized for prototype pages with mostly static imagery. This portfolio has an animated galaxy backdrop, so a direct class embed would create stale snapshots and would not align cleanly with React lifecycle management.

## Chosen Approach

Build a React-owned WebGL adaptation with one shared backdrop-texture manager and reusable glass surfaces.

The navbar shell, `AB` badge, and route controls remain semantic DOM links. Each enhanced surface receives a pointer-transparent canvas behind its content. The glass shader is adapted from the reference implementation and configured by surface role:

- Navbar shell: subtle rounded glass with low tint and restrained refraction.
- `AB` badge: compact rounded lens with stronger edge and rim visibility.
- Route controls: pill lenses with readable text and stronger active-state tint.

The `BiddleSec` wordmark stays outside the nested badge lens but inside the navbar shell so it remains stable and readable.

## Components

### `LiquidGlassSurface`

A reusable React component wraps existing semantic content and owns:

- Canvas lifecycle.
- WebGL context creation and cleanup.
- Shader compilation and uniform updates.
- Shape, radius, tint, and intensity configuration.
- Resize observation.
- Rendering updates when the shared backdrop texture changes.

The component must preserve child semantics. Links remain links; the canvas is decorative and uses `aria-hidden="true"` with `pointer-events: none`.

### Backdrop Texture Manager

A shared manager composites the existing fixed backdrop canvases into one offscreen viewport texture. It distributes that texture source to mounted surfaces. This is the primary path because the portfolio already owns dedicated galaxy and connection-network canvases; repeatedly rasterizing the complete document with `html2canvas` would be unnecessarily expensive and would lag behind the animated backdrop.

Texture refreshes are throttled to a restrained frame rate and occur:

- After initial mount.
- After viewport resize settles.
- During standard motion so the refracted galaxy and connection network remain current without adding another full-speed animation loop.

Reduced-motion mode renders a static texture after initial capture unless resize requires another composition. If one backdrop layer cannot be copied by the browser, the manager continues with the available layers rather than disabling navigation.

### Navbar Integration

`NavBar` keeps its current route data and React Router behavior. The fixed `<nav>` becomes the shell surface. The home badge and route links become nested enhanced surfaces through reusable wrappers or opt-in classes.

## Visual Behavior

- The outer navbar remains an ink-black security surface with a subtle refracted galaxy sample, a thin signal divider, and existing navigation depth.
- The `AB` badge uses a rounded framed lens consistent with the existing brand mark.
- Route links use pill-shaped lenses with restrained idle tint.
- Hover, focus, and active states increase signal-blue border and tint visibility without layout movement.
- Focus-visible rings remain explicit and meet the current interaction pattern.
- The mobile layout below `860px` continues to stack the brand row above horizontally scrollable route links.

## Fallbacks

If WebGL is unavailable, shader setup fails, or backdrop composition fails, navigation remains usable with the current CSS translucent dark-blue fallback. No fallback path may remove route labels, keyboard focus, or link behavior.

## Performance Constraints

- Use one shared composed texture rather than one background capture per surface.
- Cap texture refreshes below the backdrop renderer frame rate.
- Keep canvases pointer-transparent.
- Clean up observers, timers, subscriptions, WebGL allocations, and textures on unmount.
- Respect `prefers-reduced-motion`.

## Verification

- Add focused tests for configuration or pure helpers where the existing project structure supports them cleanly.
- Run `npm run lint`.
- Run `npm run build`.
- Inspect desktop and narrow viewport navbar states in the local browser.
- Confirm route clicks, active states, focus rings, reduced-motion behavior, and CSS fallback behavior.

## Source

- Reference repository: https://github.com/dashersw/liquid-glass-js
- Reference demo: https://dashersw.github.io/liquid-glass-js/
