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
 * Converts an image into a classical Pen & Ink drawing featuring long, sweeping,
 * sparse strokes that follow the natural contours of the subject.
 *
 * Architecture:
 *   ImageData -> Darkness Map
 *             -> 5x5 Smooth Orientation Field (Sobel Contours)
 *             -> Long Streamline Integration (Forward & Backward)
 *             -> Distance-Field Tapered Ink Line Rasterization
 */
export function inkHatchingFilter(src: ImageData, slider: number): ImageData {
  const width = src.width;
  const height = src.height;

  const dst = new ImageData(width, height);
  const input = src.data;
  const output = dst.data;

  // Fill canvas with paper white
  for (let i = 0; i < output.length; i += 4) {
    output[i] = 255;
    output[i + 1] = 255;
    output[i + 2] = 255;
    output[i + 3] = 255;
  }

  const sliderVal = clamp(slider, 0, 100);
  const strength = sliderVal / 100;

  // ------------------------------------------------------------
  // 1. Spacing & Length Configuration (Long & Sparse Strokes)
  // ------------------------------------------------------------
  // Spacing: Large values ensure strokes remain distinct and sparse
  const spacing = lerp(32.0, 13.0, strength);
  // Max stroke length: Long sweeping curves (60px to 200px)
  const maxStrokeLength = lerp(70, 210, strength);
  const baseThickness = lerp(1.1, 1.8, strength);

  // ------------------------------------------------------------
  // 2. Darkness Map
  // ------------------------------------------------------------
  const darkness = new Float32Array(width * height);
  for (let i = 0; i < darkness.length; i++) {
    const r = input[i * 4];
    const g = input[i * 4 + 1];
    const b = input[i * 4 + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    darkness[i] = clamp(1.0 - lum, 0, 1);
  }

  // ------------------------------------------------------------
  // 3. Sobel Gradients & 5x5 Vector Field Smoothing
  // ------------------------------------------------------------
  const gx = new Float32Array(width * height);
  const gy = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;

      const p00 = darkness[(y - 1) * width + (x - 1)];
      const p01 = darkness[(y - 1) * width + x];
      const p02 = darkness[(y - 1) * width + (x + 1)];

      const p10 = darkness[y * width + (x - 1)];
      const p12 = darkness[y * width + (x + 1)];

      const p20 = darkness[(y + 1) * width + (x - 1)];
      const p21 = darkness[(y + 1) * width + x];
      const p22 = darkness[(y + 1) * width + (x + 1)];

      gx[idx] = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22;
      gy[idx] = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;
    }
  }

  // 5x5 Box Blur for fluid, continuous stroke curvature
  const sgx = new Float32Array(width * height);
  const sgy = new Float32Array(width * height);
  const edgeMag = new Float32Array(width * height);

  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      let sumX = 0;
      let sumY = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const idx = (y + dy) * width + (x + dx);
          sumX += gx[idx];
          sumY += gy[idx];
        }
      }
      const idx = y * width + x;
      const mx = sumX / 25;
      const my = sumY / 25;
      sgx[idx] = mx;
      sgy[idx] = my;
      edgeMag[idx] = Math.sqrt(mx * mx + my * my);
    }
  }

  // Orientation Field lookup
  const defaultAngle = Math.PI * 0.25; // 45 degrees

  const getOrientation = (x: number, y: number): number => {
    const ix = clamp(Math.round(x), 0, width - 1);
    const iy = clamp(Math.round(y), 0, height - 1);
    const idx = iy * width + ix;

    const dx = sgx[idx];
    const dy = sgy[idx];
    const mag = edgeMag[idx];

    if (mag < 0.02) {
      return defaultAngle;
    }

    const contourAngle = Math.atan2(dy, dx) + Math.PI * 0.5;
    const blend = clamp(mag / 0.25, 0, 1);

    return lerpAngle(defaultAngle, contourAngle, blend);
  };

  const sampleDarkness = (x: number, y: number): number => {
    const ix = clamp(Math.round(x), 0, width - 1);
    const iy = clamp(Math.round(y), 0, height - 1);
    return darkness[iy * width + ix];
  };

  // ------------------------------------------------------------
  // 4. Streamline Hatching Layers
  // ------------------------------------------------------------
  const random = mulberry32(4242);

  const layers = [
    { threshold: 0.12, angleOffset: 0, weight: 1.0 }, // Primary contour layer
    { threshold: 0.42, angleOffset: Math.PI * 0.35, weight: 0.8 }, // Sparse cross-hatch layer
    { threshold: 0.7, angleOffset: -Math.PI * 0.28, weight: 0.65 }, // Deep shadow layer
  ];

  for (let l = 0; l < layers.length; l++) {
    const layer = layers[l];

    if (l === 1 && strength < 0.15) continue;
    if (l === 2 && strength < 0.45) continue;

    const layerSpacing = l === 0 ? spacing : spacing * 1.35;

    for (let y0 = layerSpacing * 0.5; y0 < height; y0 += layerSpacing) {
      for (let x0 = layerSpacing * 0.5; x0 < width; x0 += layerSpacing) {
        // Deterministic PRNG jitter to keep stroke placement natural
        const seedX = x0 + (random() - 0.5) * layerSpacing * 0.6;
        const seedY = y0 + (random() - 0.5) * layerSpacing * 0.6;

        if (seedX < 0 || seedX >= width || seedY < 0 || seedY >= height) continue;

        const d = sampleDarkness(seedX, seedY);
        if (d < layer.threshold) continue;

        // Trace long streamline
        const strokePoints = traceLongStreamline(
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

        if (strokePoints.length >= 3) {
          const strokeThickness = baseThickness * (0.8 + d * 0.6);
          drawSmoothTaperedPolyline(output, width, height, strokePoints, strokeThickness);
        }
      }
    }
  }

  // Enforce alpha channel
  for (let i = 3; i < output.length; i += 4) {
    output[i] = 255;
  }

  return dst;
}

