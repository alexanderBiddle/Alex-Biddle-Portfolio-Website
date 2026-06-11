/* React lifecycle hooks connect the layered canvas renderer to the mounted page. */
import { useEffect, useRef } from 'react';
import { isGalaxyQuietTarget } from './galaxyInteraction';

/* Galaxy bands define the density, shape, color palette, and orientation of each spiral layer. */
type GalaxyBand = {
  arms: number;
  colors: number[];
  count: number;
  opacity: [number, number];
  radialScale: number;
  radiusPower: number;
  rotationSpeed: number;
  size: [number, number];
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  twist: number;
  verticalSpread: number;
};

/* Layer transforms cache trigonometric values so every particle can reuse them within a frame. */
type GalaxyLayer = {
  tiltX: number;
  tiltY: number;
  tiltZ: number;
};

type GalaxyLayerTransform = {
  cosX: number;
  cosY: number;
  cosZ: number;
  sinX: number;
  sinY: number;
  sinZ: number;
};

/* Typed arrays store particle properties compactly for the CPU-rendered galaxy foreground. */
type GalaxyParticles = {
  angles: Float32Array;
  colorIndices: Uint8Array;
  depths: Float32Array;
  layerIndices: Uint8Array;
  opacities: Float32Array;
  planeOffsets: Float32Array;
  radialScales: Float32Array;
  radii: Float32Array;
  rotationSpeeds: Float32Array;
  sizes: Float32Array;
  verticalOffsets: Float32Array;
};

/* Sparse field stars sit outside the galaxy and add a separate twinkling depth layer. */
type FieldStar = {
  color: string;
  depth: number;
  opacity: number;
  phase: number;
  size: number;
  x: number;
  y: number;
};

/* The worker returns transferable buffers for the denser WebGL nebula volume. */
type NebulaVolumeResponse = {
  colorsBuffer: ArrayBuffer;
  pointCount: number;
  positionsBuffer: ArrayBuffer;
};

/* Worker output is validated before GPU upload: both buffers must exist and their byte lengths
   must match the declared point count exactly (3 × Int16 positions, 4 × Uint8 colors per point). */
const isNebulaVolumeResponse = (data: unknown): data is NebulaVolumeResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const { colorsBuffer, pointCount, positionsBuffer } = data as Partial<NebulaVolumeResponse>;

  return (
    typeof pointCount === 'number' &&
    Number.isSafeInteger(pointCount) &&
    pointCount > 0 &&
    positionsBuffer instanceof ArrayBuffer &&
    colorsBuffer instanceof ArrayBuffer &&
    positionsBuffer.byteLength === pointCount * 3 * Int16Array.BYTES_PER_ELEMENT &&
    colorsBuffer.byteLength === pointCount * 4 * Uint8Array.BYTES_PER_ELEMENT
  );
};

/* The WebGL renderer exposes only the operations needed by the React-owned lifecycle. */
type NebulaRenderer = {
  dispose: () => void;
  draw: (
    motionTime: number,
    rotation: Rotation,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    galaxyRadius: number,
  ) => void;
  resize: (width: number, height: number) => void;
  upload: (volume: NebulaVolumeResponse) => void;
};

/* Drag rotation is tracked separately on each axis for direct pointer manipulation. */
type Rotation = {
  x: number;
  y: number;
};

/* Shared color palettes keep the generated galaxy balanced between cool and warm regions. */
const PARTICLE_COLORS = [
  [194, 224, 255],
  [126, 192, 255],
  [103, 220, 255],
  [149, 142, 255],
  [205, 141, 255],
  [255, 104, 214],
  [245, 135, 255],
  [230, 126, 255],
  [154, 169, 255],
  [255, 236, 176],
  [255, 248, 224],
  [255, 220, 128],
  [255, 168, 62],
] as const;

