/* The main thread sends a deterministic seed and the desired nebula volume density. */
type NebulaVolumeRequest = {
  pointCount: number;
  seed: number;
};

/* Transferable typed-array buffers return compact point positions and RGBA colors without copying. */
type NebulaVolumeResponse = {
  colorsBuffer: ArrayBuffer;
  pointCount: number;
  positionsBuffer: ArrayBuffer;
};

/* A narrow worker scope documents the message contract without depending on DOM-specific globals.
   Incoming messages are typed as unknown because the worker cannot trust the sender's shape. */
type WorkerScope = {
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  postMessage: (message: NebulaVolumeResponse, transfer: Transferable[]) => void;
};

/* Shared numeric limits shape the generated volume and its luminous inner nucleus. */
const workerScope = self as unknown as WorkerScope;
const TAU = Math.PI * 2;
const POSITION_SCALE = 32767;
const LUMINOUS_NUCLEUS_FRACTION = 0.032;

/* Upper bound stops a malformed message from requesting a multi-gigabyte typed-array allocation. */
const MAX_POINT_COUNT = 4_000_000;

/* Validate the message at the trust boundary before any allocation sized from its values. */
const isNebulaVolumeRequest = (data: unknown): data is NebulaVolumeRequest => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const { pointCount, seed } = data as Partial<NebulaVolumeRequest>;

  return (
    typeof pointCount === 'number' &&
    Number.isSafeInteger(pointCount) &&
    pointCount > 0 &&
    pointCount <= MAX_POINT_COUNT &&
    typeof seed === 'number' &&
    Number.isFinite(seed)
  );
};

/* Seeded output keeps the generated nebula stable across page loads and worker restarts. */
const createSeededRandom = (seed: number) => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};

/* Clamp and quantization helpers pack normalized positions into signed 16-bit storage. */
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const quantizePosition = (value: number) =>
  Math.round(clamp(value, -1, 1) * POSITION_SCALE);

/* Each request builds a complete volume off the main thread before transferring its buffers. */
workerScope.onmessage = ({ data }) => {
  if (!isNebulaVolumeRequest(data)) {
    return;
  }

  const { pointCount, seed } = data;
  const random = createSeededRandom(seed);
  const positions = new Int16Array(pointCount * 3);
  const colors = new Uint8Array(pointCount * 4);
  const luminousNucleusStartIndex = Math.floor(pointCount * (1 - LUMINOUS_NUCLEUS_FRACTION));

  /* Parallel arrays keep position and color data compact for direct WebGL upload. */
  const writeParticle = (
    index: number,
    x: number,
    y: number,
    z: number,
    red: number,
    green: number,
    blue: number,
    alpha: number,
  ) => {
    const positionOffset = index * 3;
    const colorOffset = index * 4;

    positions[positionOffset] = quantizePosition(x);
    positions[positionOffset + 1] = quantizePosition(y);
    positions[positionOffset + 2] = quantizePosition(z);
    colors[colorOffset] = red;
    colors[colorOffset + 1] = green;
    colors[colorOffset + 2] = blue;
    colors[colorOffset + 3] = alpha;
  };

  for (let index = 0; index < pointCount; index += 1) {
    /* The final particle slice forms a softly blended white-hot spherical nucleus. */
    if (index >= luminousNucleusStartIndex) {
      const nucleusRadius = 0.075;
      const sphericalRadius = Math.pow(random(), 0.9) * nucleusRadius;
      const polarAngle = Math.acos(2 * random() - 1);
      const radialDistance = Math.sin(polarAngle) * sphericalRadius;
      const radialFade = 1 - sphericalRadius / nucleusRadius;
      const angle = random() * TAU;
      const whiteHot = random() > 0.34;

      writeParticle(
        index,
        Math.cos(angle) * radialDistance,
        Math.cos(polarAngle) * sphericalRadius,
        Math.sin(angle) * radialDistance,
        255,
        whiteHot ? 246 + Math.round(random() * 9) : 216 + Math.round(random() * 24),
        whiteHot ? 211 + Math.round(random() * 35) : 112 + Math.round(random() * 46),
        58 + Math.round(random() * 70 + radialFade * 50),
      );
      continue;
    }

    const family = random();

    /* Most points follow broad warm spiral arms with occasional cool color contrast. */
    if (family < 0.54) {
      const radius = Math.pow(random(), 0.76);
      const arm = index % 5;
      const angle =
        arm * (TAU / 5) +
        radius * 7.1 +
        (random() - 0.5) * (0.26 + radius * 0.58);
      const thickness = 0.018 + radius * 0.075;
      const warmBias = random();

      writeParticle(
        index,
        Math.cos(angle) * radius * 0.97 + (random() - 0.5) * thickness,
        (random() - 0.5) * thickness * 0.64,
        Math.sin(angle) * radius * 0.97 + (random() - 0.5) * thickness,
        warmBias > 0.16 ? 255 : 151,
        warmBias > 0.16 ? 168 + Math.round(random() * 56) : 188,
        warmBias > 0.16 ? 62 + Math.round(random() * 92) : 255,
        18 + Math.round(random() * 42),
      );
      continue;
    }

    /* A tighter disk fills the bright center continuously and fades toward the outer radius. */
    if (family < 0.8) {
      const radius = Math.pow(random(), 1.7);
      const angle = random() * TAU + radius * 5.6;
      const thickness = 0.014 + radius * 0.08;
      const whiteHot = radius < 0.23;
      const yellowHot = radius < 0.48;

      writeParticle(
        index,
        Math.cos(angle) * radius * 0.58 + (random() - 0.5) * thickness,
        (random() - 0.5) * (0.018 + radius * 0.05),
        Math.sin(angle) * radius * 0.58 + (random() - 0.5) * thickness,
        255,
        whiteHot ? 249 : yellowHot ? 210 : 164,
        whiteHot ? 224 : yellowHot ? 112 : 62,
        30 + Math.round(random() * 58),
      );
      continue;
    }

    /* A low-opacity halo extends beyond the disk to soften the silhouette. */
    if (family < 0.97) {
      const sphericalRadius = 0.24 + Math.pow(random(), 1.4) * 0.84;
      const azimuth = random() * TAU;

      writeParticle(
        index,
        Math.cos(azimuth) * sphericalRadius,
        (random() - 0.5) * (0.028 + sphericalRadius * 0.052),
        Math.sin(azimuth) * sphericalRadius,
        255,
        156 + Math.round(random() * 72),
        64 + Math.round(random() * 88),
        8 + Math.round(random() * 22),
      );
      continue;
    }

    /* Remaining particles form faint dust lanes that add darker structure between bright arms. */
    const radius = 0.14 + random() * 0.92;
    const arm = index % 4;
    const angle = arm * (TAU / 4) + radius * 6.2 + (random() - 0.5) * 0.16;
    const thickness = 0.018 + radius * 0.045;

    writeParticle(
      index,
      Math.cos(angle) * radius * 0.95 + (random() - 0.5) * thickness,
      (random() - 0.5) * thickness * 0.48,
      Math.sin(angle) * radius * 0.95 + (random() - 0.5) * thickness,
      112,
      72,
      42,
      10 + Math.round(random() * 18),
    );
  }

  /* Transfer ownership of both buffers so the main thread can upload them without serialization cost. */
  workerScope.postMessage(
    {
      colorsBuffer: colors.buffer,
      pointCount,
      positionsBuffer: positions.buffer,
    },
    [positions.buffer, colors.buffer],
  );
};

export {};
