import { type LayerImplementation } from '@/layer/LayerRegistry';
import type { DocumentRuntime } from '@/document/DocumentRuntime';
import { stackblur } from './Blur';

export class EdgeLayer implements LayerImplementation {
  name: string = 'edge';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(documentRuntime: DocumentRuntime, src: ImageData, parameters: any): ImageData {
    console.log(`[edge] render(): ${JSON.stringify(parameters)}`);
    return edge(documentRuntime, src, parameters.value);
  }
}

export function edge(documentRuntime: DocumentRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(100, slider));

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const MAX_BLUR = 12;

  const MIN_THRESHOLD = 0.0;
  const MAX_THRESHOLD = 0.55;

  const SMOOTH_WIDTH = 0.15;

  const INVERT_OUTPUT = false;

  // ------------------------------------------------------------

  const blurred = stackblur(documentRuntime, src, (slider * MAX_BLUR) / 100);

  const width = blurred.width;
  const height = blurred.height;

  const gray = new Uint8Array(width * height);

  // RGB -> Gray
  for (let i = 0, j = 0; i < blurred.data.length; i += 4, j++) {
    gray[j] = 0.2126 * blurred.data[i] + 0.7152 * blurred.data[i + 1] + 0.0722 * blurred.data[i + 2];
  }

  const gradients = new Uint16Array(width * height);

  let maxGradient = 1;

  // ------------------------------------------------------------
  // Sobel
  // ------------------------------------------------------------

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p00 = gray[(y - 1) * width + x - 1];
      const p01 = gray[(y - 1) * width + x];
      const p02 = gray[(y - 1) * width + x + 1];

      const p10 = gray[y * width + x - 1];
      const p12 = gray[y * width + x + 1];

      const p20 = gray[(y + 1) * width + x - 1];
      const p21 = gray[(y + 1) * width + x];
      const p22 = gray[(y + 1) * width + x + 1];

      const gx = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22;

      const gy = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;

      const magnitude = Math.abs(gx) + Math.abs(gy);

      gradients[y * width + x] = magnitude;

      if (magnitude > maxGradient) {
        maxGradient = magnitude;
      }
    }
  }

  // ------------------------------------------------------------
  // Normalize + Smooth Threshold
  // ------------------------------------------------------------

  let dst = new ImageData(src.width, src.height);
  const out = dst.data;

  const threshold = MIN_THRESHOLD + (MAX_THRESHOLD - MIN_THRESHOLD) * (slider / 100);

  for (let i = 0; i < gradients.length; i++) {
    const value = gradients[i] / maxGradient;

    const t = smoothstep(threshold, threshold + SMOOTH_WIDTH, value);

    let v = Math.round(t * 255);

    if (INVERT_OUTPUT) {
      v = 255 - v;
    }

    const j = i * 4;

    out[j] = v;
    out[j + 1] = v;
    out[j + 2] = v;
    out[j + 3] = 255;
  }

  return dst;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  let t = (x - edge0) / (edge1 - edge0);

  t = Math.max(0, Math.min(1, t));

  return t * t * (3 - 2 * t);
}