const COOL_COLOR_INDICES = [0, 1, 2, 3, 4, 8];
const WARM_ARM_COLOR_INDICES = [9, 9, 11, 11, 11, 12, 12, 10, 0, 1, 4, 6];
const CORE_COLOR_INDICES = [9, 9, 10, 10, 11, 11, 12, 0, 4, 6];
const ACCRETION_COLOR_INDICES = [10, 10, 10, 9, 9, 11, 11, 12, 0];
const NUCLEUS_COLOR_INDICES = [10, 10, 10, 10, 9, 9, 11, 0];
const HALO_COLOR_INDICES = [9, 9, 11, 11, 12, 12, 0, 1, 4];
const ALL_COLOR_INDICES = PARTICLE_COLORS.map((_, index) => index);

/* Layer definitions build overlapping spiral structures with distinct depth and motion profiles. */
const GALAXY_BANDS: GalaxyBand[] = [
  {
    arms: 5,
    colors: [...WARM_ARM_COLOR_INDICES, ...COOL_COLOR_INDICES],
    count: 100000,
    opacity: [0.2, 0.78],
    radialScale: 1.08,
    radiusPower: 0.74,
    rotationSpeed: 0.000017,
    size: [0.18, 0.6],
    tiltX: 0.58,
    tiltY: -0.08,
    tiltZ: -0.16,
    twist: 7.4,
    verticalSpread: 0.042,
  },
  {
    arms: 3,
    colors: [...WARM_ARM_COLOR_INDICES, ...COOL_COLOR_INDICES],
    count: 125000,
    opacity: [0.14, 0.58],
    radialScale: 1.04,
    radiusPower: 0.86,
    rotationSpeed: -0.000012,
    size: [0.16, 0.5],
    tiltX: 0.92,
    tiltY: 0.58,
    tiltZ: 0.44,
    twist: 5.8,
    verticalSpread: 0.05,
  },
  {
    arms: 2,
    colors: [...WARM_ARM_COLOR_INDICES, ...CORE_COLOR_INDICES],
    count: 125000,
    opacity: [0.12, 0.52],
    radialScale: 0.94,
    radiusPower: 0.92,
    rotationSpeed: 0.00001,
    size: [0.14, 0.44],
    tiltX: 0.28,
    tiltY: -0.82,
    tiltZ: -0.58,
    twist: 4.9,
    verticalSpread: 0.062,
  },
];

/* Point budgets and renderer limits balance visual density against browser frame cost. */
const CORE_POINT_COUNT = 50000;
const NUCLEUS_POINT_COUNT = 3000;
const ACCRETION_POINT_COUNT = CORE_POINT_COUNT - NUCLEUS_POINT_COUNT;
const HALO_POINT_COUNT = 4400;
const FIELD_STAR_COUNT = 650;
const GALAXY_POINT_COUNT =
  GALAXY_BANDS.reduce((total, band) => total + band.count, 0) +
  CORE_POINT_COUNT +
  HALO_POINT_COUNT;
const CORE_LAYER_INDEX = GALAXY_BANDS.length;
const HALO_LAYER_INDEX = CORE_LAYER_INDEX + 1;
const GALAXY_LAYERS: GalaxyLayer[] = [
  ...GALAXY_BANDS,
  { tiltX: 0.58, tiltY: -0.08, tiltZ: -0.16 },
  { tiltX: 0.58, tiltY: -0.08, tiltZ: -0.16 },
];
const MAX_RENDER_WIDTH = 1920;
const MAX_RENDER_HEIGHT = 1080;
const MAX_FRAME_RATE = 48;
const AUTO_Y_ROTATION_SPEED = 0.000037;
const INITIAL_ORBIT_ROTATION: Rotation = { x: 27, y: 200 };
const NEBULA_POINT_COUNT = 1_500_000;

/* A deterministic random stream keeps the galaxy layout stable across route changes and reloads. */
const createSeededRandom = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

/* Clamp and palette helpers keep generated values inside renderer-safe ranges. */
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

/* The random index is always in range, but the fallback keeps the helper total under
   noUncheckedIndexedAccess and guarantees a valid palette index for downstream lookups. */
