/* The renderer adapts the reference liquid-glass shader to cropped live textures from the portfolio backdrop. */
import {
  resolveLiquidGlassRadius,
  type LiquidGlassPreset,
  type LiquidGlassShape,
} from './liquidGlassConfig';

export type LiquidGlassRenderer = {
  dispose: () => void;
  render: (source: HTMLCanvasElement | null) => boolean;
  resize: () => void;
  updatePreset: (preset: LiquidGlassPreset) => void;
};

type LiquidGlassRendererOptions = {
  canvas: HTMLCanvasElement;
  element: HTMLElement;
  preset: LiquidGlassPreset;
  radius: number;
  shape: LiquidGlassShape;
};

type Uniforms = {
  blurRadius: WebGLUniformLocation | null;
  cornerBoost: WebGLUniformLocation | null;
  edgeDistance: WebGLUniformLocation | null;
  edgeIntensity: WebGLUniformLocation | null;
  image: WebGLUniformLocation | null;
  radius: WebGLUniformLocation | null;
  resolution: WebGLUniformLocation | null;
  rimDistance: WebGLUniformLocation | null;
  rimIntensity: WebGLUniformLocation | null;
  rippleEffect: WebGLUniformLocation | null;
  textureMargin: WebGLUniformLocation | null;
  textureSize: WebGLUniformLocation | null;
  tintBottom: WebGLUniformLocation | null;
  tintOpacity: WebGLUniformLocation | null;
  tintTop: WebGLUniformLocation | null;
  warp: WebGLUniformLocation | null;
};

const TEXTURE_MARGIN = 28;

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  attribute vec2 aTextureCoordinate;
  varying vec2 vTextureCoordinate;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vTextureCoordinate = aTextureCoordinate;
  }
`;

/* Signed-distance masking and refraction mirror the source library while using a smaller five-sample blur. */
const FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D uImage;
  uniform vec2 uResolution;
  uniform vec2 uTextureSize;
  uniform vec2 uTextureMargin;
  uniform float uRadius;
  uniform float uBlurRadius;
  uniform float uCornerBoost;
  uniform float uEdgeDistance;
  uniform float uEdgeIntensity;
  uniform float uRimDistance;
  uniform float uRimIntensity;
  uniform float uRippleEffect;
  uniform vec3 uTintBottom;
  uniform float uTintOpacity;
  uniform vec3 uTintTop;
  uniform float uWarp;
  varying vec2 vTextureCoordinate;

  float roundedRectangleDistance(vec2 point, vec2 size, float radius) {
    vec2 halfSize = size * 0.5;
    vec2 corner = abs(point - halfSize) - (halfSize - radius);
    return length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - radius;
  }

  vec2 shapeNormal(vec2 point, vec2 size, float radius) {
    vec2 horizontal = vec2(1.0, 0.0);
    vec2 vertical = vec2(0.0, 1.0);
    float deltaX =
      roundedRectangleDistance(point + horizontal, size, radius) -
      roundedRectangleDistance(point - horizontal, size, radius);
    float deltaY =
      roundedRectangleDistance(point + vertical, size, radius) -
      roundedRectangleDistance(point - vertical, size, radius);
    vec2 gradient = vec2(deltaX, deltaY);

    if (length(gradient) < 0.001) {
      return normalize(point - size * 0.5 + vec2(0.001));
    }

    return normalize(gradient);
  }

  void main() {
    vec2 localPoint = vTextureCoordinate * uResolution;
    float signedDistance = roundedRectangleDistance(localPoint, uResolution, uRadius);
    float insideDistance = max(-signedDistance, 0.0);
    vec2 normal = shapeNormal(localPoint, uResolution, uRadius);
    vec2 tangent = vec2(-normal.y, normal.x);
    float edge = exp(-insideDistance * uEdgeDistance);
    float rim = exp(-insideDistance * uRimDistance);
    float curvedCorner = smoothstep(0.34, 0.92, abs(normal.x * normal.y) * 2.0);
    float centerWarp = uWarp * (1.0 - edge) * 0.012;
    float ripple = sin(insideDistance * 0.78) * uRippleEffect * rim;
    float distortion =
      (edge * uEdgeIntensity + rim * uRimIntensity + curvedCorner * uCornerBoost) *
      min(uResolution.x, uResolution.y) *
      8.0;
    vec2 refraction = normal * (distortion + centerWarp) + tangent * ripple * 12.0;
    vec2 textureCoordinate = (localPoint + uTextureMargin + refraction) / uTextureSize;
    vec2 blurStep = vec2(uBlurRadius) / uTextureSize;
    vec4 color =
      texture2D(uImage, textureCoordinate) * 0.36 +
      texture2D(uImage, textureCoordinate + vec2(blurStep.x, 0.0)) * 0.16 +
      texture2D(uImage, textureCoordinate - vec2(blurStep.x, 0.0)) * 0.16 +
      texture2D(uImage, textureCoordinate + vec2(0.0, blurStep.y)) * 0.16 +
      texture2D(uImage, textureCoordinate - vec2(0.0, blurStep.y)) * 0.16;
    vec3 tint = mix(uTintTop, uTintBottom, vTextureCoordinate.y);
    vec3 rimLight = vec3(0.18, 0.62, 1.0) * rim * 0.16;
    vec3 tintedColor = mix(color.rgb, tint, uTintOpacity) + rimLight;
    float mask = 1.0 - smoothstep(-1.0, 1.0, signedDistance);

    gl_FragColor = vec4(tintedColor, mask);
  }
`;

