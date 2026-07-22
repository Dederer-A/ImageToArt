# IMPORT / EXPORT

**Document Type:** Normative  
**Authority:** High  
**Version:** 2.0  
**Status:** Active

---

# Purpose

The Import / Export subsystem is responsible for exchanging data between the application and external sources.

It converts external files into the application's internal document model and converts the current document into external formats suitable for sharing, printing or future editing.

This subsystem is the only part of the application that understands external file formats.

---

# Design Goals

The Import / Export subsystem must be:

- simple;
- deterministic;
- extensible;
- platform independent;
- non-destructive.

---

# Responsibilities

The Import / Export subsystem is responsible for:

- importing image files;
- loading editing sessions;
- exporting rendered images;
- saving editing sessions;
- validating imported files;
- detecting supported file formats.

It is **not** responsible for:

- image processing;
- rendering;
- document editing;
- user interaction.

---

# Import Types

The application supports two kinds of import.

## Asset Import

Asset Import creates a new document from an external image.

```text
Image File

↓

Decode Image

↓

Create Document

↓

Source Image
```

The imported image becomes the immutable Source Image of the document.

---

## Session Import

Session Import restores a previously saved editing session.

```text
Session File

↓

Deserialize Document

↓

Create Document

↓

Open Session
```

The loaded document is identical to the document that was previously saved.

---

# Export Types

The application supports two kinds of export.

## Image Export

Image Export produces a rendered image suitable for external use.

```text
Document

↓

Render Request (Export)

↓

Image Engine

↓

Render Model

↓

Encode Image

↓

PNG / JPEG / WebP / AVIF
```

The exported image is generated from an **Export Render Request**.

This allows exported images to differ from what is currently displayed on screen.

For example:

- editing guides are excluded;
- selections are excluded;
- export-specific options may be applied.

---

## Session Export

Session Export stores the complete editing session.

```text
Document

↓

Serialize

↓

Session File
```

The exported session can later be reopened without losing editing information.

---

# Supported Formats

## Image Import

Initially supported formats include:

- PNG
- JPEG
- WebP
- AVIF

---

## Image Export

Initially supported formats include:

- PNG
- JPEG
- WebP
- AVIF

---

## Session Format

The application defines its own native session format.

The exact file extension is implementation-specific.

---

# Session File

A session file stores the complete Document Model.

Typical contents include:

- Source Image;
- layers;
- layer settings;
- document metadata;
- UI state;
- application version.

The session file never contains runtime data.

---

# Runtime Data

Runtime objects are recreated every time a document is opened.

Examples include:

- Document Runtime;
- Working Image;
- processing cache;
- temporary buffers;
- GPU resources.

These objects are never serialized.

---

# Versioning

Every session file must contain a format version.

Older versions should be migrated automatically whenever possible.

Migration logic belongs to the Import / Export subsystem.

---

# Validation

Imported files must be validated before use.

Validation should verify:

- supported format;
- file integrity;
- required data;
- version compatibility.

Invalid files must never produce partially initialized documents.

---

# Clipboard Support

The application may support importing images from the system clipboard.

Clipboard images are imported using the same workflow as Asset Import.

Clipboard export may also be supported in the future.

---

# Drag & Drop

Dragging an image into the application performs an Asset Import.

Dragging a session file into the application performs a Session Import.

---

# Extensibility

Support for additional file formats should be introduced without changing the core architecture.

Examples include:

- TIFF;
- HEIF;
- PDF;
- SVG;
- cloud storage providers.

---

# Relationship with the Document Model

Asset Import creates a new Document.

Session Import restores a Document from persistent storage.

Session Export serializes the Document.

The Import / Export subsystem never modifies the document directly after loading.

---

# Relationship with the Image Engine

Image Export requests a Render Model using an **Export Render Request**.

The Image Engine determines what should be rendered for export.

The Import / Export subsystem never performs image processing.

---

# Relationship with the Presentation Layer

The Presentation Layer initiates import and export operations.

All dialogs, progress indicators and user interactions belong to the Presentation Layer.

The Import / Export subsystem performs only the requested conversion.

---

# Guiding Principles

The Import / Export subsystem is the application's boundary with the outside world.

The Document Model is the only persistent representation of an editing session.

Runtime objects are never serialized.

Exported images are always generated from an Export Render Request rather than from the current screen representation.

This guarantees that exported files accurately represent the intended output while remaining independent of the editing interface.

---

# Related Documents

- 00_ARCHITECTURE.md
- 20_DOCUMENT_MODEL.md
- 50_IMAGE_ENGINE.md
- 60_RENDERER.md
- ADR-010-Working-Image-Strategy.md
- ADR-011-Context-Specific-Render-Models.md
