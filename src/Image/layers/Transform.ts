import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class TransformLayer implements LayerEngine {
  type: string = 'transform';
  version: string = '1.0.0';
  order: number = 20;
  defaultProperties: any = {
    mirrorVertical: false,
    mirrorHorizontal: false,
    inverse: false,
  };

  render(_variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return transform(src, parameters);
  }
}

export function transform(
  src: ImageData,
  params: { mirrorVertical?: boolean; mirrorHorizontal?: boolean; inverse?: boolean }
): ImageData {
  const { mirrorVertical = false, mirrorHorizontal = false, inverse = false } = params;

  if (!mirrorVertical && !mirrorHorizontal && !inverse) {
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

  if (inverse) {
    for (let i = 0; i < srcData.length; i += 4) {
      srcData[i] = 255 - srcData[i];
      srcData[i + 1] = 255 - srcData[i + 1];
      srcData[i + 2] = 255 - srcData[i + 2];
    }
  }

  return src;
}
