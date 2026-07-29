import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class SaturationLayer implements LayerEngine {
  type: string = 'saturation';
  version: string = '1.0.0';
  order: number = 200;
  defaultProperties: any = { value: 0 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return saturation(variantRuntime, src, parameters.value);
  }
}

export function saturation(variantRuntime: VariantRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  if (slider === 0) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  const cacheName = 'saturation';
  let dst = variantRuntime.cache.get(cacheName);
  if (dst === undefined) {
    dst = new ImageData(src.width, src.height);
    variantRuntime.cache.set(cacheName, dst);
    console.log('[SaturationLayer] saturation(): cache miss, creating new ImageData');
  }

  const srcPixels = src.data;
  const dstPixels = dst.data;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MAX_DESATURATION = 1.0;

  // ------------------------------------------------------------

  const amount = (slider / 100) * MAX_DESATURATION;

  for (let i = 0; i < srcPixels.length; i += 4) {
    const r = srcPixels[i];
    const g = srcPixels[i + 1];
    const b = srcPixels[i + 2];

    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    dstPixels[i] = clamp(r + (gray - r) * amount);
    dstPixels[i + 1] = clamp(g + (gray - g) * amount);
    dstPixels[i + 2] = clamp(b + (gray - b) * amount);
    dstPixels[i + 3] = srcPixels[i + 3];
  }

  return dst;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}
