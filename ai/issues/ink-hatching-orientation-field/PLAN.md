# PLAN

**Issue:** Ink Hatching Filter Rewrite  
**Title:** Implement Long Sparse Streamline Ink Hatching  
**Status:** In Progress  

---

# Problem

The user feedback indicates that dense mechanical patterns look poor ("выглядит ужастно", "ставит слишком плотно"). The desired aesthetic requires long, elegant, continuous ink strokes that are sparser ("длинные штрихи и не размещать их так плотно") and follow the contours of the subject.

---

# Current Behavior

The previous pass produced dense high-frequency lines across the whole image.

---

# Desired Behavior

1. Long, sweeping continuous ink strokes (stroke lengths 50px to 200px) that smoothly follow object contour tangents.
2. Sparser placement (large spacing 12px to 36px) leaving clear paper background between strokes.
3. Smooth vector field integration using 5x5 structure tensor / gradient field smoothing so long strokes curve fluidly without sharp kinks.
4. Tapered pen tip stroke rendering with anti-aliasing (smooth thick lines).
5. Dynamic density control via the slider parameter (lower values = very sparse elegant strokes, higher values = moderately denser hatching).

---

# Design

### Long Sparse Streamline Hatching Algorithm
1. **Luminance & Smooth Orientation Field**:
   - Compute darkness map $D(x, y) = 1 - \text{Luminance}(x, y)$.
   - Compute Sobel gradients $G_x, G_y$.
   - Smooth gradients using a 5x5 gaussian/box kernel into $\bar{G}_x, \bar{G}_y$ for fluid contour flow.
   - Compute contour tangent angle $\phi(x, y) = \operatorname{atan2}(\bar{G}_y, \bar{G}_x) + \pi/2$, smoothly blended with default $45^\circ$ diagonal angle in flat regions.

2. **Sparse Grid Seeding & Streamline Integration**:
   - Grid spacing: large (14px to 36px based on slider).
   - Trace streamlines forward ($+\mathbf{v}$) and backward ($-\mathbf{v}$) using Euler steps up to 60–120 steps ($50\text{px} - 200\text{px}$ long).
   - Terminate stroke tracing if darkness falls below threshold or stroke leaves canvas bounds.

3. **Subpixel Distance-Field Line Rasterization**:
   - Render stroke polylines with variable radius ($1.0\text{px} - 2.2\text{px}$) and smooth distance-based anti-aliasing.
   - Apply tapering profile $\sin(t \cdot \pi)$ along stroke length $t \in [0, 1]$.
   - Composite pure black ink ($15, 15, 20$) onto white paper canvas ($255, 255, 255$).

---

# Implementation Steps

1. Update `PLAN.md`.
2. Rewrite `src/Image/layers/InkHatchingFilter.ts`.
3. Verify build using `npm run build`.
4. Update `SUMMARY.md`.
