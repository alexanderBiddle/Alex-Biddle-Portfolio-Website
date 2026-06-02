/* One composited canvas feeds every liquid-glass renderer so the navbar does not duplicate capture work. */
import { BACKDROP_TEXTURE_FPS } from './liquidGlassConfig';

type BackdropSubscriber = (source: HTMLCanvasElement | null) => void;

const BACKDROP_LAYER_SELECTORS = [
  '.local-nebula-canvas',
  '.local-galaxy-canvas',
  '.aether-flow-canvas',
] as const;

const RESIZE_DELAY = 120;

class LiquidGlassBackdrop {
  private animationFrameId = 0;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private currentSource: HTMLCanvasElement | null = null;
  private isStarted = false;
  private lastFrameTime = 0;
  private reducedMotionQuery: MediaQueryList | null = null;
  private resizeTimer = 0;
  private readonly subscribers = new Set<BackdropSubscriber>();

  /* Subscribers receive the most recent texture immediately, then every successful composition. */
  subscribe = (subscriber: BackdropSubscriber) => {
    this.subscribers.add(subscriber);

    if (!this.isStarted) {
      this.start();
    } else {
      subscriber(this.currentSource);
    }

    return () => {
      this.subscribers.delete(subscriber);

      if (!this.subscribers.size) {
        this.stop();
      }
    };
  };

  /* Lazily create browser resources because this module is imported during the React render path. */
  private ensureCanvas() {
    if (this.canvas && this.context) {
      return true;
    }

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d', { alpha: true });

    return Boolean(this.context);
  }

  /* Texture dimensions use CSS viewport pixels: enough detail for blurred navbar lenses at restrained cost. */
  private resizeCanvas() {
    if (!this.canvas || !this.context) {
      return;
    }

    const width = Math.max(1, Math.round(window.innerWidth));
    const height = Math.max(1, Math.round(window.innerHeight));

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  /* Each available decorative layer is copied independently so one unavailable canvas cannot disable glass. */
  private compose = () => {
    if (!this.ensureCanvas() || !this.canvas || !this.context) {
      this.publish(null);
      return;
    }

    this.resizeCanvas();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let copiedLayer = false;

    for (const selector of BACKDROP_LAYER_SELECTORS) {
      const layer = document.querySelector<HTMLCanvasElement>(selector);

      if (!layer?.width || !layer.height) {
        continue;
      }

      try {
        this.context.drawImage(layer, 0, 0, this.canvas.width, this.canvas.height);
        copiedLayer = true;
      } catch {
        /* A layer may be temporarily unavailable while its renderer initializes; use the remaining layers. */
      }
    }

    this.publish(copiedLayer ? this.canvas : null);
  };

  /* Rendering stays below the backdrop animation rate while preserving a visibly live refracted texture. */
  private animate = (time: number) => {
    this.animationFrameId = window.requestAnimationFrame(this.animate);

    if (time - this.lastFrameTime < 1000 / BACKDROP_TEXTURE_FPS) {
      return;
    }

    this.lastFrameTime = time;
    this.compose();
  };

  private publish(source: HTMLCanvasElement | null) {
    this.currentSource = source;

    for (const subscriber of this.subscribers) {
      subscriber(source);
    }
  }

  /* Resize composition waits for layout and the underlying canvases to settle before publishing a texture. */
  private handleResize = () => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.compose(), RESIZE_DELAY);
  };

  /* Reduced-motion mode holds one static composed frame instead of scheduling continuous texture refreshes. */
  private handleReducedMotionChange = () => {
    window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
    this.lastFrameTime = 0;
    this.compose();

    if (!this.reducedMotionQuery?.matches) {
      this.animationFrameId = window.requestAnimationFrame(this.animate);
    }
  };

  private start() {
    this.isStarted = true;
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotionQuery.addEventListener('change', this.handleReducedMotionChange);
    window.addEventListener('resize', this.handleResize);
    this.compose();

    if (!this.reducedMotionQuery.matches) {
      this.animationFrameId = window.requestAnimationFrame(this.animate);
    }
  }

  private stop() {
    window.cancelAnimationFrame(this.animationFrameId);
    window.clearTimeout(this.resizeTimer);
    window.removeEventListener('resize', this.handleResize);
    this.reducedMotionQuery?.removeEventListener('change', this.handleReducedMotionChange);
    this.animationFrameId = 0;
    this.currentSource = null;
    this.isStarted = false;
    this.lastFrameTime = 0;
    this.reducedMotionQuery = null;
    this.resizeTimer = 0;
  }
}

export const liquidGlassBackdrop = new LiquidGlassBackdrop();
