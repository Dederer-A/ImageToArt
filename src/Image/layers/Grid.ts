import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class GridLayer implements LayerEngine {
  type: string = 'grid';
  version: string = '1.0.0';
  order: number = 900;
  defaultProperties: any = { value: 4, proportional: false };

  render(variantRuntime: VariantRuntime, src: ImageData, parameters: any): ImageData {
    return grid(variantRuntime, src, parameters.value, parameters.proportional);
  }
}

function grid(_variantRuntime: VariantRuntime, src: ImageData, slider: number, proportional: boolean): ImageData {
  slider = Math.max(0, Math.min(8, Math.round(slider)));

  if (slider === 0 || slider === 1) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  const dst = src;
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
  const rows = proportional ? Math.ceil(height / (width / columns)) : slider;

  const cellWidth = width / columns;
  const cellHeight = height / rows;

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
    drawVertical(Math.round(c * cellWidth));
  }

  // Horizontal grid
  if (proportional) {
    for (let y = cellWidth; y < height; y += cellWidth) {
      drawHorizontal(Math.round(y));
    }
    // Close the grid at the bottom
    drawHorizontal(height - GRID_WIDTH);
  } else {
    for (let r = 1; r < rows; r++) {
      drawHorizontal(Math.round(r * cellHeight));
    }
  }

  return dst;
}
