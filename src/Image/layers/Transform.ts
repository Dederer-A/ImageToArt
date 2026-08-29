import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class TransformLayer implements LayerEngine {
  type: string = 'transform';
  version: string = '1.0.0';
  order: number = 450;
  defaultProperties: any = {
    mirrorVertical: false,
    mirrorHorizontal: false,
    falseColor: false,
    inverse: false,
    stippling: false,
    stipplingSize: 1,
  };

  render(_variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return transform(src, parameters);
  }
}

// Default size for stippling dot grid (1 = 1x1 pixel, 2 = 2x2 pixels block, etc.)
const DEFAULT_STIPPLING_SIZE = 2;

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
    stipplingSize?: number;
  }
): ImageData {
  const {
    mirrorVertical = false,
    mirrorHorizontal = false,
    falseColor = false,
    inverse = false,
    stippling = false,
    stipplingSize = DEFAULT_STIPPLING_SIZE,
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
    const dotSize = Math.max(1, Math.floor(stipplingSize));

    // Number of block columns and rows based on dotSize grid
    const blocksW = Math.ceil(width / dotSize);
    const blocksH = Math.ceil(height / dotSize);

    // Buffer for error propagation between blocks
    const errorBuffer = new Float32Array(blocksW * blocksH);

    // Step 1: Pre-calculate grayscale luminance values in-place
    for (let i = 0; i < srcData.length; i += 4) {
      const gray = 0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2];
      srcData[i] = gray;
      srcData[i + 1] = gray;
      srcData[i + 2] = gray;
    }

    // Step 2: Perform Block-based Floyd-Steinberg Dithering
    for (let by = 0; by < blocksH; by++) {
      for (let bx = 0; bx < blocksW; bx++) {
        const blockIdx = by * blocksW + bx;

        const startX = bx * dotSize;
        const startY = by * dotSize;
        const endX = Math.min(startX + dotSize, width);
        const endY = Math.min(startY + dotSize, height);

        // Compute average luminance across the current block
        let sumLuminance = 0;
        let pixelCount = 0;

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            sumLuminance += srcData[idx];
            pixelCount++;
          }
        }

        const avgLuminance = sumLuminance / pixelCount;
        const oldPixel = avgLuminance + errorBuffer[blockIdx];
        // Add noise to reduce muare (+-15..20%)
        const jitter = (Math.random() - 0.75) * 30;
        const threshold = 128 + jitter;
        const newPixel = oldPixel < threshold ? 0 : 255;

        // Fill the entire block with the resulting black or white value
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            srcData[idx] = newPixel;
            srcData[idx + 1] = newPixel;
            srcData[idx + 2] = newPixel;
          }
        }

        const error = oldPixel - newPixel;

        // Propagate quantization error to neighboring blocks (Floyd-Steinberg weights)
        if (bx + 1 < blocksW) {
          errorBuffer[blockIdx + 1] += error * (7 / 16);
        }
        if (bx - 1 >= 0 && by + 1 < blocksH) {
          errorBuffer[blockIdx + blocksW - 1] += error * (3 / 16);
        }
        if (by + 1 < blocksH) {
          errorBuffer[blockIdx + blocksW] += error * (5 / 16);
        }
        if (bx + 1 < blocksW && by + 1 < blocksH) {
          errorBuffer[blockIdx + blocksW + 1] += error * (1 / 16);
        }
      }
    }
  }

  return src;
}