// ============================================================================
// Long Streamline Tracing
// ============================================================================

interface Point2D {
  x: number;
  y: number;
}

function traceLongStreamline(
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
  const stepSize = 1.8;
  const maxSteps = Math.ceil(maxLength / (2 * stepSize));

  const forwardPoints: Point2D[] = [];
  const backwardPoints: Point2D[] = [];

  // Forward Integration
  let cx = startX;
  let cy = startY;
  for (let s = 0; s < maxSteps; s++) {
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) break;
    const d = sampleDarkness(cx, cy);
    if (d < darknessThreshold * 0.5) break;

    forwardPoints.push({ x: cx, y: cy });
    const angle = getOrientation(cx, cy) + angleOffset;
    cx += Math.cos(angle) * stepSize;
    cy += Math.sin(angle) * stepSize;
  }

  // Backward Integration
  cx = startX;
  cy = startY;
  for (let s = 0; s < maxSteps; s++) {
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) break;
    const d = sampleDarkness(cx, cy);
    if (d < darknessThreshold * 0.5) break;

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
// Smooth Polyline Anti-Aliased Rasterizer with Tapering
// ============================================================================

function drawSmoothTaperedPolyline(
  output: Uint8ClampedArray,
  width: number,
  height: number,
  points: Point2D[],
  thickness: number,
): void {
  const n = points.length;
  if (n < 2) return;

  const inkR = 15;
  const inkG = 15;
  const inkB = 20;

  for (let i = 0; i < n - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const t1 = i / (n - 1);
    const t2 = (i + 1) / (n - 1);
    const taper = Math.sin(((t1 + t2) * 0.5) * Math.PI);
    const currentRadius = (thickness * 0.5) * Math.max(0.2, taper);

    // Segment Bounding Box
    const minX = clamp(Math.floor(Math.min(p1.x, p2.x) - currentRadius - 1), 0, width - 1);
    const maxX = clamp(Math.ceil(Math.max(p1.x, p2.x) + currentRadius + 1), 0, width - 1);
    const minY = clamp(Math.floor(Math.min(p1.y, p2.y) - currentRadius - 1), 0, height - 1);
    const maxY = clamp(Math.ceil(Math.max(p1.y, p2.y) + currentRadius + 1), 0, height - 1);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        // Distance from (px, py) to line segment p1-p2
        let segT = 0;
        if (lenSq > 0) {
          segT = clamp(((px - p1.x) * dx + (py - p1.y) * dy) / lenSq, 0, 1);
        }
        const projX = p1.x + segT * dx;
        const projY = p1.y + segT * dy;

        const distSq = (px - projX) * (px - projX) + (py - projY) * (py - projY);
        const dist = Math.sqrt(distSq);

        if (dist > currentRadius + 0.75) continue;

        // Anti-aliased smooth coverage
        const coverage = clamp(1.0 - (dist - (currentRadius - 0.25)), 0, 1);
        const alpha = coverage * 0.95;

        if (alpha <= 0.01) continue;

        const idx = (py * width + px) * 4;
        output[idx] = Math.round(output[idx] * (1 - alpha) + inkR * alpha);
        output[idx + 1] = Math.round(output[idx + 1] * (1 - alpha) + inkG * alpha);
        output[idx + 2] = Math.round(output[idx + 2] * (1 - alpha) + inkB * alpha);
        output[idx + 3] = 255;
      }
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

function lerpAngle(a: number, b: number, t: number): number {
  let diff = (b - a) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return a + diff * t;
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
