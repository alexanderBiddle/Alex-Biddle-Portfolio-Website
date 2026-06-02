# Liquid Glass Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live WebGL liquid-glass treatment to the BiddleSec top navbar shell, `AB` badge, and route controls while preserving semantic links, keyboard access, responsive behavior, and a CSS fallback.

**Architecture:** A shared backdrop manager composites the three existing fixed visual canvases into one throttled offscreen texture. Each `LiquidGlassSurface` owns a small WebGL canvas and renderer that samples that texture with shape-aware edge refraction, rim distortion, ripple, blur, and role-specific tint. The React navbar keeps its current `NavLink` structure and mounts decorative liquid-glass surfaces behind existing content.

**Tech Stack:** React 19, TypeScript, WebGL 1, Canvas 2D, React Router, CSS, Node built-in test runner, Vite.

---

## File Structure

- Create `src/components/ui/liquidGlassConfig.ts`: Pure preset and radius helpers shared by renderer and tests.
- Create `src/components/ui/liquidGlassConfig.test.ts`: Node tests for role presets and shape radius behavior.
- Create `src/components/ui/liquidGlassBackdrop.ts`: Singleton compositor that provides one throttled live backdrop texture to all glass renderers.
- Create `src/components/ui/liquidGlassRenderer.ts`: Imperative WebGL shader setup, resize, texture upload, draw, preset update, and cleanup.
- Create `src/components/ui/LiquidGlassSurface.tsx`: React lifecycle wrapper for decorative WebGL surfaces.
- Modify `src/components/NavBar.tsx`: Wrap navbar shell, `AB` badge, and route labels without changing `NavLink` semantics.
- Modify `src/index.css`: Add shell, badge, route-lens, canvas, active, hover, fallback, responsive, and reduced-motion styling.
- Modify `package.json`: Add a focused Node test command.

### Task 1: Preset Helpers

**Files:**
- Create: `src/components/ui/liquidGlassConfig.test.ts`
- Create: `src/components/ui/liquidGlassConfig.ts`
- Modify: `package.json`

- [ ] **Step 1: Add the focused Node test command**

Add:

```json
"test": "node --test src/components/ui/liquidGlassConfig.test.ts"
```

- [ ] **Step 2: Write failing tests for the desired configuration behavior**

Cover:

```ts
assert.equal(resolveLiquidGlassRadius('pill', 40, 8), 20);
assert.equal(resolveLiquidGlassRadius('rounded', 40, 8), 8);
assert.ok(getLiquidGlassPreset('navbar').tintOpacity < getLiquidGlassPreset('badge').tintOpacity);
assert.ok(getLiquidGlassPreset('button', true).tintOpacity > getLiquidGlassPreset('button').tintOpacity);
assert.equal(BACKDROP_TEXTURE_FPS, 18);
```

- [ ] **Step 3: Run the test and verify the missing module failure**

Run: `npm.cmd test`

Expected: FAIL because `liquidGlassConfig.ts` does not exist.

- [ ] **Step 4: Implement the pure preset helpers**

Create role-specific values with these fields:

```ts
type LiquidGlassPreset = {
  blurRadius: number;
  cornerBoost: number;
  edgeDistance: number;
  edgeIntensity: number;
  rimDistance: number;
  rimIntensity: number;
  rippleEffect: number;
  tintOpacity: number;
  warp: boolean;
};
```

