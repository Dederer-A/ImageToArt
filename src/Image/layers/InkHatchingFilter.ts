import type { LayerEngine } from '@/workplace/layerEngine';
import type { VariantRuntime } from '@/workplace/runtime';

export class InkHatchingLayer implements LayerEngine {
  type: string = 'inkHatching';
  version: string = '1.0.0';
  order: number = 650;
  defaultProperties: Record<string, number> = { value: 50 };

  render(_variantRuntime: VariantRuntime, src: ImageData, parameters: Record<string, number>): ImageData {
    return inkHatchingFilter(src, parameters.value ?? 50);
  }
}

/**
 * InkHatchingFilter
 *
 * Converts an ImageData reference into a structure-aware ink drawing.
 * Uses a Sobel gradient field to align hatching strokes with local object contours,
 * creating strokes that follow visual form rather than laying down a uniform grid.
 *
 * Architecture:
 *   ImageData -> Grayscale & Darkness Map
 *             -> Sobel Gradients & Smooth Orientation Field
 *             -> Multi-Layer Streamline Hatching (Contour + Cross-Hatching)
 *             -> Tapered Anti-Aliased Ink Stroke Rasterization
 */

export function inkHatchingFilter(src: ImageData, slider: number): ImageData {
  const width = src.width;
  const height = src.height;

  const dst = new ImageData(width, height);
  const input = src.data;
  const output = dst.data;

  // Initialize background to paper white
  for (let i = 0; i < output.length; i += 4) {
    output[i] = 255;
    output[i + 1] = 255;
    output[i + 2] = 255;
    output[i + 3] = 255;
  }

  const strength = clamp(slider, 0, 100) / 100;

  // Parameters mapped from slider
  const spacing = lerp(9.0, 3.5, strength);
  const maxStrokeLength = lerp(12, 32, strength);
  const inkAlpha = lerp(160, 240, strength);

  // Step 1: Compute Darkness Map (0 = White, 1 = Black)
  const darkness = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = input[idx];
      const g = input[idx + 1];
      const b = input[idx + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      darkness[y * width + x] = clamp(1.0 - lum, 0, 1);
    }
  }

  // Step 2: Sobel Gradients
  const gx = new Float32Array(width * height);
  const gy = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p00 = darkness[(y - 1) * width + (x - 1)];
      const p01 = darkness[(y - 1) * width + x];
      const p02 = darkness[(y - 1) * width + (x + 1)];

      const p10 = darkness[y * width + (x - 1)];
      const p12 = darkness[y * width + (x + 1)];

      const p20 = darkness[(y + 1) * width + (x - 1)];
      const p21 = darkness[(y + 1) * width + x];
      const p22 = darkness[(y + 1) * width + (x + 1)];

      gx[y * width + x] = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22;
      gy[y * width + x] = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;
    }
  }

  // Smooth gradients to stabilize vector field in noisy areas
  const sgx = new Float32Array(width * height);
  const sgy = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sumX = 0;
      let sumY = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = (y + dy) * width + (x + dx);
          sumX += gx[idx];
          sumY += gy[idx];
        }
      }
      sgx[y * width + x] = sumX / 9;
      sgy[y * width + x] = sumY / 9;
    }
  }

  // Orientation Field lookup helper
  const defaultAngle = Math.PI * 0.25; // 45 degrees default hatching

  const getOrientation = (x: number, y: number): number => {
    const ix = clamp(Math.round(x), 0, width - 1);
    const iy = clamp(Math.round(y), 0, height - 1);
    const idx = iy * width + ix;

    const dx = sgx[idx];
    const dy = sgy[idx];
    const mag = Math.sqrt(dx * dx + dy * dy);

    if (mag < 0.04) {
      return defaultAngle;
    }

    // Edge angle is perpendicular to gradient angle
    const contourAngle = Math.atan2(dy, dx) + Math.PI * 0.5;
    const blendFactor = clamp(mag / 0.35, 0, 1);

    return lerpAngle(defaultAngle, contourAngle, blendFactor);
  };

  const sampleDarkness = (x: number, y: number): number => {
    const ix = clamp(Math.round(x), 0, width - 1);
    const iy = clamp(Math.round(y), 0, height - 1);
    return darkness[iy * width + ix];
  };

  // Step 3: Render Hatching Layers
  const random = mulberry32(1337);

  // Layer configuration
  const layers = [
    { threshold: 0.1, angleOffset: 0, weight: 1.0 }, // Primary contour layer
    { threshold: 0.35, angleOffset: Math.PI * 0.33, weight: 0.85 }, // Cross-hatch layer 1
    { threshold: 0.62, angleOffset: -Math.PI * 0.25, weight: 0.7 }, // Deep shadow layer 2
  ];

  for (let l = 0; l < layers.length; l++) {
    const layer = layers[l];

    // Skip deeper cross-hatch layers if slider strength is low
    if (l === 1 && strength < 0.08) continue;
    if (l === 2 && strength < 0.35) continue;

    const layerSpacing = l === 0 ? spacing : spacing * (1.0 + l * 0.2);

    for (let y0 = 0; y0 < height; y0 += layerSpacing) {
      for (let x0 = 0; x0 < width; x0 += layerSpacing) {
        // Apply deterministic jitter to seed position
        const seedX = x0 + (random() - 0.5) * layerSpacing * 0.5;
        const seedY = y0 + (random() - 0.5) * layerSpacing * 0.5;

        if (seedX < 0 || seedX >= width || seedY < 0 || seedY >= height) continue;

        const seedDarkness = sampleDarkness(seedX, seedY);
        if (seedDarkness < layer.threshold) continue;

        // Trace streamline forward and backward
        const strokePoints = traceStreamline(
          seedX,
          seedY,
          layer.threshold,
          layer.angleOffset,
          maxStrokeLength,
          width,
          height,
          getOrientation,
          sampleDarkness,
        );

        if (strokePoints.length >= 2) {
          const strokeAlpha = clamp(inkAlpha * layer.weight * (seedDarkness / layer.threshold), 50, 255);
          drawTaperedStroke(output, width, height, strokePoints, strokeAlpha);
        }
      }
    }
  }

  // Final opacity enforcement
  for (let i = 3; i < output.length; i += 4) {
    output[i] = 255;
  }

  return dst;
}

