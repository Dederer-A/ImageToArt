import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class PosterizeLayer implements LayerEngine {
  type: string = 'posterize';
  version: string = '1.0.0';
  order: number = 600;
  defaultProperties: any = { value: 0 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return posterize(variantRuntime, src, parameters.value);
  }
}

export function posterize(_variantRuntime: VariantRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  const dst = src;

  const srcPixels = src.data;
  const dstPixels = dst.data;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MIN_LEVELS = 2; // strongest posterization (slider = 0)
  const MAX_LEVELS = 8; // mildest posterization (slider = 100)

  // ------------------------------------------------------------

  const t = slider / 100;

  // Linear interpolation: 0 -> MIN_LEVELS, 100 -> MAX_LEVELS
  const levels = Math.round(MIN_LEVELS + (MAX_LEVELS - MIN_LEVELS) * t);

  const step = 255 / (levels - 1);

  for (let i = 0; i < srcPixels.length; i += 4) {
    dstPixels[i] = Math.round(srcPixels[i] / step) * step;
    dstPixels[i + 1] = Math.round(srcPixels[i + 1] / step) * step;
    dstPixels[i + 2] = Math.round(srcPixels[i + 2] / step) * step;
    dstPixels[i + 3] = srcPixels[i + 3];
  }

  return dst;
}
