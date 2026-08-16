import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class ThresholdLayer implements LayerEngine {
  type: string = 'threshold';
  version: string = '1.0.0';
  order: number = 25;
  defaultProperties: any = { value: 128 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return threshold(variantRuntime, src, parameters.value);
  }
}

export function threshold(_variantRuntime: VariantRuntime, src: ImageData, thresholdValue: number): ImageData {
  const dst = src; // or new ImageData(...)
  const srcData = src.data;
  const dstData = dst.data;

  const limit = Math.max(0, Math.min(255, thresholdValue));

  for (let i = 0; i < srcData.length; i += 4) {
    // Standard luminance formula (ITU-R BT.601 or BT.709) to get grayscale value
    const lum = 0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2];

    const val = lum < limit ? 0 : 255;

    dstData[i] = val; // Red
    dstData[i + 1] = val; // Green
    dstData[i + 2] = val; // Blue
    dstData[i + 3] = srcData[i + 3]; // Alpha
  }

  return dst;
}
