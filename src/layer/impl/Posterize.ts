import { type LayerImplementation } from '@/layer/LayerRegistry';
import type { DocumentRuntime } from '@/document/DocumentRuntime';

export class PosterizeLayer implements LayerImplementation {
  name: string = 'posterize';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(documentRuntime: DocumentRuntime, src: ImageData, parameters: any): ImageData {
    console.log(`[PosterizeLayer] render(): ${JSON.stringify(parameters)}`);
    return posterize(documentRuntime, src, parameters.value);
  }
}

export function posterize(documentRuntime: DocumentRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  //   if (slider === 0) {
  //     return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  //   }

  const cacheName = 'posterize';
  let dst = documentRuntime.cache.get(cacheName);
  if (dst === undefined) {
    dst = new ImageData(src.width, src.height);
    documentRuntime.cache.set(cacheName, dst);
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
