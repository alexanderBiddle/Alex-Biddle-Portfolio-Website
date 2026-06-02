import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BACKDROP_TEXTURE_FPS,
  getLiquidGlassPreset,
  resolveLiquidGlassRadius,
} from '../src/components/ui/liquidGlassConfig.ts';

test('pill surfaces use half their height as the shader radius', () => {
  assert.equal(resolveLiquidGlassRadius('pill', 40, 8), 20);
});

test('rounded surfaces preserve their configured shader radius', () => {
  assert.equal(resolveLiquidGlassRadius('rounded', 40, 8), 8);
});

test('active route glass increases tint and rim visibility', () => {
  const idleButton = getLiquidGlassPreset('button');
  const activeButton = getLiquidGlassPreset('button', true);

  assert.ok(activeButton.tintOpacity > idleButton.tintOpacity);
  assert.ok(activeButton.rimIntensity > idleButton.rimIntensity);
});

test('shared backdrop texture updates are capped below the backdrop renderer frame rate', () => {
  assert.equal(BACKDROP_TEXTURE_FPS, 18);
});
