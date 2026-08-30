# PLAN

**Issue:** Ink Hatching Filter Rewrite  
**Title:** Implement Structure-Aware Ink Hatching Filter with Sobel Orientation Field  
**Status:** In Progress  

---

# Problem

The current implementation of `InkHatchingFilter.ts` fails to produce realistic ink drawings. Its hatching lines lie in fixed global directions as a mechanical grid overlay across the photo instead of hugging object contours and visual forms.

---

# Current Behavior

`InkHatchingFilter.ts` generates static parallel line segments across the image canvas regardless of underlying image features and contours, resulting in an unnatural and flat mechanical appearance.

---

# Desired Behavior

The Ink Hatching filter should:
1. Compute a 2D orientation field using Sobel gradients to detect local edge and contour tangents.
2. Direct hatch strokes along contour tangents so they naturally "hug" the forms of objects in the reference image.
3. Smoothly blend direction in flat areas toward a default diagonal hatching angle ($45^\circ$).
4. Apply multi-layer cross-hatching in progressively darker tonal regions (midtones, shadows, deep shadows).
5. Taper stroke endpoints to simulate realistic hand-drawn pen ink pressure on paper.
6. Execute deterministically with high performance on CPU ImageData buffers.

---

# Affected Components

- `src/Image/layers/InkHatchingFilter.ts`

---

# Design

### Architectural Principles
- Implements `LayerEngine` contract for `InkHatchingLayer`.
- Pure deterministic processing function `inkHatchingFilter(src: ImageData, slider: number): ImageData`.
- Non-destructive (returns new `ImageData`).
- No external runtime dependencies.

### Algorithm Breakdown
1. **Luminance & Darkness Map**:
   Compute perceptual luminance $L = 0.2126R + 0.7152G + 0.0722B$ normalized to $[0, 1]$. Darkness $D = 1 - L$.

2. **Sobel Gradient & Orientation Field**:
   - Compute $G_x$ and $G_y$ gradients using Sobel kernels.
   - Apply a 3x3 box blur to $G_x$ and $G_y$ to eliminate noise.
   - Calculate magnitude $M = \sqrt{\bar{G}_x^2 + \bar{G}_y^2}$ and edge angle $\theta = \operatorname{atan2}(\bar{G}_y, \bar{G}_x)$.
   - Contour tangent angle $\phi_\text{contour} = \theta + \pi/2$.
   - Interpolate direction between default angle ($45^\circ$) and contour angle based on normalized gradient magnitude.

3. **Multi-layer Streamline Hatching**:
   - Layer 0 (Primary Hatching): Follows orientation field $\phi(x,y)$. Activates in midtones ($D \ge 0.12$).
   - Layer 1 (Cross Hatching): Rotated by $+60^\circ$. Activates in shadows ($D \ge 0.38$).
   - Layer 2 (Deep Shadow Hatching): Rotated by $-45^\circ$. Activates in deep shadows ($D \ge 0.65$).
   - Streamline integration: Trace curve steps along local vector field $\mathbf{v} = (\cos\phi, \sin\phi)$ from grid seed points with jitter.

4. **Ink Stroke Rasterization**:
   - Subpixel line rasterization with stroke tip tapering (pressure simulation).
   - Alpha compositing dark ink over white paper background.

---

# Implementation Steps

1. Create `ai/issues/ink-hatching-orientation-field/PLAN.md` and `SUMMARY.md`.
2. Rewrite `src/Image/layers/InkHatchingFilter.ts`.
3. Verify TypeScript build (`npm run build`).
4. Perform self-review and document updates.

---

# Risks

- High computation cost on huge images: mitigated by adaptive step sizes, fast typed array lookups, and streamline bounds.

---

# Documentation Updates

- Update `ai/issues/ink-hatching-orientation-field/SUMMARY.md` upon completion.

---

# Testing

- Run `npm run build` (`vue-tsc -b && vite build`) to confirm zero type errors and clean compilation.
