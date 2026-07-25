# PROJECT_PRINCIPLES

**Document Type:** Normative
**Authority:** High
**Version:** 1.0
**Status:** Active

---

# Introduction

The following principles define the identity of the project.

Every architectural decision, feature request and implementation should comply with these principles.

When principles conflict, the order in this document defines their priority.

---

# 1. Artist First

Every feature must directly improve the artist's ability to study a reference image.

Features intended primarily for photographers, designers or image manipulation should not be added unless they clearly support artists.

---

# 2. Simplicity First

The application should remain easy to understand without reading documentation.

Prefer fewer, well-designed tools over many configurable ones.

---

# 3. Non-Destructive Editing

The original image content must never be modified by image analysis operations.

The application maintains an immutable source image from which all processing results are derived.

For performance and memory optimization, the application may internally create one or more optimized working representations of the source image (for example, downscaled versions appropriate for the current device).

These internal representations are implementation details and must preserve the visual intent of the original image while enabling efficient processing.

Image analysis operations must never permanently alter the immutable source representation.

---

# 4. Performance First

The application should remain responsive even when processing large images.

Avoid unnecessary recalculations.

Prefer incremental rendering and caching over full recomputation.

---

# 5. Offline First

All core functionality must work without an Internet connection.

Cloud services are optional extensions, never requirements.

---

# 6. Privacy First

User images belong to the user.

Image processing should occur locally whenever possible.

Uploading images to external servers must always be an explicit user decision.

---

# 7. Cross Platform

The same codebase should support:

- Desktop browsers
- Mobile browsers
- Progressive Web App
- iOS
- Android

Platform-specific code should be minimized and isolated in the source code base.

---

# Internationalization

The application shall be designed for internationalization from the beginning.

User-facing text, messages, labels and formatting must be externalized and must not be hardcoded in application logic.

English is the primary development and release language.

Additional languages may be introduced without requiring architectural or application logic changes.

---

# 8. Adaptive User Experience (UX)

The application must provide a consistent and efficient user experience across all supported screen sizes and input methods.

The user interface should adapt to the available screen space while preserving usability, clarity and functionality.

Features should not be removed solely because of a smaller display. Instead, the interface should reorganize itself to make efficient use of the available space.

Layouts may differ between devices, but the underlying functionality and workflows should remain consistent whenever practical.

Advanced controls may be collapsed, grouped or moved into secondary panels on smaller screens, but they should remain accessible.

---

# 9. Predictability

The same operation applied to the same image with identical parameters must always produce the same result.

Application behavior should be deterministic.

---

# 10. Extensibility

New filters, layers and analysis tools should integrate into the existing architecture without requiring significant modifications to existing code.

The architecture should encourage extension rather than modification.

---

# 11. Maintainability

Readable code is preferred over clever code.

Clear architecture is preferred over short implementations.

Documentation is considered part of the product.

---

# 12. Testability

Business logic should be easy to test independently of the user interface.

Every important algorithm should have automated tests.

---

# 13. AI Collaboration

The project is designed to be developed with AI assistance.

Documentation, specifications and architectural decisions must remain clear, structured and understandable for both humans and AI agents.

Development workflow must prioritize explicit documentation over implicit assumptions.
