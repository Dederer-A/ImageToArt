import { type LayerImplementation } from '@/layer/LayerRegistry';

export class GammaLayer implements LayerImplementation {
  name: string = 'gamma';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(src: ImageData, parameters: any): ImageData {
    console.log(`[GammaLayer] render(): ${JSON.stringify(parameters)}`);
    return gamma(src, parameters.value);
  }
}

export function gamma(src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  if (slider === 50) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  const dst = new ImageData(src.width, src.height);

  const srcPixels = src.data;
  const dstPixels = dst.data;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MIN_GAMMA = 0.4;
  const MAX_GAMMA = 2.5;

  // ------------------------------------------------------------

  const t = (slider - 50) / 50;

  // Exponential mapping:
  // slider = 0   -> MIN_GAMMA
  // slider = 50  -> 1.0
  // slider = 100 -> MAX_GAMMA

  const gamma = t < 0 ? Math.pow(MIN_GAMMA, -t) : Math.pow(MAX_GAMMA, t);

  const exponent = 1 / gamma;

  for (let i = 0; i < srcPixels.length; i += 4) {
    dstPixels[i] = clamp(255 * Math.pow(srcPixels[i] / 255, exponent));

    dstPixels[i + 1] = clamp(255 * Math.pow(srcPixels[i + 1] / 255, exponent));

    dstPixels[i + 2] = clamp(255 * Math.pow(srcPixels[i + 2] / 255, exponent));

    dstPixels[i + 3] = srcPixels[i + 3];
  }

  return dst;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
