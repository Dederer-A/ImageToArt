# ARCHITECTURE

**Document Type:** Normative  
**Authority:** Highest  
**Version:** 2.0  
**Status:** Active

---

# Purpose

This document provides a high-level overview of the application's architecture.

It introduces the major architectural building blocks, explains how they interact, and defines the boundaries between subsystems.

Detailed implementation responsibilities are described in dedicated architecture documents referenced throughout this document.

---

# Architectural Vision

The application is designed as a collection of loosely coupled subsystems with clearly defined responsibilities.

Each subsystem owns a single concern and communicates with other subsystems only through stable public contracts.

The architecture emphasizes:

- simplicity;
- extensibility;
- non-destructive editing;
- deterministic processing;
- platform independence;
- testability;
- long-term maintainability.

---

# Architectural Principles

The architecture follows several fundamental principles.

## Separation of Responsibilities

Every subsystem owns exactly one primary responsibility.

Responsibilities must never overlap.

---

## Non-Destructive Editing

The Source Image is immutable.

All editing operations are represented by document state rather than direct pixel modifications.

---

## Data-Oriented Document Model

The Document Model stores data only.

Business logic belongs to application services and engines.

---

## Runtime Separation

Persistent state and runtime state are intentionally separated.

Persistent state is represented by the Document Model.

Runtime resources belong to the corresponding runtime subsystem.

---

## Consumer-Oriented Models

Subsystems exchange specialized models instead of exposing internal implementation details.

Each consumer receives only the information required for its responsibility.

Examples include:

- Document Model
- Render Model
- Render Request

---

## Extensibility

The application should evolve through registration rather than modification.

Adding new functionality should require minimal changes to existing code.

---

# High-Level Architecture

```text
                         User
                           │
                           ▼
                Presentation Layer
                           │
                           ▼
                   Document Model
                           │
                           ▼
                     Layer Engine
                           │
                 Execution Traversal
                           │
                           ▼
                    Image Engine
                           │
                    Render Request
                           │
                           ▼
                    Render Model
                           │
                           ▼
                      Renderer
                           │
                           ▼
                    Platform Canvas
```

The architecture intentionally separates editing, processing and rendering into independent subsystems.

---

# Major Subsystems

## Presentation Layer

Responsible for:

- user interaction;
- application workflow;
- viewport management;
- commands;
- dialogs;
- application state.

See:

- **70_PRESENTATION_ARCHITECTURE.md**

---

## Document Model

Represents a complete editing session.

Contains only persistent document data.

The Document Model never contains business logic.

See:

- **20_DOCUMENT_MODEL.md**

---

## Layer Engine

Owns the application's layer system.

Responsible for:

- layer registration;
- layer definitions;
- layer implementations;
- execution traversal.

The Layer Engine never performs image processing.

See:

- **40_LAYER_ENGINE.md**

---

## Image Engine

Transforms document state into context-specific Render Models.

Responsible for:

- processing pipeline;
- Working Image;
- Document Runtime;
- runtime resources;
- processing implementations.

See:

- **50_IMAGE_ENGINE.md**

---

## Renderer

Interprets Screen Render Models and presents them to the user.

Responsible for:

- viewport rendering;
- render command execution;
- coordinate transformations;
- platform rendering.

The Renderer never performs image processing.

See:

- **60_RENDERER.md**

---

## Import / Export Engine

Represents the application's boundary with external systems.

Responsible for:

- asset import;
- session import;
- image export;
- session export;
- clipboard integration;
- external file formats.

See:

- **80_IMPORT_EXPORT.md**

---

# Data Flow

Editing follows a deterministic pipeline.

```text
User Input

↓

Presentation Layer

↓

Document Model

↓

Layer Engine

↓

Image Engine

↓

Render Model

↓

Renderer

↓

Display
```

Only the Presentation Layer modifies the Document Model.

Only the Image Engine modifies image pixels.

Only the Renderer draws to the screen.

---

# Core Models

The architecture intentionally separates persistent, runtime and consumer-specific models.

## Document Model

Represents persistent editing data.

Serializable.

---

## Document Runtime

Represents runtime processing resources.

Not serializable.

Managed by the Image Engine.

---

## Render Request

Represents a rendering request for a particular consumer.

Typical information includes:

- rendering context;
- viewport;
- export options;
- rendering quality.

Render Requests are transient runtime objects.

---

## Render Model

Represents everything required by a specific rendering consumer.

Different rendering contexts produce different Render Models.

Examples include:

- Screen Render Model;
- Export Render Model;
- Thumbnail Render Model;
- Print Render Model.

Render Models are transient.

They are never serialized.

---

# Rendering Contexts

Rendering is context dependent.

Consumers request Render Models appropriate for their responsibilities.

Examples include:

| Context     | Consumer                     |
| ----------- | ---------------------------- |
| Screen      | Renderer                     |
| Export      | Import / Export Engine       |
| Thumbnail   | Thumbnail Generator (future) |
| Print       | Print Engine (future)        |
| AI Analysis | AI Engine (future)           |

The Image Engine determines what should be rendered.

Consumers determine how the Render Model is used.

---

# Runtime Ownership

Runtime resources are owned by the subsystem that creates them.

| Runtime Object   | Owner              |
| ---------------- | ------------------ |
| Document Runtime | Image Engine       |
| Working Image    | Image Engine       |
| Pipeline Cache   | Image Engine       |
| Render Model     | Image Engine       |
| Viewport         | Presentation Layer |

Ownership must remain explicit throughout the architecture.

---

# Dependency Rules

Subsystems communicate only through public contracts.

The following dependency directions are permitted.

```text
Presentation Layer

↓

Document Model

↓

Layer Engine

↓

Image Engine

↓

Renderer
```

Reverse dependencies are prohibited.

Subsystems should never depend on implementation details owned by another subsystem.

---

# Extensibility

The architecture supports extension through registration.

Examples include:

- new layer types;
- new processing implementations;
- new rendering contexts;
- new render commands;
- new import/export formats;
- plugins.

Existing subsystems should require little or no modification when new capabilities are introduced.

---

# Related Documents

## Core Architecture

- 20_DOCUMENT_MODEL.md
- 40_LAYER_ENGINE.md
- 50_IMAGE_ENGINE.md
- 60_RENDERER.md
- 70_PRESENTATION_ARCHITECTURE.md
- 80_IMPORT_EXPORT.md

## Performance

- 15_PERFORMANCE.md

## Architectural Decisions

- ADR-010-Working-Image-Strategy.md
- ADR-011-Context-Specific-Render-Models.md
