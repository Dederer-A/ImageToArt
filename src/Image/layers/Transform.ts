import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class TransformLayer implements LayerEngine {
  type: string = 'transform';
  version: string = '1.0.0';
  order: number = 20;
  defaultProperties: any = {
    mirrorVertical: false,
    mirrorHorizontal: false,
    falseColor: false,
    inverse: false,
    stippling: false,
  };

  render(_variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return transform(src, parameters);
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

    if (t < 0.25) {
      const localT = t * 4;
      b = Math.round(localT * 255);
    } else if (t < 0.5) {
      const localT = (t - 0.25) * 4;
      b = Math.round((1 - localT) * 255);
      g = Math.round(localT * 255);
    } else if (t < 0.75) {
      const localT = (t - 0.5) * 4;
      g = 255;
      r = Math.round(localT * 255);
    } else {
      const localT = (t - 0.75) * 4;
      g = 255;
      r = 255;
      b = Math.round(localT * 255);
    }

    const idx = i * 4;
    lut[idx] = r;
    lut[idx + 1] = g;
    lut[idx + 2] = b;
    lut[idx + 3] = 255;
  }

  return lut;
})();

export function transform(
  src: ImageData,
  params: {
    mirrorVertical?: boolean;
    mirrorHorizontal?: boolean;
    falseColor?: boolean;
    inverse?: boolean;
    stippling?: boolean;
  }
): ImageData {
  const {
    mirrorVertical = false,
    mirrorHorizontal = false,
    falseColor = false,
    inverse = false,
    stippling = false,
  } = params;

  if (!mirrorVertical && !mirrorHorizontal && !falseColor && !inverse && !stippling) {
    return src;
  }

  const width = src.width;
  const height = src.height;
  const srcData = src.data;

  if (mirrorHorizontal) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < Math.floor(width / 2); x++) {
        const x2 = width - 1 - x;
        const idx1 = (y * width + x) * 4;
        const idx2 = (y * width + x2) * 4;

        const r = srcData[idx1];
        const g = srcData[idx1 + 1];
        const b = srcData[idx1 + 2];
        const a = srcData[idx1 + 3];

        srcData[idx1] = srcData[idx2];
        srcData[idx1 + 1] = srcData[idx2 + 1];
        srcData[idx1 + 2] = srcData[idx2 + 2];
        srcData[idx1 + 3] = srcData[idx2 + 3];

        srcData[idx2] = r;
        srcData[idx2 + 1] = g;
        srcData[idx2 + 2] = b;
        srcData[idx2 + 3] = a;
      }
    }
  }

  if (mirrorVertical) {
    for (let y = 0; y < Math.floor(height / 2); y++) {
      const y2 = height - 1 - y;
      for (let x = 0; x < width; x++) {
        const idx1 = (y * width + x) * 4;
        const idx2 = (y2 * width + x) * 4;

        const r = srcData[idx1];
        const g = srcData[idx1 + 1];
        const b = srcData[idx1 + 2];
        const a = srcData[idx1 + 3];

        srcData[idx1] = srcData[idx2];
        srcData[idx1 + 1] = srcData[idx2 + 1];
        srcData[idx1 + 2] = srcData[idx2 + 2];
        srcData[idx1 + 3] = srcData[idx2 + 3];

        srcData[idx2] = r;
        srcData[idx2 + 1] = g;
        srcData[idx2 + 2] = b;
        srcData[idx2 + 3] = a;
      }
    }
  }

  if (falseColor) {
    for (let i = 0; i < srcData.length; i += 4) {
      const gray = (0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2]) | 0;
      const lutIdx = gray * 4;
      srcData[i] = FALSE_COLOR_LUT[lutIdx];
      srcData[i + 1] = FALSE_COLOR_LUT[lutIdx + 1];
      srcData[i + 2] = FALSE_COLOR_LUT[lutIdx + 2];
    }
  }

  if (inverse) {
    for (let i = 0; i < srcData.length; i += 4) {
      srcData[i] = 255 - srcData[i];
      srcData[i + 1] = 255 - srcData[i + 1];
      srcData[i + 2] = 255 - srcData[i + 2];
    }
  }

  if (stippling) {
    // Buffer for error propagation across pixels
    const errorBuffer = new Float32Array(width * height);

    // Step 1: Convert to grayscale and initialize error buffer
    for (let i = 0; i < srcData.length; i += 4) {
      const gray = 0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2];
      srcData[i] = gray;
      srcData[i + 1] = gray;
      srcData[i + 2] = gray;
    }

    // Step 2: Perform Floyd-Steinberg Dithering
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIdx = y * width + x;
        const idx = pixelIdx * 4;

        const oldPixel = srcData[idx] + errorBuffer[pixelIdx];
        const newPixel = oldPixel < 128 ? 0 : 255;

        srcData[idx] = newPixel;
        srcData[idx + 1] = newPixel;
        srcData[idx + 2] = newPixel;

        const error = oldPixel - newPixel;

        // Distribute quantization error to neighboring pixels
        if (x + 1 < width) {
          errorBuffer[pixelIdx + 1] += error * (7 / 16);
        }
        if (x - 1 >= 0 && y + 1 < height) {
          errorBuffer[pixelIdx + width - 1] += error * (3 / 16);
        }
        if (y + 1 < height) {
          errorBuffer[pixelIdx + width] += error * (5 / 16);
        }
        if (x + 1 < width && y + 1 < height) {
          errorBuffer[pixelIdx + width + 1] += error * (1 / 16);
        }
      }
    }
  }

  return src;
}