/* Compile failures disable enhancement for one surface while CSS fallback styling stays intact. */
const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const createProgram = (gl: WebGLRenderingContext) => {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    if (vertexShader) {
      gl.deleteShader(vertexShader);
    }

    if (fragmentShader) {
      gl.deleteShader(fragmentShader);
    }

    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

/* The crop keeps texture uploads local to each lens instead of repeating a full viewport transfer per surface. */
const drawSourceCrop = (
  context: CanvasRenderingContext2D,
  crop: HTMLCanvasElement,
  source: HTMLCanvasElement,
  bounds: DOMRect,
) => {
  const desiredLeft = Math.floor(bounds.left) - TEXTURE_MARGIN;
  const desiredTop = Math.floor(bounds.top) - TEXTURE_MARGIN;
  const sourceLeft = Math.max(0, desiredLeft);
  const sourceTop = Math.max(0, desiredTop);
  const destinationLeft = Math.max(0, -desiredLeft);
  const destinationTop = Math.max(0, -desiredTop);
  const copyWidth = Math.min(source.width - sourceLeft, crop.width - destinationLeft);
  const copyHeight = Math.min(source.height - sourceTop, crop.height - destinationTop);

  context.clearRect(0, 0, crop.width, crop.height);

  if (copyWidth <= 0 || copyHeight <= 0) {
    return false;
  }

  context.drawImage(
    source,
    sourceLeft,
    sourceTop,
    copyWidth,
    copyHeight,
    destinationLeft,
    destinationTop,
    copyWidth,
    copyHeight,
  );

  return true;
};

export const createLiquidGlassRenderer = ({
  canvas,
  element,
  preset: initialPreset,
  radius,
  shape,
}: LiquidGlassRendererOptions): LiquidGlassRenderer | null => {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
    premultipliedAlpha: true,
  });

  if (!gl) {
    return null;
  }

  const crop = document.createElement('canvas');
  const cropContext = crop.getContext('2d', { alpha: true });
  const program = createProgram(gl);
  const positionBuffer = gl.createBuffer();
  const textureCoordinateBuffer = gl.createBuffer();
  const texture = gl.createTexture();

  if (!cropContext || !program || !positionBuffer || !textureCoordinateBuffer || !texture) {
    if (program) {
      gl.deleteProgram(program);
    }

    if (positionBuffer) {
      gl.deleteBuffer(positionBuffer);
    }

    if (textureCoordinateBuffer) {
      gl.deleteBuffer(textureCoordinateBuffer);
    }

    if (texture) {
      gl.deleteTexture(texture);
    }

    return null;
  }

  const uniforms: Uniforms = {
    blurRadius: gl.getUniformLocation(program, 'uBlurRadius'),
    cornerBoost: gl.getUniformLocation(program, 'uCornerBoost'),
    edgeDistance: gl.getUniformLocation(program, 'uEdgeDistance'),
    edgeIntensity: gl.getUniformLocation(program, 'uEdgeIntensity'),
    image: gl.getUniformLocation(program, 'uImage'),
    radius: gl.getUniformLocation(program, 'uRadius'),
    resolution: gl.getUniformLocation(program, 'uResolution'),
    rimDistance: gl.getUniformLocation(program, 'uRimDistance'),
    rimIntensity: gl.getUniformLocation(program, 'uRimIntensity'),
    rippleEffect: gl.getUniformLocation(program, 'uRippleEffect'),
    textureMargin: gl.getUniformLocation(program, 'uTextureMargin'),
    textureSize: gl.getUniformLocation(program, 'uTextureSize'),
    tintBottom: gl.getUniformLocation(program, 'uTintBottom'),
    tintOpacity: gl.getUniformLocation(program, 'uTintOpacity'),
    tintTop: gl.getUniformLocation(program, 'uTintTop'),
    warp: gl.getUniformLocation(program, 'uWarp'),
  };
  let bounds = element.getBoundingClientRect();
  let preset = initialPreset;

  gl.useProgram(program);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const positionLocation = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
    gl.STATIC_DRAW,
  );

  const textureCoordinateLocation = gl.getAttribLocation(program, 'aTextureCoordinate');
  gl.enableVertexAttribArray(textureCoordinateLocation);
  gl.vertexAttribPointer(textureCoordinateLocation, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(uniforms.image, 0);

  const updatePreset = (nextPreset: LiquidGlassPreset) => {
    preset = nextPreset;
    gl.useProgram(program);
    gl.uniform1f(uniforms.blurRadius, preset.blurRadius);
    gl.uniform1f(uniforms.cornerBoost, preset.cornerBoost);
    gl.uniform1f(uniforms.edgeDistance, preset.edgeDistance);
    gl.uniform1f(uniforms.edgeIntensity, preset.edgeIntensity);
    gl.uniform1f(uniforms.rimDistance, preset.rimDistance);
    gl.uniform1f(uniforms.rimIntensity, preset.rimIntensity);
    gl.uniform1f(uniforms.rippleEffect, preset.rippleEffect);
    gl.uniform3f(uniforms.tintBottom, ...preset.tintBottom);
    gl.uniform1f(uniforms.tintOpacity, preset.tintOpacity);
    gl.uniform3f(uniforms.tintTop, ...preset.tintTop);
    gl.uniform1f(uniforms.warp, preset.warp ? 1 : 0);
  };

  const resize = () => {
    bounds = element.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(bounds.width));
    const height = Math.max(1, Math.ceil(bounds.height));
    const textureWidth = width + TEXTURE_MARGIN * 2;
    const textureHeight = height + TEXTURE_MARGIN * 2;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    if (crop.width !== textureWidth || crop.height !== textureHeight) {
      crop.width = textureWidth;
      crop.height = textureHeight;
    }

    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform2f(uniforms.textureMargin, TEXTURE_MARGIN, TEXTURE_MARGIN);
    gl.uniform2f(uniforms.textureSize, textureWidth, textureHeight);
    gl.uniform1f(uniforms.radius, resolveLiquidGlassRadius(shape, height, radius));
  };

  const render = (source: HTMLCanvasElement | null) => {
    if (!source || gl.isContextLost()) {
      return false;
    }

    resize();

    try {
      if (!drawSourceCrop(cropContext, crop, source, bounds)) {
        return false;
      }

      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, crop);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return true;
    } catch {
      return false;
    }
  };

  updatePreset(preset);
  resize();

  return {
    dispose: () => {
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(textureCoordinateBuffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    },
    render,
    resize,
    updatePreset,
  };
};
