# AI INDEX

This document serves as the entry point for AI assistants.

Before starting any task, review the documents relevant to the requested work.

---

# Core Documents

Read these documents before working on any task:

- ai/AI_PHILOSOPHY.md
- ai/AI_RULES.md
- ai/CODING_STANDARDS.md
- ai/GIT_WORKFLOW.md

---

# Project Vision

Read when making product decisions:

- docs/00-vision/00_PROJECT_VISION.md
- docs/00-vision/01_PROJECT_PRINCIPLES.md
- docs/00-vision/02_PROJECT_SCOPE.md

---

# Architecture

Read before changing application architecture:

- docs/10-architecture/10_ARCHITECTURE.md
- docs/10-architecture/20_DOCUMENT_MODEL.md
- docs/10-architecture/40_LAYER_ENGINE.md
- docs/10-architecture/50_IMAGE_ENGINE.md
- docs/10-architecture/60_RENDERER.md
- docs/10-architecture/70_PRESENTATION_ARCHITECTURE.md
- docs/10-architecture/80_IMPORT_EXPORT.md

---

# Technology

Read before introducing libraries or changing implementation:

- docs/10-architecture/11_TECHNOLOGY_STACK.md

---

# Performance

Read before implementing image processing:

- docs/10-architecture/15_PERFORMANCE.md

---

# ADRs

Read when architectural decisions are involved:

- docs/30-decisions/*

---

# Workflows

If you modify Image Engine:

    Read:
        docs/10-architecture/20_DOCUMENT_MODEL.md
        docs/10-architecture/50_IMAGE_ENGINE.md

If you modify rendering:

    Read:
        docs/10-architecture/50_IMAGE_ENGINE.md
        docs/10-architecture/60_RENDERER.md

If you modify document serialization:

    Read:
        docs/10-architecture/20_DOCUMENT_MODEL.md
        docs/10-architecture/80_IMPORT_EXPORT.md

If you introduce a new renderer layer (like blur, sepia, levels, etc.):

    Read:
        docs/10-architecture/20_DOCUMENT_MODEL.md
        docs/10-architecture/40_LAYER_ENGINE.md
        docs/10-architecture/50_IMAGE_ENGINE.md

If you modify UI:

    Read:
        docs/10-architecture/70_PRESENTATION_ARCHITECTURE.md