const pickColorIndex = (random: () => number, colors: number[]) =>
  colors[Math.floor(random() * colors.length)] ?? 0;

/* Allocate property-specific typed arrays once before writing the CPU particle population. */
const createGalaxyParticles = (): GalaxyParticles => ({
  angles: new Float32Array(GALAXY_POINT_COUNT),
  colorIndices: new Uint8Array(GALAXY_POINT_COUNT),
  depths: new Float32Array(GALAXY_POINT_COUNT),
  layerIndices: new Uint8Array(GALAXY_POINT_COUNT),
  opacities: new Float32Array(GALAXY_POINT_COUNT),
  planeOffsets: new Float32Array(GALAXY_POINT_COUNT),
  radialScales: new Float32Array(GALAXY_POINT_COUNT),
  radii: new Float32Array(GALAXY_POINT_COUNT),
  rotationSpeeds: new Float32Array(GALAXY_POINT_COUNT),
  sizes: new Float32Array(GALAXY_POINT_COUNT),
  verticalOffsets: new Float32Array(GALAXY_POINT_COUNT),
});

/* WebGL handles the dense nebula volume while the foreground galaxy stays in the 2D renderer. */
const createNebulaRenderer = (canvas: HTMLCanvasElement): NebulaRenderer | null => {
  /* Prefer a transparent high-performance context because this canvas sits behind page content. */
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  });

  if (!gl) {
    return null;
  }

  /* Shader compilation is isolated so setup failures can gracefully disable only the nebula layer. */
  const compileShader = (type: number, source: string) => {
    const shader = gl.createShader(type);

    if (!shader) {
      throw new Error('Unable to allocate nebula shader.');
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) ?? 'Unknown nebula shader compilation error.';

      gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  };

  try {
    /* The vertex shader rotates, projects, and sizes worker-generated nebula points on the GPU. */
    const vertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
        attribute vec3 aPosition;
        attribute vec4 aColor;
        uniform float uAutoY;
        uniform vec2 uCenter;
        uniform vec2 uOrbit;
        uniform float uRadius;
        uniform vec2 uViewport;
        varying vec4 vColor;

        vec3 rotateX(vec3 point, float angle) {
          float sine = sin(angle);
          float cosine = cos(angle);
          return vec3(point.x, point.y * cosine - point.z * sine, point.y * sine + point.z * cosine);
        }

        vec3 rotateY(vec3 point, float angle) {
          float sine = sin(angle);
          float cosine = cos(angle);
          return vec3(point.x * cosine + point.z * sine, point.y, -point.x * sine + point.z * cosine);
        }

        vec3 rotateZ(vec3 point, float angle) {
          float sine = sin(angle);
          float cosine = cos(angle);
          return vec3(point.x * cosine - point.y * sine, point.x * sine + point.y * cosine, point.z);
        }

        void main() {
          vec3 point = rotateX(aPosition, 0.58 + uOrbit.x);
          point = rotateY(point, -0.08 + uAutoY + uOrbit.y);
          point = rotateZ(point, -0.16);

          float perspective = 1.0 + point.z / 4.2;
          vec2 screen = uCenter + point.xy * uRadius * perspective;
          vec2 clip = vec2(screen.x / uViewport.x * 2.0 - 1.0, 1.0 - screen.y / uViewport.y * 2.0);

          gl_Position = vec4(clip, point.z * 0.08, 1.0);
          gl_PointSize = 0.92 + aColor.a * 1.18;
          vColor = aColor;
        }
      `,
    );

    /* The fragment shader softens each square WebGL point into a circular translucent particle. */
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        varying vec4 vColor;

        void main() {
          vec2 offset = gl_PointCoord - vec2(0.5);
          float alpha = 1.0 - smoothstep(0.12, 0.25, dot(offset, offset));

          if (alpha <= 0.0) {
            discard;
          }

          gl_FragColor = vec4(vColor.rgb, vColor.a * alpha);
        }
      `,
    );

    /* Link shaders into one program before locating the attributes and uniforms used per frame. */
    const program = gl.createProgram();

    if (!program) {
      throw new Error('Unable to allocate nebula shader program.');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) ?? 'Unknown nebula program link error.';

      gl.deleteProgram(program);
      throw new Error(message);
    }

    /* Buffers store static worker output; uniforms carry viewport and motion state into each draw. */
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const colorLocation = gl.getAttribLocation(program, 'aColor');
    const autoYLocation = gl.getUniformLocation(program, 'uAutoY');
    const centerLocation = gl.getUniformLocation(program, 'uCenter');
    const orbitLocation = gl.getUniformLocation(program, 'uOrbit');
    const radiusLocation = gl.getUniformLocation(program, 'uRadius');
    const viewportLocation = gl.getUniformLocation(program, 'uViewport');
    let pointCount = 0;

    if (!positionBuffer || !colorBuffer || positionLocation < 0 || colorLocation < 0) {
      gl.deleteProgram(program);
      throw new Error('Unable to allocate nebula point buffers.');
    }

    /* Alpha blending lets the nebula remain translucent over the dark page background. */
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return {
      /* Release GPU allocations when React removes the backdrop from the page. */
      dispose: () => {
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(colorBuffer);
        gl.deleteProgram(program);
      },

      /* Draw uses the current orbit state while keeping uploaded particle buffers unchanged. */
      draw: (motionTime, rotation, width, height, centerX, centerY, galaxyRadius) => {
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (!pointCount) {
          return;
        }

        gl.useProgram(program);
        gl.uniform1f(autoYLocation, motionTime * AUTO_Y_ROTATION_SPEED);
        gl.uniform2f(centerLocation, centerX, centerY);
        gl.uniform2f(orbitLocation, rotation.x, rotation.y);
        gl.uniform1f(radiusLocation, galaxyRadius);
        gl.uniform2f(viewportLocation, width, height);
        gl.drawArrays(gl.POINTS, 0, pointCount);
      },

      /* Keep the GPU viewport synchronized with the capped canvas backing-store dimensions. */
      resize: (width, height) => {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      },

      /* Worker buffers are uploaded once and normalized directly by WebGL attribute settings. */
      upload: ({ colorsBuffer, pointCount: nextPointCount, positionsBuffer }) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionsBuffer, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.SHORT, true, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorsBuffer, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(colorLocation);
        gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

        pointCount = nextPointCount;
      },
    };
  } catch {
    /* Canvas fallback remains functional when WebGL setup or shader compilation is unavailable. */
    return null;
  }
};

