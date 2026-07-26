import { type LayerImplementation } from '@/layer/LayerRegistry';

export class PosterizeLayer implements LayerImplementation {
  name: string = 'posterize';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(src: ImageData, parameters: any): ImageData {
    console.log(`[PosterizeLayer] render(): ${JSON.stringify(parameters)}`);
    return posterize(src, parameters.value);
  }
}
export function posterize(src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

//   if (slider === 0) {
//     return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
//   }

  const dst = new ImageData(src.width, src.height);

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
