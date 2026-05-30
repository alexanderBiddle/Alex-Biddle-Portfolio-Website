import { useEffect, useRef } from 'react';

type AetherFlowCanvasProps = {
  className?: string;
  density?: number;
  maxParticles?: number;
};

type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
};

type PointerPosition = {
  x: number | null;
  y: number | null;
};

const CONNECTION_DISTANCE = 138;
const POINTER_RADIUS = 190;

export default function AetherFlowCanvas({
  className = '',
  density = 13000,
  maxParticles = 170,
}: AetherFlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer: PointerPosition = { x: null, y: null };
    let animationFrameId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      velocityX: Math.random() * 0.34 - 0.17,
      velocityY: Math.random() * 0.34 - 0.17,
      radius: Math.random() * 1.6 + 0.7,
    });

    const initialize = () => {
      const particleCount = Math.min(maxParticles, Math.max(42, Math.round((width * height) / density)));
      particles = Array.from({ length: particleCount }, createParticle);
    };

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      initialize();
    };

    const moveParticles = () => {
      for (const particle of particles) {
        if (particle.x > width || particle.x < 0) {
          particle.velocityX *= -1;
        }
        if (particle.y > height || particle.y < 0) {
          particle.velocityY *= -1;
        }

        if (pointer.x !== null && pointer.y !== null) {
          const offsetX = pointer.x - particle.x;
          const offsetY = pointer.y - particle.y;
          const distance = Math.hypot(offsetX, offsetY);

          if (distance > 0 && distance < POINTER_RADIUS + particle.radius) {
            const force = (POINTER_RADIUS - distance) / POINTER_RADIUS;
            particle.x -= (offsetX / distance) * force * 3.2;
            particle.y -= (offsetY / distance) * force * 3.2;
          }
        }

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
      }
    };

    const drawConnections = () => {
      const connectionDistanceSquared = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
          const first = particles[firstIndex];
          const second = particles[secondIndex];
          const offsetX = first.x - second.x;
          const offsetY = first.y - second.y;
          const distanceSquared = offsetX * offsetX + offsetY * offsetY;

          if (distanceSquared >= connectionDistanceSquared) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared);
          const opacity = Math.max(0, (1 - distance / CONNECTION_DISTANCE) * 0.42);
          const pointerDistance = pointer.x === null || pointer.y === null
            ? Number.POSITIVE_INFINITY
            : Math.hypot(first.x - pointer.x, first.y - pointer.y);

          context.strokeStyle = pointerDistance < POINTER_RADIUS
            ? `oklch(0.92 0.04 210 / ${Math.min(0.78, opacity + 0.2)})`
            : `oklch(0.72 0.17 287 / ${opacity})`;
          context.lineWidth = pointerDistance < POINTER_RADIUS ? 1.15 : 0.8;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
    };

    const drawParticles = () => {
      for (const particle of particles) {
        context.fillStyle = 'oklch(0.82 0.16 288 / 0.84)';
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const renderFrame = (shouldMove = true) => {
      context.clearRect(0, 0, width, height);

      if (shouldMove) {
        moveParticles();
      }

      drawConnections();
      drawParticles();
    };

    const animate = () => {
      renderFrame();
      animationFrameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const handlePointerLeave = () => {
      pointer.x = null;
      pointer.y = null;
    };

    const startAnimation = () => {
      window.cancelAnimationFrame(animationFrameId);

      if (reducedMotionQuery.matches) {
        renderFrame(false);
        return;
      }

      animate();
    };

    const handleReducedMotionChange = () => startAnimation();

    resizeCanvas();
    startAnimation();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerLeave);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerLeave);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [density, maxParticles]);

  return <canvas ref={canvasRef} className={`aether-flow-canvas ${className}`.trim()} aria-hidden="true" />;
}