export default function LocalGalaxyCanvas() {
  /* Separate refs allow WebGL nebula points and CPU-rendered stars to stack as independent layers. */
  const nebulaCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /* Abort cleanly if either canvas or the primary 2D drawing context cannot be created. */
    const nebulaCanvas = nebulaCanvasRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!nebulaCanvas || !canvas || !context) {
      return;
    }

    /* An offscreen canvas collects CPU particles before screen blending the composed image. */
    const particleCanvas = document.createElement('canvas');
    const particleContext = particleCanvas.getContext('2d');

    if (!particleContext) {
      return;
    }

    /* Renderer state remains effect-local so every listener, worker, and GPU resource has one owner. */
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 620px)');
    const random = createSeededRandom(7311994);
    const dragRotationTarget: Rotation = { ...INITIAL_ORBIT_ROTATION };
    const dragRotationCurrent: Rotation = { ...INITIAL_ORBIT_ROTATION };
    const galaxyParticles = createGalaxyParticles();
    const fieldStars: FieldStar[] = [];
    const nebulaRenderer = createNebulaRenderer(nebulaCanvas);
    const nebulaWorker = nebulaRenderer
      ? new Worker(new URL('../../workers/nebulaVolume.worker.ts', import.meta.url), {
          type: 'module',
        })
      : null;
    let activePointerId: number | null = null;
    let animationFrameId = 0;
    let animationStartTime: number | null = null;
    let galaxyFrame = particleContext.createImageData(1, 1);
    let height = 0;
    let lastFrameTime = 0;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let width = 0;
    let writeIndex = 0;

    /* Each generated foreground point writes its properties into parallel typed arrays. */
    const addGalaxyPoint = (
      angle: number,
      colorIndex: number,
      depth: number,
      layerIndex: number,
      opacity: number,
      planeOffset: number,
      radialScale: number,
      radius: number,
      rotationSpeed: number,
      size: number,
      verticalOffset: number,
    ) => {
      galaxyParticles.angles[writeIndex] = angle;
      galaxyParticles.colorIndices[writeIndex] = colorIndex;
      galaxyParticles.depths[writeIndex] = depth;
      galaxyParticles.layerIndices[writeIndex] = layerIndex;
      galaxyParticles.opacities[writeIndex] = opacity;
      galaxyParticles.planeOffsets[writeIndex] = planeOffset;
      galaxyParticles.radialScales[writeIndex] = radialScale;
      galaxyParticles.radii[writeIndex] = radius;
      galaxyParticles.rotationSpeeds[writeIndex] = rotationSpeed;
      galaxyParticles.sizes[writeIndex] = size;
      galaxyParticles.verticalOffsets[writeIndex] = verticalOffset;
      writeIndex += 1;
    };

    /* Spiral bands establish the broad arms using their configured tilt, twist, and palette. */
    GALAXY_BANDS.forEach((band, layerIndex) => {
      for (let index = 0; index < band.count; index += 1) {
        const radius = Math.pow(random(), band.radiusPower);
        const arm = index % band.arms;
        const colors = radius < 0.24 ? CORE_COLOR_INDICES : band.colors;

        addGalaxyPoint(
          arm * ((Math.PI * 2) / band.arms) +
            radius * band.twist +
            (random() - 0.5) * (0.34 + radius * 0.46),
          pickColorIndex(random, colors),
          0.42 + random() * 0.88,
          layerIndex,
          band.opacity[0] + random() * (band.opacity[1] - band.opacity[0]),
          (random() - 0.5) * (0.04 + radius * 0.18),
          band.radialScale,
          radius,
          band.rotationSpeed * (0.82 + random() * 0.34),
          band.size[0] + random() * (band.size[1] - band.size[0]),
          (random() - 0.5) * band.verticalSpread,
        );
      }
    });

    /* Accretion points increase density near the center and reinforce the warm core structure. */
    for (let index = 0; index < ACCRETION_POINT_COUNT; index += 1) {
      const radius = Math.pow(random(), 2.6);
      const colors = radius < 0.24 ? ACCRETION_COLOR_INDICES : CORE_COLOR_INDICES;

      addGalaxyPoint(
        random() * Math.PI * 2 + radius * 8.4,
        pickColorIndex(random, colors),
        0.68 + random() * 0.78,
        CORE_LAYER_INDEX,
        0.4 + random() * 0.52,
        (random() - 0.5) * (0.018 + radius * 0.12),
        0.52,
        radius,
        0.00002 * (0.84 + random() * 0.32),
        0.24 + random() * 0.64,
        (random() - 0.5) * (0.018 + radius * 0.036),
      );
    }

    /* Nucleus points form a softly blended sphere inside the denser accretion cloud. */
    for (let index = 0; index < NUCLEUS_POINT_COUNT; index += 1) {
      const nucleusRadius = 0.13;
      const sphericalRadius = Math.pow(random(), 0.9) * nucleusRadius;
      const polarAngle = Math.acos(2 * random() - 1);
      const radialDistance = Math.sin(polarAngle) * sphericalRadius;
      const radialFade = 1 - sphericalRadius / nucleusRadius;

      addGalaxyPoint(
        random() * Math.PI * 2,
        pickColorIndex(random, NUCLEUS_COLOR_INDICES),
        0.92 + random() * 0.38,
        CORE_LAYER_INDEX,
        0.32 + radialFade * 0.38 + random() * 0.18,
        (random() - 0.5) * 0.018,
        0.52,
        radialDistance,
        0.000012 * (0.88 + random() * 0.24),
        0.32 + random() * 0.52,
        (Math.cos(polarAngle) * sphericalRadius + (random() - 0.5) * 0.008) * 0.52,
      );
    }

    /* Halo points add a looser spherical distribution around the flatter spiral layers. */
    for (let index = 0; index < HALO_POINT_COUNT; index += 1) {
      const sphericalRadius = 0.18 + Math.pow(random(), 1.4) * 0.9;
      const polarAngle = Math.acos(2 * random() - 1);

      addGalaxyPoint(
        random() * Math.PI * 2,
        pickColorIndex(random, HALO_COLOR_INDICES),
        0.2 + random() * 0.72,
        HALO_LAYER_INDEX,
        0.06 + random() * 0.24,
        Math.sin(polarAngle) * sphericalRadius,
        sphericalRadius,
        0.58 + random() * 0.54,
        (random() - 0.5) * 0.000008,
        0.12 + random() * 0.38,
        Math.cos(polarAngle) * sphericalRadius * 0.34,
      );
    }

    /* Field stars use viewport-relative coordinates so they remain distributed after resize. */
    for (let index = 0; index < FIELD_STAR_COUNT; index += 1) {
      const color = PARTICLE_COLORS[pickColorIndex(random, ALL_COLOR_INDICES)] ?? PARTICLE_COLORS[0];

      fieldStars.push({
        color: `${color[0]}, ${color[1]}, ${color[2]}`,
        depth: 0.2 + random() * 0.9,
        opacity: 0.14 + random() * 0.58,
        phase: random() * Math.PI * 2,
        size: 0.3 + random() * 1.08,
        x: random(),
        y: random(),
      });
    }

    /* Cap backing-store dimensions before recreating frame buffers to limit CPU rendering cost. */
    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const renderScale = Math.min(
        1,
        MAX_RENDER_WIDTH / Math.max(bounds.width, 1),
        MAX_RENDER_HEIGHT / Math.max(bounds.height, 1),
      );

      width = Math.max(1, Math.round(bounds.width * renderScale));
      height = Math.max(1, Math.round(bounds.height * renderScale));
      canvas.width = width;
      canvas.height = height;
      particleCanvas.width = width;
      particleCanvas.height = height;
      galaxyFrame = particleContext.createImageData(width, height);
      nebulaRenderer?.resize(width, height);
    };

    /* Compute one transform per layer per frame instead of recalculating trig values per point. */
    const createLayerTransforms = (motionTime: number): GalaxyLayerTransform[] => {
      const autoRotationY = motionTime * AUTO_Y_ROTATION_SPEED;

      return GALAXY_LAYERS.map((layer) => {
        const rotationX = layer.tiltX + dragRotationCurrent.x;
        const rotationY = layer.tiltY + autoRotationY + dragRotationCurrent.y;

        return {
          cosX: Math.cos(rotationX),
          cosY: Math.cos(rotationY),
          cosZ: Math.cos(layer.tiltZ),
          sinX: Math.sin(rotationX),
          sinY: Math.sin(rotationY),
          sinZ: Math.sin(layer.tiltZ),
        };
      });
    };

    /* Blend one CPU particle into the frame buffer using source-over alpha composition. */
    const blendPixel = (
      pixelData: Uint8ClampedArray,
      pixelOffset: number,
      colorIndex: number,
      alpha: number,
    ) => {
      const color = PARTICLE_COLORS[colorIndex];

      /* Skip silently if the palette index or pixel offset ever falls outside valid bounds. */
      if (!color || pixelOffset < 0 || pixelOffset + 3 >= pixelData.length) {
        return;
      }

      const inverseAlpha = 1 - alpha;

      pixelData[pixelOffset] = color[0] * alpha + (pixelData[pixelOffset] ?? 0) * inverseAlpha;
      pixelData[pixelOffset + 1] = color[1] * alpha + (pixelData[pixelOffset + 1] ?? 0) * inverseAlpha;
      pixelData[pixelOffset + 2] = color[2] * alpha + (pixelData[pixelOffset + 2] ?? 0) * inverseAlpha;
      pixelData[pixelOffset + 3] = Math.min(255, (pixelData[pixelOffset + 3] ?? 0) + alpha * 255);
    };

    /* Field stars render after the galaxy image so their subtle twinkle remains visible. */
    const drawFieldStars = (motionTime: number) => {
      for (const star of fieldStars) {
        const twinkle = 0.74 + Math.sin(motionTime * 0.0008 + star.phase) * 0.26;

        context.fillStyle = `rgba(${star.color}, ${star.opacity * twinkle})`;
        context.beginPath();
        context.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        context.fill();
      }
    };

    /* Compose WebGL nebula points, projected CPU particles, and field stars into one visual frame. */
    const renderFrame = (time = 0) => {
      const motionTime =
        reducedMotionQuery.matches || animationStartTime === null
          ? 0
          : Math.max(0, time - animationStartTime);
      const centerX = width * 0.53;
      const centerY = height * 0.52;
      const galaxyRadius = Math.max(width, height) * (mobileQuery.matches ? 0.315 : 0.45);
      const layerTransforms = createLayerTransforms(motionTime);
      const pixelData = galaxyFrame.data;

      context.clearRect(0, 0, width, height);
      nebulaRenderer?.draw(
        motionTime,
        dragRotationCurrent,
        width,
        height,
        centerX,
        centerY,
        galaxyRadius,
      );
      pixelData.fill(0);

      for (let index = 0; index < GALAXY_POINT_COUNT; index += 1) {
        /* Typed-array reads carry an undefined branch under noUncheckedIndexedAccess; the loop
           bound guarantees in-range access, so zero fallbacks keep the hot path total and safe. */
        const transform = layerTransforms[galaxyParticles.layerIndices[index] ?? 0];

        if (!transform) {
          continue;
        }

        const angle =
          (galaxyParticles.angles[index] ?? 0) +
          motionTime * (galaxyParticles.rotationSpeeds[index] ?? 0);
        const orbitRadius =
          (galaxyParticles.radii[index] ?? 0) *
          (galaxyParticles.radialScales[index] ?? 0) *
          galaxyRadius;
        let x = Math.cos(angle) * orbitRadius;
        let y = (galaxyParticles.verticalOffsets[index] ?? 0) * galaxyRadius;
        let z = (Math.sin(angle) + (galaxyParticles.planeOffsets[index] ?? 0)) * orbitRadius;
        const rotatedY = y * transform.cosX - z * transform.sinX;
        const rotatedZ = y * transform.sinX + z * transform.cosX;
        const rotatedX = x * transform.cosY + rotatedZ * transform.sinY;
        const rotatedDepth = -x * transform.sinY + rotatedZ * transform.cosY;

        x = rotatedX * transform.cosZ - rotatedY * transform.sinZ;
        y = rotatedX * transform.sinZ + rotatedY * transform.cosZ;
        z = rotatedDepth;

        const perspective = 1 + z / (galaxyRadius * 4.2);
        const pixelX = Math.round(
          centerX + x * perspective,
        );
        const pixelY = Math.round(
          centerY + y * perspective,
        );

        if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) {
          continue;
        }

        const alpha = clamp(
          (galaxyParticles.opacities[index] ?? 0) *
            (0.66 + (galaxyParticles.sizes[index] ?? 0) * 0.5) *
            perspective,
          0.04,
          0.94,
        );

        blendPixel(
          pixelData,
          (pixelY * width + pixelX) * 4,
          galaxyParticles.colorIndices[index] ?? 0,
          alpha,
        );
      }

      particleContext.putImageData(galaxyFrame, 0, 0);
      context.save();
      context.globalCompositeOperation = 'screen';
      context.drawImage(particleCanvas, 0, 0);
      context.restore();
      drawFieldStars(motionTime);
    };

    /* Frame-rate limiting protects CPU time while drag interpolation keeps orbit motion smooth. */
    const animate = (time: number) => {
      animationFrameId = window.requestAnimationFrame(animate);

      if (animationStartTime === null) {
        animationStartTime = time;
      }

      if (time - lastFrameTime < 1000 / MAX_FRAME_RATE) {
        return;
      }

      lastFrameTime = time;
      dragRotationCurrent.x += (dragRotationTarget.x - dragRotationCurrent.x) * 0.08;
      dragRotationCurrent.y += (dragRotationTarget.y - dragRotationCurrent.y) * 0.08;
      renderFrame(time);
    };

    /* Start drag rotation only from open page areas so cards, text selection, and controls behave normally. */
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.button !== 0 ||
        (event.pointerType !== 'mouse' && event.pointerType !== 'pen') ||
        isGalaxyQuietTarget(event.target)
      ) {
        return;
      }

      activePointerId = event.pointerId;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      document.body.classList.add('is-galaxy-dragging');
    };

    /* Active pointer deltas update the target orbit, with immediate redraws in reduced-motion mode. */
    const handlePointerMove = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - previousPointerX;
      const deltaY = event.clientY - previousPointerY;

      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      dragRotationTarget.x += deltaY * 0.005;
      dragRotationTarget.y += deltaX * 0.006;
      event.preventDefault();

      if (reducedMotionQuery.matches) {
        dragRotationCurrent.x = dragRotationTarget.x;
        dragRotationCurrent.y = dragRotationTarget.y;
        renderFrame();
      }
    };

    /* Pointer completion or window blur returns the document to its normal cursor state. */
    const releasePointer = (event?: PointerEvent) => {
      if (event && activePointerId !== event.pointerId) {
        return;
      }

      activePointerId = null;
      document.body.classList.remove('is-galaxy-dragging');
    };

    /* Reduced-motion visitors receive a static galaxy that still responds to deliberate dragging. */
    const startAnimation = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationStartTime = null;

      if (reducedMotionQuery.matches) {
        renderFrame();
        return;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    const handleReducedMotionChange = () => startAnimation();
    const handleWindowBlur = () => releasePointer();

    /* Generate the expensive nebula volume off the main thread, then upload its transferable buffers. */
    if (nebulaWorker) {
      nebulaWorker.onmessage = ({ data }: MessageEvent<unknown>) => {
        /* Reject structurally invalid or unexpectedly sized payloads before touching the GPU. */
        if (!isNebulaVolumeResponse(data) || data.pointCount !== NEBULA_POINT_COUNT) {
          return;
        }

        nebulaRenderer?.upload(data);

        if (reducedMotionQuery.matches) {
          renderFrame();
        }
      };

      /* A crashed or undeliverable worker only costs the decorative nebula layer; release it and
         let the galaxy, field stars, and the rest of the page continue rendering normally. */
      nebulaWorker.onerror = () => {
        nebulaWorker.terminate();
      };
      nebulaWorker.onmessageerror = () => {
        nebulaWorker.terminate();
      };

      nebulaWorker.postMessage({
        pointCount: NEBULA_POINT_COUNT,
        seed: 19770503,
      });
    }

    /* Initial setup and browser listeners keep the renderer synchronized with viewport and input state. */
    resizeCanvas();
    startAnimation();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    window.addEventListener('blur', handleWindowBlur);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    /* Cleanup releases animation, worker, GPU, CSS, and browser-listener resources together. */
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      nebulaWorker?.terminate();
      nebulaRenderer?.dispose();
      document.body.classList.remove('is-galaxy-dragging');
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', releasePointer);
      window.removeEventListener('pointercancel', releasePointer);
      window.removeEventListener('blur', handleWindowBlur);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <>
      {/* WebGL canvas contains the dense worker-generated nebula volume. */}
      <canvas ref={nebulaCanvasRef} className="local-nebula-canvas" aria-hidden="true" />

      {/* Foreground canvas contains projected galaxy points and sparse field stars. */}
      <canvas ref={canvasRef} className="local-galaxy-canvas" aria-hidden="true" />
    </>
  );
}
