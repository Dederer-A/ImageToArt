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

  const MIN_SQUINT = 5; // minimal effect (slider = 0)
  const MAX_SQUINT = 100; // maximum effect (slider = 100)

  const t = slider / 100;
  const value = MIN_SQUINT + (MAX_SQUINT - MIN_SQUINT) * t;

  let image = src;

  image = stackblur(variantRuntime, image, value);
  image = contrast(variantRuntime, image, value * 0.35);
  image = saturation(variantRuntime, image, value * 0.4);

  return image;
}
