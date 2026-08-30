# SUMMARY

**Issue:** Ink Hatching Filter Rewrite  
**Title:** Implement Structure-Aware Ink Hatching Filter with Sobel Orientation Field  
**Status:** Completed  

---

# Overview

Rewrote `InkHatchingFilter.ts` from scratch to implement a structure-aware ink hatching filter. The new filter computes a 2D orientation vector field from Sobel gradients, guiding hatching strokes along local contours of the image and smoothly transitioning to clean $45^\circ$ diagonal cross-hatching in flat regions.

---

# Key Changes

- **Sobel Orientation Field**: Computed $G_x$ and $G_y$ gradients, applied a 3x3 box smoothing filter, and derived contour tangent directions ($\phi_\text{contour} = \theta + \pi/2$). Blended smoothly with default $45^\circ$ diagonal hatching based on local gradient magnitude.
- **Streamline Tracing**: Generated curved stroke polylines by stepping forward and backward along local vector field directions from jittered grid seed points.
- **Multi-Layer Adaptive Hatching**:
  - Layer 0 (Primary contour hatching): Activates in light midtones ($D \ge 0.10$).
  - Layer 1 (Cross-hatching): Rotated by $+60^\circ$, activates in shadows ($D \ge 0.35$).
  - Layer 2 (Deep shadow hatching): Rotated by $-45^\circ$, activates in deep shadows ($D \ge 0.62$).
- **Realistic Pen Tapering & Subpixel Rasterization**: Tapered stroke ends with $\sin(t \cdot \pi)$ pressure profiling for realistic hand-drawn pen ink strokes on paper background.

---

# Verification

- Executed `npm run build` (`vue-tsc -b && vite build`) — passed with zero errors.
- Checked diagnostics — 0 errors, 0 warnings.
