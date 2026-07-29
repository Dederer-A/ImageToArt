import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class GridLayer implements LayerEngine {
  type: string = 'grid';
  version: string = '1.0.0';
  order: number = 900;
  defaultProperties: any = { value: 4 };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return grid(variantRuntime, src, parameters.value);
  }
}

function grid(_variantRuntime: VariantRuntime, src: ImageData, slider: number): ImageData {
  slider = Math.max(0, Math.min(8, Math.round(slider)));

  if (slider === 0 || slider === 1) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  let dst = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);

  const pixels = dst.data;

  const width = dst.width;
  const height = dst.height;

  // ------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------

  const GRID_WIDTH = 2;

  const GRID_COLOR = {
    r: 255,
    g: 0,
    b: 0,
    a: 255,
  };

  // ------------------------------------------------------------

  const columns = slider;

  const cellSize = width / columns;

  function drawVertical(x: number) {
    for (let dx = 0; dx < GRID_WIDTH; dx++) {
      const xx = x + dx;

      if (xx >= width) continue;

      for (let y = 0; y < height; y++) {
        const i = (y * width + xx) * 4;

        pixels[i] = GRID_COLOR.r;
        pixels[i + 1] = GRID_COLOR.g;
        pixels[i + 2] = GRID_COLOR.b;
        pixels[i + 3] = GRID_COLOR.a;
      }
    }
  }

  function drawHorizontal(y: number) {
    for (let dy = 0; dy < GRID_WIDTH; dy++) {
      const yy = y + dy;

      if (yy >= height) continue;

      for (let x = 0; x < width; x++) {
        const i = (yy * width + x) * 4;

        pixels[i] = GRID_COLOR.r;
        pixels[i + 1] = GRID_COLOR.g;
        pixels[i + 2] = GRID_COLOR.b;
        pixels[i + 3] = GRID_COLOR.a;
      }
    }
  }

  // Vertical grid
  for (let c = 1; c < columns; c++) {
    drawVertical(Math.round(c * cellSize));
  }

  // Horizontal grid
  for (let y = cellSize; y < height; y += cellSize) {
    drawHorizontal(Math.round(y));
  }

  // Close the grid at the bottom
  drawHorizontal(height - GRID_WIDTH);

  return dst;
}
