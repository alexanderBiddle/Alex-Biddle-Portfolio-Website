/* React lifecycle hooks keep the canvas DOM reference and own the animation setup lifecycle. */
import { useEffect, useRef } from 'react';

/* Optional tuning props let the shared particle field scale without duplicating renderer code. */
type AetherFlowCanvasProps = {
  className?: string;
  density?: number;
  maxParticles?: number;
};

/* Every particle tracks its screen position, drift velocity, and rendered point size. */
type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
};

/* Null coordinates represent an inactive pointer outside the browser window. */
type PointerPosition = {
  x: number | null;
  y: number | null;
};

/* Shared distance limits control line linking and pointer repulsion independently. */
const CONNECTION_DISTANCE = 138;
const POINTER_RADIUS = 190;

export default function AetherFlowCanvas({
  className = '',
  density = 11000 / 1.3,
  maxParticles = 650,
}: AetherFlowCanvasProps) {
  /* The ref exposes the mounted canvas to the imperative 2D drawing loop. */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /* Stop early if the DOM node or 2D rendering context is unavailable. */
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    /* Mutable render state stays inside the effect so unmount cleanup can release the full loop. */
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer: PointerPosition = { x: null, y: null };
    let animationFrameId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    /* New particles start at random positions with a deliberately subtle ambient drift. */
    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      velocityX: Math.random() * 0.34 - 0.17,
      velocityY: Math.random() * 0.34 - 0.17,
      radius: Math.random() * 1.6 + 0.7,
    });

    /* Canvas area determines the particle count while lower and upper bounds limit extremes. */
    const initialize = () => {
      const particleCount = Math.min(maxParticles, Math.max(55, Math.round((width * height) / density)));
      particles = Array.from({ length: particleCount }, createParticle);
    };

    /* Resize the backing store for crisp rendering and rebuild particles for the new viewport. */
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

    /* Particles bounce at canvas edges and move away from nearby pointer coordinates. */
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

    /* Nearby particles receive connecting lines whose opacity fades with distance. */
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
            ? `rgba(174, 223, 255, ${Math.min(0.78, opacity + 0.2)})`
            : `rgba(13, 158, 255, ${opacity})`;
          context.lineWidth = pointerDistance < POINTER_RADIUS ? 1.15 : 0.8;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
    };

    /* Points are drawn after links so each node stays legible above the connection network. */
    const drawParticles = () => {
      for (const particle of particles) {
        context.fillStyle = 'rgba(174, 223, 255, 0.84)';
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    /* One frame clears stale pixels, optionally updates motion, and redraws the full network. */
    const renderFrame = (shouldMove = true) => {
      context.clearRect(0, 0, width, height);

      if (shouldMove) {
        moveParticles();
      }

      drawConnections();
      drawParticles();
    };

    /* Standard-motion visitors receive a continuous requestAnimationFrame loop. */
    const animate = () => {
      renderFrame();
      animationFrameId = window.requestAnimationFrame(animate);
    };

    /* Window pointer coordinates are translated into canvas-local coordinates for repulsion. */
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    /* Leaving the document disables pointer influence until movement resumes inside the page. */
    const handlePointerLeave = () => {
      pointer.x = null;
      pointer.y = null;
    };

    /* Reduced-motion mode renders one static frame instead of scheduling continuous movement. */
    const startAnimation = () => {
      window.cancelAnimationFrame(animationFrameId);

      if (reducedMotionQuery.matches) {
        renderFrame(false);
        return;
      }

      animate();
    };

    const handleReducedMotionChange = () => startAnimation();

    /* Initial setup and listeners keep the decorative canvas synchronized with browser state. */
    resizeCanvas();
    startAnimation();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerLeave);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    /* Cleanup prevents stale animation frames and browser listeners after unmount. */
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerLeave);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [density, maxParticles]);

  /* The decorative canvas stays hidden from assistive technology and page interaction. */
  return <canvas ref={canvasRef} className={`aether-flow-canvas ${className}`.trim()} aria-hidden="true" />;
}
