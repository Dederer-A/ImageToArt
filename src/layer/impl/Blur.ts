import { imageDataRGBA } from 'stackblur-canvas';
import { type LayerImplementation } from '@/layer/LayerRegistry';

export class BlurLayer implements LayerImplementation {
  name: string = 'blur';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(src: ImageData, parameters: any): ImageData {
    console.log(`[BlurLayer] render(): ${JSON.stringify(parameters)}`);
    return stackblur(src, parameters.value);
  }
}

export function stackblur(src: ImageData, slider: number): ImageData { // stackblur
  slider = Math.max(0, Math.min(100, slider));

  if (slider === 0) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MIN_RADIUS = 1;
  const MAX_RADIUS = 50;

  // ------------------------------------------------------------

  const t = slider / 100;

  const radius = Math.round(MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * t);

  const dst = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);

  imageDataRGBA(dst, 0, 0, dst.width, dst.height, radius);

  return dst;
}
