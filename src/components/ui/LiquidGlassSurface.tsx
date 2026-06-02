/* React keeps semantic navbar content intact while this wrapper owns decorative WebGL enhancement lifecycle. */
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { liquidGlassBackdrop } from './liquidGlassBackdrop';
import {
  getLiquidGlassPreset,
  type LiquidGlassRole,
  type LiquidGlassShape,
} from './liquidGlassConfig';
import {
  createLiquidGlassRenderer,
  type LiquidGlassRenderer,
} from './liquidGlassRenderer';

type LiquidGlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  isActive?: boolean;
  radius?: number;
  role: LiquidGlassRole;
  shape?: LiquidGlassShape;
};

export default function LiquidGlassSurface({
  children,
  className = '',
  contentClassName = '',
  isActive = false,
  radius = 18,
  role,
  shape = 'rounded',
}: LiquidGlassSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<LiquidGlassRenderer>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const preset = useMemo(() => getLiquidGlassPreset(role, isActive), [isActive, role]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = surfaceRef.current;

    if (!canvas || !surface) {
      return;
    }

    const renderer = createLiquidGlassRenderer({
      canvas,
      element: surface,
      preset: getLiquidGlassPreset(role),
      radius,
      shape,
    });

    if (!renderer) {
      return;
    }

    rendererRef.current = renderer;

    /* Imperative readiness avoids React rerenders for a high-frequency decorative texture stream. */
    const renderSource = (source: HTMLCanvasElement | null) => {
      sourceRef.current = source;
      surface.classList.toggle('is-glass-ready', renderer.render(source));
    };

    const resizeObserver = new ResizeObserver(() => renderSource(sourceRef.current));
    const unsubscribe = liquidGlassBackdrop.subscribe(renderSource);

    resizeObserver.observe(surface);

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
      renderer.dispose();
      rendererRef.current = null;
      sourceRef.current = null;
      surface.classList.remove('is-glass-ready');
    };
  }, [radius, role, shape]);

  /* Active-route changes update uniforms immediately, including when reduced motion holds a static texture. */
  useEffect(() => {
    const renderer = rendererRef.current;
    const surface = surfaceRef.current;

    if (!renderer || !surface) {
      return;
    }

    renderer.updatePreset(preset);
    surface.classList.toggle('is-glass-ready', renderer.render(sourceRef.current));
  }, [preset]);

  return (
    <div
      ref={surfaceRef}
      className={`liquid-glass-surface liquid-glass-${role} ${className}`.trim()}
    >
      <canvas ref={canvasRef} className="liquid-glass-canvas" aria-hidden="true" />
      <div className={`liquid-glass-content ${contentClassName}`.trim()}>{children}</div>
    </div>
  );
}
