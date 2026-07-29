import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';
export class GoldenRatioLayer implements LayerEngine {
  type: string = 'goldenRatio';
  version: string = '1.0.0';
  order: number = 1000;
  defaultProperties: any = {};

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return goldenRatio(variantRuntime, src, parameters.value);
  }
}

export function goldenRatio(_variantRuntime: VariantRuntime, src: ImageData, _value: number): ImageData {
  let dst = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);

  const pixels = dst.data;

  const width = dst.width;
  const height = dst.height;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const GRID_WIDTH = 3;

  const GRID_COLOR = {
    r: 212,
    g: 175,
    b: 55,
    a: 255,
  };

  const PHI = 0.61803398875;

  // ------------------------------------------------------------

  function setPixel(x: number, y: number): void {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }

    const i = (y * width + x) * 4;

    pixels[i] = GRID_COLOR.r;
    pixels[i + 1] = GRID_COLOR.g;
    pixels[i + 2] = GRID_COLOR.b;
    pixels[i + 3] = GRID_COLOR.a;
  }

  function drawVertical(x: number): void {
    for (let dx = 0; dx < GRID_WIDTH; dx++) {
      const xx = x + dx;

      for (let y = 0; y < height; y++) {
        setPixel(xx, y);
      }
    }
  }

  function drawHorizontal(y: number): void {
    for (let dy = 0; dy < GRID_WIDTH; dy++) {
      const yy = y + dy;

      for (let x = 0; x < width; x++) {
        setPixel(x, yy);
      }
    }
  }

  // Bresenham line
  function drawLine(x0: number, y0: number, x1: number, y1: number): void {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;

    let err = dx - dy;

    while (true) {
      for (let ox = 0; ox < GRID_WIDTH; ox++) {
        for (let oy = 0; oy < GRID_WIDTH; oy++) {
          setPixel(x0 + ox, y0 + oy);
        }
      }

      if (x0 === x1 && y0 === y1) break;

      const e2 = err * 2;

      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }

      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  // ------------------------------------------------------------
  // Golden Ratio Grid
  // ------------------------------------------------------------

  const x1 = Math.round(width * (1 - PHI));
  const x2 = Math.round(width * PHI);

  const y1 = Math.round(height * (1 - PHI));
  const y2 = Math.round(height * PHI);

  drawVertical(x1);
  drawVertical(x2);

  drawHorizontal(y1);
  drawHorizontal(y2);

  // ------------------------------------------------------------
  // Main diagonals
  // ------------------------------------------------------------

  drawLine(0, 0, width - 1, height - 1);
  drawLine(width - 1, 0, 0, height - 1);

  // ------------------------------------------------------------
  // Reciprocal diagonals
  // ------------------------------------------------------------

  drawLine(0, 0, x2, height - 1);
  drawLine(0, height - 1, x2, 0);

  drawLine(width - 1, 0, x1, height - 1);
  drawLine(width - 1, height - 1, x1, 0);

  return dst;
}
