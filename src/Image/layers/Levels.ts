import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class LevelsLayer implements LayerEngine {
  type: string = 'levels';
  version: string = '1.0.0';
  order: number = 50;
  defaultProperties: any = { value: [0, 128, 255] };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return levels(variantRuntime, src, parameters.value[0], parameters.value[2], parameters.value[1]);
  }
}

export function levels(
  _variantRuntime: VariantRuntime,
  src: ImageData,
  minValue: number,
  maxValue: number,
  midValue: number = 128 // 0 to 255 range, where 128 is neutral (does nothing)
): ImageData {
  // ----- Parameters -----

  const inputBlack = Math.max(0, Math.min(255, minValue));
  const inputWhite = Math.max(inputBlack + 1, Math.min(255, maxValue));

  // Clamp midValue to valid range (0-255), defaulting neutral to 128
  const inputMid = Math.max(inputBlack, Math.min(inputWhite, midValue));

  const outputBlack = 0;
  const outputWhite = 255;

  // Calculate standard Photoshop-style midtone/gamma from the 0-255 input range
  // When inputMid is at the exact center between black and white, gamma is 1.0
  let gamma = 1.0;
  const range = inputWhite - inputBlack;

  if (range > 0) {
    // Normalized position of the mid point (0 to 1)
    const normalizedMid = (inputMid - inputBlack) / range;

    // Standard levels formula: gamma = log(0.5) / log(normalizedMid)
    // We constrain normalizedMid to prevent division by zero or log of zero/negative numbers
    if (normalizedMid > 0 && normalizedMid < 1 && normalizedMid !== 0.5) {
      gamma = Math.log(0.5) / Math.log(normalizedMid);
    }
  }

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
