import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class PosterizeLayer implements LayerEngine {
  type: string = 'posterize';
  version: string = '1.0.0';
  order: number = 600;
  defaultProperties: any = { value: 0 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    console.log(`[PosterizeLayer] render(): ${JSON.stringify(parameters)}`);
    return posterize(variantRuntime, src, parameters.value);
  }
}

export function posterize(variantRuntime: VariantRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  //   if (slider === 0) {
  //     return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  //   }

  const cacheName = 'posterize';
  let dst = variantRuntime.cache.get(cacheName);
  if (dst === undefined) {
    dst = new ImageData(src.width, src.height);
    variantRuntime.cache.set(cacheName, dst);
    console.log('[PosterizeLayer] posterize(): cache miss, creating new ImageData');
  }

  const srcPixels = src.data;
  const dstPixels = dst.data;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MAX_LEVELS = 8; // original image
  const MIN_LEVELS = 2; // strongest posterization

  // ------------------------------------------------------------

  const t = slider / 100;

  // Linear interpolation
  const levels = Math.round(MAX_LEVELS - (MAX_LEVELS - MIN_LEVELS) * t);

  const step = 255 / (levels - 1);

  for (let i = 0; i < srcPixels.length; i += 4) {
    dstPixels[i] = Math.round(srcPixels[i] / step) * step;
    dstPixels[i + 1] = Math.round(srcPixels[i + 1] / step) * step;
    dstPixels[i + 2] = Math.round(srcPixels[i + 2] / step) * step;
    dstPixels[i + 3] = srcPixels[i + 3];
  }

  return dst;
}
