import { Component, lazy, Suspense, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

const GALAXY_SCENE = 'https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode';

type GalaxyFallbackProps = {
  className?: string;
  isHidden?: boolean;
};

type GalaxySceneStageProps = {
  fallbackClassName?: string;
  splineClassName?: string;
};

type SceneBoundaryProps = GalaxySceneStageProps & {
  children: ReactNode;
};

type SceneBoundaryState = {
  hasError: boolean;
};

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError
      ? <GalaxyFallback className={this.props.fallbackClassName} />
      : this.props.children;
  }
}

function GalaxyFallback({ className = '', isHidden = false }: GalaxyFallbackProps) {
  return (
    <div className={`aether-fallback${isHidden ? ' is-hidden' : ''} ${className}`.trim()} />
  );
}

function GalaxyScene({ fallbackClassName = '', splineClassName = '' }: GalaxySceneStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  if (shouldReduceMotion) {
    return <GalaxyFallback className={fallbackClassName} />;
  }

  return (
    <>
      <GalaxyFallback className={fallbackClassName} isHidden={isLoaded} />
      <Spline
        className={`aether-spline${isLoaded ? ' is-loaded' : ''} ${splineClassName}`.trim()}
        scene={GALAXY_SCENE}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}

export default function GalaxySceneStage({
  fallbackClassName = '',
  splineClassName = '',
}: GalaxySceneStageProps) {
  return (
    <SceneBoundary fallbackClassName={fallbackClassName} splineClassName={splineClassName}>
      <Suspense fallback={<GalaxyFallback className={fallbackClassName} />}>
        <GalaxyScene fallbackClassName={fallbackClassName} splineClassName={splineClassName} />
      </Suspense>
    </SceneBoundary>
  );
}
