/* Shared tuning keeps navbar route-button lenses restrained and readable. */
export const BACKDROP_TEXTURE_FPS = 18;

export type LiquidGlassRole = 'button';
export type LiquidGlassShape = 'pill' | 'rounded';
export type LiquidGlassColor = readonly [number, number, number];

export type LiquidGlassPreset = {
  blurRadius: number;
  cornerBoost: number;
  edgeDistance: number;
  edgeIntensity: number;
  rimDistance: number;
  rimIntensity: number;
  rippleEffect: number;
  tintBottom: LiquidGlassColor;
  tintOpacity: number;
  tintTop: LiquidGlassColor;
  warp: boolean;
};

const SIGNAL_DEPTH: LiquidGlassColor = [0, 0.16, 0.28];
const SIGNAL_ICE: LiquidGlassColor = [0.42, 0.78, 1];

const BUTTON_PRESET: LiquidGlassPreset = {
  blurRadius: 4.4,
  cornerBoost: 0.006,
  edgeDistance: 0.17,
  edgeIntensity: 0.01,
  rimDistance: 0.84,
  rimIntensity: 0.034,
  rippleEffect: 0.003,
  tintBottom: SIGNAL_DEPTH,
  tintOpacity: 0.12,
  tintTop: SIGNAL_ICE,
  warp: false,
};

const ACTIVE_BUTTON_PRESET: LiquidGlassPreset = {
  ...BUTTON_PRESET,
  edgeIntensity: 0.014,
  rimIntensity: 0.056,
  tintOpacity: 0.22,
};

/* Active routes receive a slightly stronger optical signal without changing layout. */
export const getLiquidGlassPreset = (
  _role: LiquidGlassRole,
  isActive = false,
): LiquidGlassPreset => isActive ? ACTIVE_BUTTON_PRESET : BUTTON_PRESET;

/* Pills derive their radius from rendered height so shader masks follow responsive CSS sizing exactly. */
export const resolveLiquidGlassRadius = (
  shape: LiquidGlassShape,
  height: number,
  radius: number,
) => shape === 'pill' ? height / 2 : radius;
