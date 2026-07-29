import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class RuleOfThirdsLayer implements LayerEngine {
  type: string = 'ruleOfThirds';
  version: string = '1.0.0';
  order: number = 1100;
  defaultProperties: any = {};

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return ruleOfThirds(variantRuntime, src, parameters.value);
  }
}

export function ruleOfThirds(_variantRuntime: VariantRuntime, src: ImageData, _value: number): ImageData {
  let dst = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);

  const pixels = dst.data;

  const width = dst.width;
  const height = dst.height;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const GRID_WIDTH = 3;

  const GRID_COLOR = {
    r: 0,
    g: 120,
    b: 255,
    a: 255,
  };

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

  // ------------------------------------------------------------
  // Rule of Thirds
  // ------------------------------------------------------------

  drawVertical(Math.round(width / 3));
  drawVertical(Math.round((width * 2) / 3));

  drawHorizontal(Math.round(height / 3));
  drawHorizontal(Math.round((height * 2) / 3));

  return dst;
}
