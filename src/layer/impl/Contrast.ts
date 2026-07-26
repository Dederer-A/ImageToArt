import { type LayerImplementation } from '@/layer/LayerRegistry';

export class ContrastLayer implements LayerImplementation {
  name: string = 'contrast';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(src: ImageData, parameters: any): ImageData {
    console.log(`[Contrast] render(): ${JSON.stringify(parameters)}`);
    return contrast(src, parameters.value);
  }
}

export function contrast(src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  if (slider === 0) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  const dst = new ImageData(src.width, src.height);

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
