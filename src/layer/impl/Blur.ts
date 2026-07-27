import { imageDataRGBA } from 'stackblur-canvas';
import { type LayerImplementation } from '@/layer/LayerRegistry';
import type { DocumentRuntime } from '@/document/DocumentRuntime';

export class BlurLayer implements LayerImplementation {
  name: string = 'blur';
  version: string = '1.0.0';
  properties: any = { value: 0 };

  render(documentRuntime: DocumentRuntime, src: ImageData, parameters: any): ImageData {
    console.log(`[BlurLayer] render(): ${JSON.stringify(parameters)}`);
    return stackblur(documentRuntime, src, parameters.value);
  }
}

export function stackblur(_documentRuntime: DocumentRuntime, src: ImageData, slider: number): ImageData {
  if (slider === 0) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  const radius = sliderToBlurRadius(slider);

  let dst = new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);

  imageDataRGBA(dst, 0, 0, dst.width, dst.height, radius);

  return dst;
}

// Slider configuration
const SLIDER_MIN = 0;
const SLIDER_MAX = 100;

// Radius configuration
const RADIUS_MIN = 0;
const RADIUS_MAX = 50;

// Fine control region
const SLIDER_FINE_MAX = 30;
const RADIUS_FINE_MAX = 10;

/**
 * Maps the UI slider value to the actual blur radius.
 *
 * Mapping:
 *  0..30   -> 0..10   (high precision)
 * 31..100  -> 10..50  (faster growth)
 */
function sliderToBlurRadius(slider: number): number {
  // Clamp slider
  slider = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, slider));

  // Fine control range
  if (slider <= SLIDER_FINE_MAX) {
    const t = (slider - SLIDER_MIN) / (SLIDER_FINE_MAX - SLIDER_MIN);

    return RADIUS_MIN + t * (RADIUS_FINE_MAX - RADIUS_MIN);
  }

  // Extended range
  const t = (slider - SLIDER_FINE_MAX) / (SLIDER_MAX - SLIDER_FINE_MAX);

  return RADIUS_FINE_MAX + t * (RADIUS_MAX - RADIUS_FINE_MAX);
}
