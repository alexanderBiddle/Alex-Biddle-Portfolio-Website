import { useLocation } from 'react-router';
import AetherFlowCanvas from './ui/AetherFlowCanvas';
import GalaxySceneStage from './ui/GalaxySceneStage';

export default function AetherFlowBackdrop() {
  const { pathname } = useLocation();
  const routeClassName = pathname === '/' ? 'is-home' : 'is-routed';

  return (
    <div className={`aether-flow-backdrop ${routeClassName}`} aria-hidden="true">
      <GalaxySceneStage
        fallbackClassName="aether-shared-fallback"
        splineClassName="aether-shared-spline"
      />
      <AetherFlowCanvas />
    </div>
  );
}
