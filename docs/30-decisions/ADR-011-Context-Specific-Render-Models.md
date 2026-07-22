# ADR-011: Context-Specific Render Models

**Status:** Accepted

**Date:** 2026-07-22

---

# Context

The Image Engine produces a Render Model consumed by downstream systems.

Initially, the architecture assumed that a single Render Model could be used for both on-screen rendering and image export.

Further architectural analysis revealed that these two use cases have different requirements.

The editing experience requires numerous visual aids that must never become part of exported images.

Examples include:

- checkerboard transparency background;
- selection outlines;
- crop handles;
- measurement tools;
- rulers;
- editor-only annotations.

Conversely, image export may require information that is irrelevant to screen rendering, including:

- full-resolution output;
- embedded color profiles;
- export-specific overlays;
- format-specific rendering options.

A single Render Model cannot satisfy both responsibilities without introducing conditional logic throughout the rendering pipeline.

---

# Decision

The Image Engine shall support generating Render Models for different rendering contexts.

Each Render Model represents the rendering requirements of one specific consumer.

Consumers request the Render Model appropriate for their context.

Examples include:

- Screen Render Model;
- Export Render Model;
- Thumbnail Render Model;
- Print Render Model.

The exact set of supported contexts is implementation-specific.

---

# Motivation

Separating Render Models by context keeps rendering responsibilities explicit and avoids coupling unrelated concerns.

The Image Engine determines **what should be rendered** for a specific context.

Consumers determine **how that Render Model is presented or encoded**.

This keeps export logic independent from the on-screen editing experience.

---

# Screen Render Model

The Screen Render Model is optimized for interactive editing.

It may include editor-specific rendering commands such as:

- transparency checkerboard;
- composition guides;
- grid;
- rulers;
- selection outlines;
- measurement overlays;
- editor annotations.

These elements assist the user during editing but are not part of the document itself.

---

# Export Render Model

The Export Render Model represents the final image intended for external use.

It should exclude editor-specific visual aids.

Typical characteristics include:

- original export resolution;
- final color space;
- embedded color profile;
- optional user-selected guides;
- export-specific rendering options.

The Export Render Model should accurately represent the exported file.

---

# Benefits

This architecture provides several advantages.

## Clear Separation of Responsibilities

Screen rendering and image export become independent workflows.

Neither requires knowledge of the other's requirements.

---

## Reduced Conditional Logic

The Renderer and Import / Export Engine no longer require numerous conditional rules to decide which visual elements should appear.

Each Render Model already represents the correct output for its intended purpose.

---

## Improved Extensibility

Additional rendering contexts can be introduced without changing existing architecture.

Examples include:

- thumbnail generation;
- print preview;
- AI analysis;
- batch processing;
- accessibility views.

---

## Better Performance

Each rendering context generates only the information required for that specific task.

Unnecessary rendering commands are avoided.

---

## Cleaner Public Contracts

Consumers interact only with the Render Model appropriate for their context.

The internal processing pipeline remains independent of presentation-specific requirements.

---

# Consequences

The Image Engine becomes responsible for producing context-specific Render Models.

The Renderer consumes the Screen Render Model.

The Import / Export Engine consumes the Export Render Model.

Future consumers should request Render Models appropriate for their own rendering context rather than reusing an existing one.

---

# Alternatives Considered

## Single Render Model with Conditional Rendering

One Render Model containing all rendering information.

Consumers decide which elements to ignore.

Rejected because rendering decisions become scattered across multiple subsystems and new rendering contexts become increasingly difficult to support.

---

## Export Through the Renderer

Generate exported images by rendering the screen representation.

Rejected because screen rendering prioritizes interactive editing rather than export quality and includes editor-specific visual elements.

---

## Export Directly From the Image Pipeline

Export images directly from the processing pipeline without using a Render Model.

Rejected because it duplicates rendering decisions already performed by the Image Engine and creates separate rendering logic for export.

---

# Related Documents

- 50_IMAGE_ENGINE.md
- 60_RENDERER.md
- 80_IMPORT_EXPORT.md
- 20_DOCUMENT_MODEL.md
