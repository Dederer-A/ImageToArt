import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

const MIN_GAMMA = 0.4;
const MAX_GAMMA = 2.5;

// Cache one LUT for every slider value (0..100)
const gammaLutCache = new Map<number, Uint8ClampedArray>();

export class GammaLayer implements LayerEngine {
  type: string = 'gamma';
  version: string = '1.0.0';
  order: number = 300;
  defaultProperties: any = { value: 50 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return gamma(variantRuntime, src, parameters.value);
  }
}

export function gamma(variantRuntime: VariantRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  // Identity transform
  if (slider === 50) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  const lut = getGammaLut(slider);

  // const dst = new ImageData(src.width, src.height);
  const cacheName = 'gamma';
  let dst = variantRuntime.layerCache.get(cacheName);
  if (dst === undefined) {
    dst = new ImageData(src.width, src.height);
    variantRuntime.layerCache.set(cacheName, dst);
    console.log('[GammaLayer] gamma(): cache miss, creating new ImageData');
  }

  const srcPixels = src.data;
  const dstPixels = dst.data;

  for (let i = 0, n = srcPixels.length; i < n; i += 4) {
    dstPixels[i] = lut[srcPixels[i]];
    dstPixels[i + 1] = lut[srcPixels[i + 1]];
    dstPixels[i + 2] = lut[srcPixels[i + 2]];
    dstPixels[i + 3] = srcPixels[i + 3];
  }

  return dst;
}

function getGammaLut(slider: number): Uint8ClampedArray {
  let lut = gammaLutCache.get(slider);

  if (lut) {
    return lut;
  }

  lut = buildGammaLut(slider);
  gammaLutCache.set(slider, lut);

  return lut;
}

function buildGammaLut(slider: number): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256);

  const t = (slider - 50) / 50;

  // slider = 0   -> MIN_GAMMA
  // slider = 50  -> 1.0
  // slider = 100 -> MAX_GAMMA
  const gamma = t < 0 ? Math.pow(MIN_GAMMA, -t) : Math.pow(MAX_GAMMA, t);

  const exponent = 1 / gamma;

  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(255 * Math.pow(i / 255, exponent));
  }

  return lut;
}
