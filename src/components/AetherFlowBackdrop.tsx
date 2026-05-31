/* Router state selects a route-specific backdrop mode while both visual layers stay mounted. */
import { useLocation } from 'react-router';
import AetherFlowCanvas from './ui/AetherFlowCanvas';
import LocalGalaxyCanvas from './ui/LocalGalaxyCanvas';

export default function AetherFlowBackdrop() {
  /* Home and routed pages expose separate CSS hooks for any page-level backdrop adjustments. */
  const { pathname } = useLocation();
  const routeClassName = pathname === '/' ? 'is-home' : 'is-routed';

  return (
    <div className={`aether-flow-backdrop ${routeClassName}`} aria-hidden="true">
      {/* WebGL and 2D canvases render the deep galaxy behind the lighter connection network. */}
      <LocalGalaxyCanvas />

      {/* The foreground canvas adds pointer-reactive particles without intercepting page controls. */}
      <AetherFlowCanvas />
    </div>
  );
}
