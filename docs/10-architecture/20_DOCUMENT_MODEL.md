# DOCUMENT MODEL

**Document Type:** Normative  
**Authority:** High  
**Version:** 1.0  
**Status:** Active

---

# Purpose

This document defines the logical data model of an editing session.

The Document Model is the canonical representation of all document-specific data.

It is independent of the user interface, image processing implementation, rendering technology and platform.

The Document Model contains only data required to restore an editing session.

---

# Design Goals

The Document Model must be:

- deterministic;
- non-destructive;
- serializable;
- implementation independent;
- platform independent;
- extensible;
- versionable.

The model should remain stable even as the application evolves.

---

# Guiding Principles

The Document Model stores **state**, not **behavior**.

It describes:

- what exists;
- how it is configured;
- how objects relate to one another.

It never describes how objects are processed or presented.

---

# Overview

A Document represents one editing session.

It consists of:

- Source Image;
- Layer List;
- View State;
- Metadata;
- History.

Together these objects completely describe the editing session.

---

# High-Level Structure

```text
Document
│
├── Source Image
├── Layer List
├── View State
├── Metadata
└── History
```

---

# Source Image

The Source Image is the immutable internal representation created during image import.

The Source Image is the input of the image-processing pipeline.

It may differ from the imported file due to implementation-specific optimizations including:

- orientation normalization;
- color-space conversion;
- metadata removal;
- resolution optimization;
- internal pixel format conversion.

Once created, the Source Image never changes.

---

# Layer List

The Layer List defines the ordered sequence of layer instances applied to the Source Image.

Layers are evaluated sequentially.

Changing layer order changes the resulting image.

Layers may be:

- enabled;
- disabled;
- reordered;
- configured;
- removed.

The Layer List itself contains no processing logic.

---

# Layer

A Layer represents one configured instance of a layer type.

Each Layer contains only instance-specific information.

Typical fields include:

- identifier;
- layer type identifier;
- enabled state;
- parameter values.

Example:

```json
{
    "id": "layer-42",
    "type": "contrast",
    "enabled": true,
    "parameters": {
        "amount": 35
    }
}
```

A Layer does not contain:

- processing code;
- validation logic;
- icons;
- localized names;
- UI editors;
- categories;
- default values.

These are provided by the Layer Registry.

---

# Layer Type

The `type` field uniquely identifies the corresponding Layer Definition registered within the application.

Example identifiers:

- grayscale
- contrast
- blur
- crop
- grid
- edge-detection

Layer type identifiers should remain stable across application versions.

---

# View State

View State stores document-specific presentation state required to restore the editing session.

Typical information includes:

- zoom;
- viewport position;
- selected layer;
- active tool;
- visible overlays;
- expanded editors.

View State does not influence image processing or exported output.

---

# Metadata

Metadata describes the document itself.

Typical fields include:

- document version;
- creation timestamp;
- modification timestamp;
- application version;
- imported file information.

Metadata never affects image rendering.

---

# History

History records recent editing actions performed by the user.

Its primary purpose is to support Undo and Redo operations and to preserve editing continuity when reopening a document.

History persistence is optional but recommended.

To balance usability, memory consumption and document size, implementations may limit the number of persisted history entries.

Older history entries may be discarded without affecting the current document state.

When a document is reopened, any preserved history entries should be restored so the user can continue working with recent Undo and Redo operations.

The maximum number of persisted history entries is implementation-defined and may vary between platforms or application versions.

Failure to restore History must never prevent a document from opening successfully.

---

# Identity

Every major document object shall have a stable unique identifier.

Identifiers remain unchanged throughout the lifetime of the document.

---

# Immutability

The following objects are immutable:

- Source Image
- Object identifiers

All other document objects evolve through explicit user actions.

---

# Derived Data

The Document Model shall not contain cached or derived data.

Examples include:

- rendered images;
- thumbnails;
- intermediate processing results;
- image caches;
- GPU resources;
- temporary buffers.

Derived data belongs to runtime subsystems.

---

# Document State

The Document stores document-specific state.

Examples include:

- layer ordering;
- layer parameters;
- selected layer;
- viewport position;
- guide visibility.

---

# Application State

Application-wide preferences are intentionally excluded from the Document Model.

Examples include:

- application language;
- UI theme;
- recent files;
- window position;
- global settings;
- keyboard shortcuts.

These belong to the Application Configuration subsystem.

---

# Serialization

The Document Model shall be fully serializable.

Serialization should preserve:

- Source Image;
- Layer List;
- View State;
- Metadata;
- History.

Serialization should not depend on runtime implementation details.

---

# Versioning

Documents should contain a format version.

Future versions of the application should migrate older document versions whenever practical.

---

# Extensibility

The Document Model is designed to support future capabilities without structural redesign.

Potential future additions include:

- annotations;
- bookmarks;
- measurements;
- multiple source images;
- custom guides;
- collaborative editing.

---

# Layer Access

The Document owns the Layer List.

The internal representation of the Layer List is intentionally hidden from other subsystems.

Consumers should not directly traverse, inspect or manipulate the Layer List.

Instead, all access to document layers should be performed through the Layer Engine.

The Layer Engine provides a stable abstraction over the document structure and is responsible for exposing layers in forms appropriate for different consumers.

Typical examples include:

- execution traversal for the Image Engine;
- presentation traversal for the Presentation Layer;
- serialization traversal for Import/Export;
- validation traversal for document validation.

This abstraction allows the internal organization of layers to evolve without affecting dependent subsystems.

Future document structures may include:

- folders;
- nested folders;
- smart collections;
- conditional layers;
- plugin-defined containers.

Such structural changes should remain transparent to consumers of the Layer Engine.

---

# Relationship with the Layer Engine

The Document Model stores only Layer instances.

Definitions of layer types are provided by the Layer Engine.

The Document Model is unaware of:

- processors;
- validators;
- property editors;
- icons;
- categories;
- plugin implementations.

---

# Guiding Principle

The Document Model represents **what the editing session contains**, never **how the application works**.

---

# Related Documents

- 00_ARCHITECTURE.md
- 40_LAYER_ENGINE.md
- 50_IMAGE_ENGINE.md
- 60_RENDERER.md
- ADR-001-Working-Image-Strategy.md
