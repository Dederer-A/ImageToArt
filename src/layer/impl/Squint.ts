import { type LayerImplementation } from '@/layer/LayerRegistry';
import type { DocumentRuntime } from '@/document/DocumentRuntime';
import { stackblur } from './Blur';
import { contrast } from './Contrast';
import { saturation } from './Saturation';

export class SquintLayer implements LayerImplementation {
  name: string = 'squint';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(documentRuntime: DocumentRuntime, src: ImageData, parameters: any): ImageData {
    console.log(`[Squint] render(): ${JSON.stringify(parameters)}`);
    return squint(documentRuntime, src, parameters.value);
  }
}

export function squint(documentRuntime: DocumentRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  if (slider === 0) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  let image = src;

  image = stackblur(documentRuntime, image, slider);
  image = contrast(documentRuntime, image, slider * 0.35);
  image = saturation(documentRuntime, image, slider * 0.4);

  return image;
}
