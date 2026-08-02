import type { LayerEngine } from '@/workplace/layerEngine';
import { stackblur } from './Blur';
import { contrast } from './Contrast';
import { saturation } from './Saturation';
import type { VariantRuntime } from '@/workplace/runtime';

export class SquintLayer implements LayerEngine {
  type: string = 'squint';
  version: string = '1.0.0';
  order: number = 700;
  defaultProperties: any = { value: 0 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return squint(variantRuntime, src, parameters.value);
  }
}

export function squint(variantRuntime: VariantRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  if (slider === 0) {
    return src;
    // return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  let image = src;

  image = stackblur(variantRuntime, image, slider);
  image = contrast(variantRuntime, image, slider * 0.35);
  image = saturation(variantRuntime, image, slider * 0.4);

  return image;
}
