# IMAGE ENGINE

**Document Type:** Normative  
**Authority:** High  
**Version:** 2.0  
**Status:** Active

---

# Purpose

The Image Engine is responsible for transforming the current document into a **Render Model**.

It evaluates the document, executes all enabled layers in order, and produces the data required by a consumer such as the screen renderer or the export engine.

The Image Engine is the only subsystem responsible for image processing.

---

# Design Goals

The Image Engine must be:

- deterministic;
- non-destructive;
- simple;
- extensible;
- platform independent;
- high-performance.

The architecture should remain simple while allowing future optimizations without changing public contracts.

---

# Responsibilities

The Image Engine is responsible for:

- evaluating the current document;
- executing enabled layers;
- maintaining the Working Image;
- maintaining the Document Runtime;
- generating Render Models;
- optimizing processing through internal caching.

The Image Engine is **not** responsible for:

- document editing;
- user interaction;
- layer registration;
- rendering to the screen;
- importing or exporting files.

---

# Architecture

```text
                Document Model
                       │
                       ▼
                 Layer Engine
                       │
             Enabled Layer Traversal
                       │
                       ▼
                 Image Engine
                       │
               Render Request
                       │
                       ▼
                 Render Model
```

The Image Engine consumes the document and produces a Render Model.

It does not communicate directly with the Presentation Layer or the Renderer.

---

# Processing Pipeline

The Image Engine processes the document in a deterministic order.

```text
Document

↓

Layer Engine

↓

Layer Traversal

↓

Image Engine

↓

Render Model
```

Each enabled layer receives the output of the previous layer.

The final result becomes the processed image contained in the Render Model.

---

# Layer Execution

The Image Engine does not know how individual layer types work.

Instead, it asks the Layer Engine for layers traversal and executes the processing implementation registered for each layer.

This allows new layer types to be added without modifying the Image Engine itself.

---

# Working Image

The original Source Image is never modified.

Instead, all processing is performed on an internal **Working Image**.

The Working Image may use a reduced resolution depending on the current platform.

For example:

- desktop platforms may process images at higher resolutions;
- mobile devices may process a reduced-resolution copy to improve responsiveness.

The original Source Image is always preserved for future processing and high-quality export.

The Working Image is an internal implementation detail and is never serialized.

---

# Document Runtime

Each opened document has a corresponding **Document Runtime**.

The Document Runtime stores all temporary resources required while the document is open.

Typical runtime data may include:

- Working Image;
- processing cache;
- temporary buffers;
- GPU resources;
- backend-specific objects;
- other transient runtime data.

The exact contents are implementation-specific and may evolve over time.

The Document Runtime belongs exclusively to the Image Engine.

---

# Lifetime

The Document Runtime exists only while a document is open.

```text
Open Document

↓

Create Document Runtime

↓

Render Requests

↓

Close Document

↓

Destroy Document Runtime
```

Destroying a Document Runtime never affects the Document Model.

When the document is opened again, a new runtime is created automatically.

---

# Serialization

The Document Runtime is never serialized.

Only the Document Model represents persistent state.

All runtime resources are recreated after loading a document.

---

# Render Request

The Image Engine generates a Render Model in response to a **Render Request**.

A Render Request describes the intended use of the rendered result.

Initially, the application supports two rendering targets:

- Screen
- Export

Additional rendering targets may be introduced in the future without changing the Image Engine architecture.

The exact structure of a Render Request is implementation-specific.

---

# Render Model

The Render Model is the output of the Image Engine.

It represents everything required by the Renderer to present the current editing session.

The Render Model separates image processing from rendering.

The Renderer consumes the Render Model without requiring knowledge of document structure or image-processing algorithms.

Its exact contents depend on the Render Request.

For screen rendering, the Render Model may include:

- processed image;
- grid;
- guides;
- selection overlays;
- render metadata.

For export, the Render Model typically contains:

- processed image;
- export metadata;
- optional export overlays requested by the user.

---

# Render Model Structure

```text
Render Model

├── Processed Image
├── Render Command List
│     ├── Draw Grid
│     ├── Draw Rule of Thirds
│     ├── Draw Measurement
│     ├── Draw Annotation
│     └── Draw Selection
└── Render Metadata
```

It also allows future commands like DrawBackground, DrawImage, DrawSelection, DrawText, DrawBezier, DrawPath, DrawMask, or plugin-defined commands without redesigning the model.

---

# Internal Caching

The Image Engine may cache intermediate processing results inside the Document Runtime.

Caching is an internal optimization.

The caching strategy is implementation-specific and must never affect rendering correctness.

---

# Error Handling

Processing failures must never modify the Document Model.

Whenever possible, the Image Engine should report processing errors to the Presentation Layer while keeping the current document intact.

---

# Extensibility

The Image Engine is designed to support future extensions without architectural changes.

Examples include:

- additional rendering targets;
- new processing backends;
- GPU acceleration;
- background processing;
- tiled rendering;
- multi-document support.

These capabilities should be introduced through implementation rather than changes to the public architecture.

---

# Relationship with the Layer Engine

The Layer Engine defines **what** layers exist and **in which order** they should be executed.

The Image Engine executes those layers by using Layer Traversal.

The Image Engine never manages layers directly.

---

# Relationship with the Renderer

The Renderer consumes the Render Model produced by the Image Engine.

The Renderer never performs image processing.

---

# Relationship with the Import / Export Engine

The Import / Export Engine requests Render Models intended for export.

The Image Engine determines what data should be included in those models.

The Import / Export Engine never performs image processing itself.

---

# Guiding Principles

The Image Engine transforms a document into a Render Model.

It is the only subsystem responsible for image processing.

The original Source Image is never modified.

All temporary resources belong to the Document Runtime.

Consumers describe **what** they need through a Render Request.

The Image Engine decides **how** to produce the appropriate Render Model.
