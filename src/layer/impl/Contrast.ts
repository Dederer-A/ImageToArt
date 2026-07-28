import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class ContrastLayer implements LayerEngine {
  type: string = 'contrast';
  version: string = '1.0.0';
  order: number = 100;
  defaultProperties: any = { value: 50 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    console.log(`[Contrast] render(): ${JSON.stringify(parameters)}`);
    return contrast(variantRuntime, src, parameters.value);
  }
}

export function contrast(variantRuntime: VariantRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  const cacheName = 'contrast';
  let dst = variantRuntime.cache.get(cacheName);
  if (dst === undefined) {
    dst = new ImageData(src.width, src.height);
    variantRuntime.cache.set(cacheName, dst);
    console.log('[ContrastLayer] contrast(): cache miss, creating new ImageData');
  }

  const srcPixels = src.data;
  const dstPixels = dst.data;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MIN_CONTRAST = 0.5;
  const MAX_CONTRAST = 2.0;
  const MIDPOINT = 128;

  // ------------------------------------------------------------

  let factor = 0;
  if (slider <= 50) {
    // 0 -> 0.5
    // 50 -> 1.0
    factor = MIN_CONTRAST + (slider / 50) * (1.0 - MIN_CONTRAST);
  } else {
    // 50 -> 1.0
    // 100 -> 2.0
    factor = 1.0 + ((slider - 50) / 50) * (MAX_CONTRAST - 1.0);
  }

  for (let i = 0; i < srcPixels.length; i += 4) {
    dstPixels[i] = clamp((srcPixels[i] - MIDPOINT) * factor + MIDPOINT);
    dstPixels[i + 1] = clamp((srcPixels[i + 1] - MIDPOINT) * factor + MIDPOINT);
    dstPixels[i + 2] = clamp((srcPixels[i + 2] - MIDPOINT) * factor + MIDPOINT);
    dstPixels[i + 3] = srcPixels[i + 3];
  }

  return dst;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}
/*
export function contrast(documentRuntime: DocumentRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  if (slider === 0) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  const cacheName = 'contrast';
  let dst = documentRuntime.cache.get(cacheName);
  if (dst === undefined) {
    dst = new ImageData(src.width, src.height);
    documentRuntime.cache.set(cacheName, dst);
    console.log('[ContrastLayer] contrast(): cache miss, creating new ImageData');
  }

  const srcPixels = src.data;
  const dstPixels = dst.data;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MAX_CONTRAST = 2.0;

  // ------------------------------------------------------------

  const factor = 1 + (slider / 100) * MAX_CONTRAST;

  for (let i = 0; i < srcPixels.length; i += 4) {
    dstPixels[i] = clamp((srcPixels[i] - 128) * factor + 128);
    dstPixels[i + 1] = clamp((srcPixels[i + 1] - 128) * factor + 128);
    dstPixels[i + 2] = clamp((srcPixels[i + 2] - 128) * factor + 128);
    dstPixels[i + 3] = srcPixels[i + 3];
  }

  return dst;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}
*/