// ============================================================================
// Streamline Tracing
// ============================================================================

interface Point2D {
  x: number;
  y: number;
}

function traceStreamline(
  startX: number,
  startY: number,
  darknessThreshold: number,
  angleOffset: number,
  maxLength: number,
  width: number,
  height: number,
  getOrientation: (x: number, y: number) => number,
  sampleDarkness: (x: number, y: number) => number,
): Point2D[] {
  const stepSize = 1.5;
  const maxSteps = Math.ceil(maxLength / (2 * stepSize));

  const forwardPoints: Point2D[] = [];
  const backwardPoints: Point2D[] = [];

  // Forward direction
  let cx = startX;
  let cy = startY;
  for (let s = 0; s < maxSteps; s++) {
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) break;
    const d = sampleDarkness(cx, cy);
    if (d < darknessThreshold * 0.6) break;

    forwardPoints.push({ x: cx, y: cy });
    const angle = getOrientation(cx, cy) + angleOffset;
    cx += Math.cos(angle) * stepSize;
    cy += Math.sin(angle) * stepSize;
  }

  // Backward direction
  cx = startX;
  cy = startY;
  for (let s = 0; s < maxSteps; s++) {
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) break;
    const d = sampleDarkness(cx, cy);
    if (d < darknessThreshold * 0.6) break;

    if (s > 0) {
      backwardPoints.push({ x: cx, y: cy });
    }
    const angle = getOrientation(cx, cy) + angleOffset;
    cx -= Math.cos(angle) * stepSize;
    cy -= Math.sin(angle) * stepSize;
  }

  backwardPoints.reverse();
  return [...backwardPoints, ...forwardPoints];
}

// ============================================================================
// Stroke Rendering with End Tapering
// ============================================================================

function drawTaperedStroke(
  output: Uint8ClampedArray,
  width: number,
  height: number,
  points: Point2D[],
  baseAlpha: number,
): void {
  const n = points.length;
  if (n < 2) return;

  const inkR = 20;
  const inkG = 20;
  const inkB = 25;

  for (let i = 0; i < n - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const t = i / (n - 1);
    // Taper opacity towards stroke tips (pressure profile)
    const taper = Math.sin(t * Math.PI);
    const alpha = (baseAlpha * taper) / 255;

    if (alpha <= 0.01) continue;

    // Subpixel line sampling
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.ceil(len));

    for (let step = 0; step <= steps; step++) {
      const subT = step / steps;
      const px = Math.round(p1.x + dx * subT);
      const py = Math.round(p1.y + dy * subT);

      if (px < 0 || py < 0 || px >= width || py >= height) continue;

      const idx = (py * width + px) * 4;

      // Alpha compositing ink over background
      output[idx] = Math.round(output[idx] * (1 - alpha) + inkR * alpha);
      output[idx + 1] = Math.round(output[idx + 1] * (1 - alpha) + inkG * alpha);
      output[idx + 2] = Math.round(output[idx + 2] * (1 - alpha) + inkB * alpha);
      output[idx + 3] = 255;
    }
  }
}

// ============================================================================
// Utilities
// ============================================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interpolates smoothly between two angles along the shortest arc.
 */
function lerpAngle(a: number, b: number, t: number): number {
  let diff = (b - a) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return a + diff * t;
}

/**
 * Deterministic PRNG (Mulberry32).
 */
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
