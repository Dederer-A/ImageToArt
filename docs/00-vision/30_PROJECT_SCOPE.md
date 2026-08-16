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

- Open image
- Save processed image
- Preserve original image

## View

- Fit to screen

## Image Analysis

- Grayscale
- Contrast adjustment
- Brightness adjustment
- Blur
- Edge detection
- Grid overlay

## Layer System

- Predefined Layer stack
- Enable / Disable layers
- Edit layer parameters

## Export

- JPEG

---

# Planned

Features expected after MVP:

- Perspective grid
- Rule of thirds overlay
- Golden ratio overlay
- Posterization
- Value isolation
- Color isolation
- Multiple grid styles
- Project files
- Workspace persistence

---

# Future Ideas

Potential future improvements:

- Plugin system
- Tablet-oriented workspace
- Additional analysis overlays

Items in this section are ideas, not commitments.

---

# Explicitly Out of Scope

The following functionality does not belong to this project:

- Painting tools
- Brushes
- Layers for artistic drawing
- Photo retouching
- RAW development
- Face beautification
- Vector graphics editing
- Animation
- Video editing
- PSD editor replacement

---

# Scope Management

Before implementing a feature not listed in this document:

1. Evaluate whether it aligns with PROJECT_VISION
2. Verify compliance with PROJECT_PRINCIPLES
3. Update this document if the feature is accepted
4. Create or update the corresponding specification in the `specs/` directory before implementation begins
