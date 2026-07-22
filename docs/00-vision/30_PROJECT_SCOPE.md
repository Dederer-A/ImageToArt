# PROJECT_SCOPE

**Document Type:** Normative
**Authority:** High
**Version:** 1.0
**Status:** Living Document

---

# Purpose

This document defines the functional boundaries of the project.

It specifies what belongs in the application, what is planned for future versions and what is explicitly outside the project's scope.

Unlike PROJECT_VISION and PROJECT_PRINCIPLES, this document is expected to evolve during development.

---

# MVP

The initial release should include:

## Image

* Open image
* Save processed image
* Preserve original image

## View

* Zoom
* Pan
* Fit to screen
* Actual size

## Image Analysis

* Grayscale
* Contrast adjustment
* Brightness adjustment
* Blur
* Edge detection
* Crop
* Grid overlay

## Layer System

* Layer stack
* Enable / Disable layers
* Reorder layers
* Edit layer parameters
* Remove layers

## History

* Undo
* Redo

## Export

* PNG
* JPEG

---

# Planned

Features expected after MVP:

* Perspective grid
* Rule of thirds overlay
* Golden ratio overlay
* Posterization
* Value isolation
* Color isolation
* Multiple grid styles
* Layer presets
* Project files
* Workspace persistence

---

# Future Ideas

Potential future improvements:

* Plugin system
* Cloud synchronization
* Shared presets
* Localization
* Tablet-oriented workspace
* Additional analysis overlays

Items in this section are ideas, not commitments.

---

# Explicitly Out of Scope

The following functionality does not belong to this project:

* Painting tools
* Brushes
* Layers for artistic drawing
* Photo retouching
* RAW development
* AI image generation
* AI image editing
* Face beautification
* Vector graphics editing
* Animation
* Video editing
* PSD editor replacement

---

# Decision Policy

A new feature should normally satisfy all of the following conditions:

* helps artists analyze reference images;
* does not significantly increase application complexity;
* fits the existing architecture;
* follows PROJECT_PRINCIPLES;
* does not violate PROJECT_VISION.

Features that fail these criteria should be rejected or postponed.

---

# Scope Management

Before implementing a feature not listed in this document:

1. Evaluate whether it aligns with PROJECT_VISION.
2. Verify compliance with PROJECT_PRINCIPLES.
3. Update this document if the feature is accepted.
4. Create or update the corresponding specification in the `specs/` directory before implementation begins.