Use `BACKDROP_TEXTURE_FPS = 18`, preserve a low-tint navbar shell, use stronger badge and button rims, and increase active-button tint and rim intensity.

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm.cmd test`

Expected: PASS.

### Task 2: Shared Backdrop Texture

**Files:**
- Create: `src/components/ui/liquidGlassBackdrop.ts`

- [ ] **Step 1: Implement the singleton manager**

Create a manager that:

- Queries `.local-nebula-canvas`, `.local-galaxy-canvas`, and `.aether-flow-canvas`.
- Draws available layers into one offscreen viewport-sized canvas.
- Notifies subscribers with `HTMLCanvasElement | null`.
- Caps standard-motion updates at `BACKDROP_TEXTURE_FPS`.
- Renders once in reduced-motion mode.
- Refreshes after resize.
- Starts on the first subscription and releases animation frames and listeners after the final unsubscribe.
- Continues when one layer cannot be copied.

- [ ] **Step 2: Run lint to catch lifecycle or type errors**

Run: `npm.cmd run lint`

Expected: PASS.

### Task 3: WebGL Renderer

**Files:**
- Create: `src/components/ui/liquidGlassRenderer.ts`

- [ ] **Step 1: Implement renderer setup and cleanup**

Expose:

```ts
type LiquidGlassRenderer = {
  dispose: () => void;
  render: (source: HTMLCanvasElement | null) => boolean;
  resize: () => void;
  updatePreset: (preset: LiquidGlassPreset) => void;
};
```

The renderer must compile a vertex shader and an adapted fragment shader, upload the shared texture, track element bounds, and render into a pointer-transparent canvas.

- [ ] **Step 2: Implement the adapted shader**

Include:

- Rounded-rectangle and pill signed-distance masks.
- Shape-aware normal calculation.
- Edge, rim, corner, and ripple refraction.
- A five-sample blur optimized for multiple navbar canvases.
- Blue-aware vertical tint.
- Alpha masking at the glass boundary.

- [ ] **Step 3: Run build to verify TypeScript and shader integration**

Run: `npm.cmd run build`

Expected: PASS.

### Task 4: React Surface Wrapper

**Files:**
- Create: `src/components/ui/LiquidGlassSurface.tsx`

- [ ] **Step 1: Implement the lifecycle wrapper**

The wrapper must:

- Render a decorative `<canvas aria-hidden="true">`.
- Render semantic child content above the canvas.
- Subscribe to the shared backdrop manager.
- Create one renderer after mount.
- Resize through `ResizeObserver`.
- Update uniforms when role or active state changes.
- Dispose renderer, observer, and subscription on unmount.
- Add `is-glass-ready` only when a texture was rendered successfully.

- [ ] **Step 2: Run lint and build**

Run: `npm.cmd run lint`

Expected: PASS.

Run: `npm.cmd run build`

Expected: PASS.

### Task 5: Navbar Integration And Styling

**Files:**
- Modify: `src/components/NavBar.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Wrap the existing navigation DOM**

Keep the `<nav>`, home `NavLink`, route array, and route `NavLink` elements. Add:

- One rounded `LiquidGlassSurface` inside the fixed navbar shell.
- One rounded badge surface around the `AB` text.
- One pill surface inside each route link.
- Active-state propagation from `NavLink` to the button surface.

- [ ] **Step 2: Add visual and fallback styles**

Add:

- Shared `.liquid-glass-surface`, `.liquid-glass-canvas`, and `.liquid-glass-content` layers.
- A framed `.site-nav-glass` shell with the current dark-blue fallback and blur.
- A `.nav-brand-badge` lens matching the existing mark dimensions.
- `.nav-link-glass` pills with restrained idle styling and stronger active, hover, and focus states.
- Existing mobile stacking and horizontal scrolling behavior under `860px`.
- Near-instant glass canvas transitions under reduced motion.

- [ ] **Step 3: Run focused and project verification**

Run: `npm.cmd test`

Expected: PASS.

Run: `npm.cmd run lint`

Expected: PASS.

Run: `npm.cmd run build`

Expected: PASS.

### Task 6: Browser QA

**Files:**
- Inspect only.

- [ ] **Step 1: Start or reuse the Vite development server**

Run: `npm.cmd run dev -- --host 127.0.0.1`

- [ ] **Step 2: Inspect desktop navigation**

Confirm:

- The shell, badge, and five route controls display liquid-glass texture.
- The `BiddleSec` wordmark remains readable.
- Route navigation and active styling work.
- Keyboard focus rings remain visible.

- [ ] **Step 3: Inspect narrow navigation**

Confirm below `860px`:

- Brand and route rows stack.
- Route controls remain horizontally scrollable.
- Glass surfaces do not clip labels or block pointer input.

- [ ] **Step 4: Inspect reduced-motion fallback**

Confirm:

- The UI remains complete with reduced motion.
- Glass does not schedule continuous texture composition in reduced-motion mode.
- CSS fallback stays readable when enhancement is unavailable.

- [ ] **Step 5: Run final diff checks**

Run: `git diff --check`

Expected: no output.

Run: `git status --short`

Expected: only intended liquid-glass implementation files and generated build output ignored by git.
