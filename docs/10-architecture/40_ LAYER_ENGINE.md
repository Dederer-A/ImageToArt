# LAYER ENGINE

**Document Type:** Normative  
**Authority:** High  
**Version:** 1.0  
**Status:** Active

---

# Purpose

The Layer Engine manages all layer types available to the application and the collection of layer instances contained within a document.

It provides the metadata required by the Presentation Layer, the executable implementations required by the Image Engine, and the lifecycle management required by the Document Model.

The Layer Engine does **not** perform image processing.

Image processing is delegated to the Image Engine.

---

# Design Goals

The Layer Engine must be:

- deterministic;
- extensible;
- implementation independent;
- plugin-friendly;
- platform independent;
- non-destructive.

---

# Architectural Overview

The Layer Engine separates document data from application metadata and executable behavior.

```text
                     Layer Engine

                    Layer Registry
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
Layer Definition                  Layer Implementation
        ▲                                     ▲
        │                                     │
        └──────────────┬──────────────────────┘
                       │
                 Layer Instance
                   (Document)
```

This separation allows the document format to remain lightweight while the application remains highly extensible.

---

# Responsibilities

The Layer Engine is responsible for:

- registering available layer types;
- managing the Layer Registry;
- creating and deleting layer instances;
- validating layer configuration;
- exposing metadata to the Presentation Layer;
- exposing implementations to the Image Engine;
- maintaining layer ordering;
- serializing layer instances.

---

# Layer Registry

The Layer Registry maintains every available layer type.

Each layer type is registered exactly once.

The registry provides lookup services for:

- Presentation Layer;
- Image Engine;
- Import/Export;
- future plugins.

The registration mechanism is implementation-specific.

---

# Layer Instance

A Layer Instance represents one configured occurrence of a layer inside a document.

A Layer Instance contains only document-specific data.

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

Layer Instances are fully serializable.

They never contain executable logic.

---

# Layer Definition

A Layer Definition describes a layer type.

It contains only static metadata shared by every instance of that layer.

Typical fields include:

- unique type identifier;
- localized display name;
- category identifier;
- icon;
- description;
- parameter schema;
- default parameter values;
- serialization version.

Layer Definitions contain no executable code.

They may be inspected without loading image-processing modules.

---

# Layer Implementation

A Layer Implementation provides the executable behavior associated with a Layer Definition.

Typical components include:

- processor;
- validator;
- property editor;
- migration provider;
- capability description.

A Layer Implementation is a runtime object.

It is never serialized as part of a document.

Multiple implementations may exist for the same Layer Definition.

Examples include:

- CPU implementation;
- WebGL implementation;
- WebGPU implementation.

The selection of the appropriate implementation is implementation-specific.

---

# Benefits of the Separation

Separating Layer Instances, Layer Definitions and Layer Implementations provides several architectural benefits.

## Lightweight Documents

Documents contain only instance data.

Metadata and executable code are never serialized.

---

## Stable File Format

Documents remain compatible even if implementations evolve internally.

---

## Extensibility

New layer types can be introduced through registration without modifying existing application code.

---

## Multiple Execution Backends

Different implementations may coexist for different hardware capabilities.

Examples include CPU, WebGL and WebGPU processors.

---

## Lazy Loading

Executable implementations may be loaded only when required.

Metadata remains available immediately.

---

## Independent Evolution

Metadata, executable behavior and document structure may evolve independently while maintaining compatibility.

---

# Layer Categories

Layer Definitions belong to logical categories.

Examples include:

- Image Adjustments;
- Image Filters;
- Geometric Operations;
- Visual Guides.

Categories organize the user interface.

They do not influence image processing.

Category identifiers should remain extensible to support plugins and future application features.

---

# Layer Ordering

Layer Instances are stored in the Layer List owned by the Document Model.

Their order determines the image-processing sequence.

Disabled layers remain part of the document but are skipped during processing.

---

# Validation

Every Layer Definition provides validation through its associated Layer Implementation.

Validation should occur whenever:

- a layer is created;
- parameters change;
- a document is loaded.

Invalid configurations should be rejected before image processing begins.

---

# Relationship with the Document Model

The Document Model owns Layer Instances.

The Layer Engine owns Layer Definitions and Layer Implementations.

---

# Relationship with the Presentation Layer

The Presentation Layer obtains metadata from Layer Definitions.

Examples include:

- localized names;
- icons;
- descriptions;
- parameter schemas.

Property editing behavior is provided through Layer Implementations.

The Presentation Layer should never hardcode knowledge about individual layer types.

---

# Relationship with the Image Engine

The Image Engine requests Layer Implementations from the Layer Registry.

It executes processors supplied by those implementations.

The Image Engine does not contain hardcoded knowledge of specific layer types.

---

# Serialization

Only Layer Instances are serialized as part of a document.

Layer Definitions and Layer Implementations are application resources and must never be serialized.

Documents reference layer types using stable layer type identifiers.

---

# Layer Traversal

The Layer Engine provides traversal services over the document's layer structure.

Traversal exposes the logical execution sequence without exposing the internal representation of the document.

Consumers of the Layer Engine should not directly inspect the Layer List or make assumptions about its structure.

The traversal mechanism allows the Layer Engine to evolve independently of the Image Engine.

Future document structures may include:

- folders;
- nested folders;
- conditional layers;
- smart collections;
- plugin-defined containers.

These structures must remain transparent to consumers of the traversal API.

The traversal interface is implementation-specific.

---

# Future Evolution

The registration model naturally supports future capabilities, including:

- plugin-provided layer types;
- user-defined presets;
- custom categories;
- alternative processing backends;
- AI-powered layers;
- procedural layers.

These capabilities extend the existing architecture without changing the Document Model.

---

# Guiding Principles

A Layer Instance represents **document state**.

A Layer Definition represents **application metadata**.

A Layer Implementation represents **runtime behavior**.

The Layer Engine manages the relationships between these concepts while remaining independent of image processing.

---

# Related Documents

- 00_ARCHITECTURE.md
- 20_DOCUMENT_MODEL.md
- 50_IMAGE_ENGINE.md
- 60_RENDERER.md
- 70_PRESENTATION_ARCHITECTURE.md
- 80_IMPORT_EXPORT.md
- ADR-001-Working-Image-Strategy.md
