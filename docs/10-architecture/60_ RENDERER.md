# RENDERER

**Document Type:** Normative  
**Authority:** High  
**Version:** 1.0  
**Status:** Active

---

# Purpose

The Renderer is responsible for presenting the current editing session to the user.

It interprets the Render Model produced by the Image Engine and renders it onto the platform's rendering surface.

The Renderer never performs image processing.

---

# Design Goals

The Renderer must be:

- deterministic;
- lightweight;
- platform independent;
- high performance;
- scalable;
- extensible.

---

# Responsibilities

The Renderer is responsible for:

- rendering the Processed Image;
- executing Render Commands;
- applying viewport transformations;
- managing viewport redraws;
- minimizing redraw operations;
- adapting rendering quality to platform capabilities.

The Renderer is not responsible for:

- image processing;
- document management;
- layer management;
- user interaction.

---

# High-Level Architecture

```text
Render Model
        │
        ▼
Renderer
        │
        ▼
Platform Canvas
```

The Renderer depends only on the Render Model.

It has no knowledge of the Document Model or Layer Engine.

---

# Render Model

The Renderer consumes a Render Model produced by the Image Engine.

```text
Render Model

├── Processed Image
├── Render Commands
└── Render Metadata
```

The Render Model completely describes what should appear on the screen.

The Renderer determines only how it is drawn.

---

# Processed Image

The Processed Image is rendered exactly once as the base image.

The Renderer must not modify image pixels.

Image scaling, viewport transformations and interpolation are rendering concerns.

---

# Render Commands

Render Commands describe additional drawing operations.

Typical commands include:

- Draw Background
- Draw Grid
- Draw Rule of Thirds
- Draw Golden Ratio
- Draw Perspective Guide
- Draw Selection
- Draw Measurements
- Draw Annotation
- Set Color
- Draw Line
- Draw Text
- Draw Circle
- ...

The Renderer executes commands sequentially.

Commands do not modify the underlying Processed Image.

This gives several long-term advantages:

* The Image Engine emits a platform-independent rendering description.
* The Renderer becomes a thin interpreter of that description.
* Commands can be cached, replayed, diffed, or even recorded for debugging.
* A future WebGPU renderer could translate the same command stream into GPU draw calls, while a Canvas 2D renderer interprets it directly.

---

# Render Metadata

Render Metadata provides additional information required during rendering.

Typical metadata includes:

- image dimensions;
- visible image bounds;
- crop region;
- transparency information;
- rendering hints.

---

# Viewport

The Renderer maintains the current viewport.

Viewport properties include:

- zoom level;
- pan position;
- visible region.

Viewport changes should not require rebuilding the Render Model.

---

# Coordinate Systems

The Renderer is responsible for transforming coordinates between:

- image coordinates;
- viewport coordinates;
- screen coordinates.

Coordinate transformations must remain transparent to higher-level subsystems.

---

# Rendering Surface

The rendering surface is platform-specific.

Possible implementations include:

- HTML Canvas 2D;
- WebGL;
- WebGPU.

The rendering surface is hidden behind the Renderer abstraction.

---

# Rendering Quality

The Renderer may adapt rendering quality according to:

- zoom level;
- device capabilities;
- available memory;
- rendering backend.

Quality optimizations must never alter document data.

---

# Incremental Rendering

The Renderer should redraw only the regions affected by changes.

Typical examples include:

- viewport movement;
- guide visibility;
- selection changes;
- annotation updates.

Incremental rendering should avoid unnecessary image redraws whenever practical.

---

# Redraw Scheduling

Rendering requests may be coalesced to reduce unnecessary redraws.

The scheduling strategy is implementation-specific.

---

# Threading

The rendering model is implementation-specific.

Rendering may execute:

- synchronously;
- using requestAnimationFrame;
- using OffscreenCanvas;
- using GPU rendering pipelines.

Threading details remain transparent to higher-level subsystems.

---

# Error Handling

Rendering failures should not affect document state.

Recoverable rendering failures should trigger redraw retries whenever practical.

---

# Performance

The Renderer should minimize:

- redraw area;
- state changes;
- GPU resource updates;
- canvas invalidation;
- rendering latency.

Performance optimizations must never affect visual correctness.

---

# Extensibility

New rendering features should be introduced through new Render Commands.

The Renderer should not require modification when new layer types are added.

Only new Render Command implementations may be required.

---

# Relationship with the Image Engine

The Image Engine produces the Render Model.

The Renderer consumes the Render Model.

The Renderer never performs image processing.

---

# Relationship with the Presentation Layer

The Presentation Layer controls:

- viewport;
- user interaction;
- active tools.

The Renderer is responsible only for visual presentation.

---

# Future Evolution

The architecture naturally supports:

- GPU-first rendering;
- tiled rendering;
- high-DPI rendering;
- plugin-defined Render Commands;
- animation;
- debug overlays;
- hardware acceleration.

These capabilities extend the rendering system without changing higher-level architecture.

---

# Guiding Principles

The Renderer interprets a Render Model.

It never interprets documents.

It never interprets layers.

It never performs image processing.

Its only responsibility is presenting the Render Model efficiently and accurately.

---

# Related Documents

- 00_ARCHITECTURE.md
- 20_DOCUMENT_MODEL.md
- 40_LAYER_ENGINE.md
- 50_IMAGE_ENGINE.md
- 70_PRESENTATION_ARCHITECTURE.md
