import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class LevelsLayer implements LayerEngine {
  type: string = 'levels';
  version: string = '1.0.0';
  order: number = 50;
  defaultProperties: any = { minValue: 0, maxValue: 2255 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return levels(variantRuntime, src, parameters.minValue, parameters.maxValue);
  }
}

function levels(_variantRuntime: VariantRuntime, src: ImageData, minValue: number, maxValue: number): ImageData {
  // ----- Parameters -----

  // Input Levels
  const inputBlack = Math.max(0, Math.min(255, minValue));
  const inputWhite = Math.max(inputBlack + 1, Math.min(255, maxValue));

  // Midtone (Photoshop Gamma)
  const gamma = 1.0;

  // Output Levels
  const outputBlack = 0;
  const outputWhite = 255;

  // ----------------------

  const dst = new ImageData(src.width, src.height);

  const srcData = src.data;
  const dstData = dst.data;

  const inputRange = inputWhite - inputBlack;
  const outputRange = outputWhite - outputBlack;
  const invGamma = 1 / gamma;

  for (let i = 0; i < srcData.length; i += 4) {
    dstData[i] = applyLevels(srcData[i], inputBlack, inputRange, outputBlack, outputRange, invGamma);
    dstData[i + 1] = applyLevels(srcData[i + 1], inputBlack, inputRange, outputBlack, outputRange, invGamma);
    dstData[i + 2] = applyLevels(srcData[i + 2], inputBlack, inputRange, outputBlack, outputRange, invGamma);
    dstData[i + 3] = srcData[i + 3];
  }

  return dst;
}

function applyLevels(
  value: number,
  inputBlack: number,
  inputRange: number,
  outputBlack: number,
  outputRange: number,
  invGamma: number
): number {
  // Input Levels
  let v = (value - inputBlack) / inputRange;

  if (v <= 0) return outputBlack;
  if (v >= 1) return outputBlack + outputRange;

  // Midtone (Gamma)
  if (invGamma !== 1) {
    v = Math.pow(v, invGamma);
  }

  // Output Levels
  v = outputBlack + v * outputRange;

  return (v + 0.5) | 0;
}
