import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class FalseColorLayer implements LayerEngine {
  type: string = 'falseColor';
  version: string = '1.0.0';
  order: number = 10;
  defaultProperties: any = { value: 0 };

  render(variantRuntime: VariantRuntime, src: ImageData, _parameters: any): ImageData {
    return falseColor(variantRuntime, src);
  }
}

// Pre-generate a thermal/false-color gradient LUT (0-255 mapped to RGB)
const FALSE_COLOR_LUT = (() => {
  const lut = new Uint8ClampedArray(256 * 4); // RGBA for each of the 256 gray levels

  for (let i = 0; i < 256; i++) {
    const t = i / 255; // Normalized 0 to 1
    let r = 0,
      g = 0,
      b = 0;

    // Smooth multi-stop gradient calculation (Blue -> Cyan -> Green -> Yellow -> Red -> White)
    if (t < 0.25) {
      // Black to Blue
      const localT = t * 4;
      b = Math.round(localT * 255);
    } else if (t < 0.5) {
      // Blue to Green
      const localT = (t - 0.25) * 4;
      b = Math.round((1 - localT) * 255);
      g = Math.round(localT * 255);
    } else if (t < 0.75) {
      // Green to Yellow
      const localT = (t - 0.5) * 4;
      g = 255;
      r = Math.round(localT * 255);
    } else {
      // Yellow to White (Highlights)
      const localT = (t - 0.75) * 4;
      g = 255;
      r = 255;
      b = Math.round(localT * 255);
    }

    const idx = i * 4;
    lut[idx] = r; // R
    lut[idx + 1] = g; // G
    lut[idx + 2] = b; // B
    lut[idx + 3] = 255; // Alpha
  }

  return lut;
})();

export function falseColor(_variantRuntime: VariantRuntime, src: ImageData): ImageData {
  const dst = src; // Or new ImageData(...)
  const srcData = src.data;
  const dstData = dst.data;

  for (let i = 0; i < srcData.length; i += 4) {
    // 1. Convert RGB to Grayscale using standard luminance weights
    const gray = (0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2]) | 0;

    // 2. Map through the pre-calculated false color LUT
    const lutIdx = gray * 4;
    dstData[i] = FALSE_COLOR_LUT[lutIdx]; // Red
    dstData[i + 1] = FALSE_COLOR_LUT[lutIdx + 1]; // Green
    dstData[i + 2] = FALSE_COLOR_LUT[lutIdx + 2]; // Blue
    dstData[i + 3] = srcData[i + 3]; // Keep original alpha
  }

  return dst;
}
