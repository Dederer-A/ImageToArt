import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class LevelsLayer implements LayerEngine {
  type: string = 'levels';
  version: string = '1.0.0';
  order: number = 50;
  defaultProperties: any = { value: [0, 255] };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return levels(variantRuntime, src, parameters.value[0], parameters.value[1]);
  }
}

export function levels(_variantRuntime: VariantRuntime, src: ImageData, minValue: number, maxValue: number): ImageData {
  // ----- Parameters -----

  const inputBlack = Math.max(0, Math.min(255, minValue));
  const inputWhite = Math.max(inputBlack + 1, Math.min(255, maxValue));

  // Future parameters
  const gamma = 1.0;
  const outputBlack = 0;
  const outputWhite = 255;

  // ----------------------

  const lut = new Uint8Array(256);

  const inputRange = inputWhite - inputBlack;
  const outputRange = outputWhite - outputBlack;
  const invGamma = 1 / gamma;

  // Build lookup table
  for (let i = 0; i < 256; i++) {
    let v = (i - inputBlack) / inputRange;

    if (v <= 0) {
      lut[i] = outputBlack;
      continue;
    }

    if (v >= 1) {
      lut[i] = outputBlack + outputRange;
      continue;
    }

    if (invGamma !== 1) {
      v = Math.pow(v, invGamma);
    }

    lut[i] = (outputBlack + v * outputRange + 0.5) | 0;
  }

  // Apply LUT
  const dst = src;
  // const dst = new ImageData(src.width, src.height);

  const srcData = src.data;
  const dstData = dst.data;

  for (let i = 0; i < srcData.length; i += 4) {
    dstData[i] = lut[srcData[i]];
    dstData[i + 1] = lut[srcData[i + 1]];
    dstData[i + 2] = lut[srcData[i + 2]];
    dstData[i + 3] = srcData[i + 3];
  }

  return dst;
}
