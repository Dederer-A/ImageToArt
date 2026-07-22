# ADR-010: Working Image Strategy

**Status:** Accepted

**Date:** 2026-07-22

**Decision Type:** Architecture

---

# Context

The application is designed for interactive analysis of reference images across a wide range of devices, including desktop computers, tablets and smartphones.

Modern cameras frequently produce images exceeding 20–50 megapixels. Processing such images at their native resolution significantly increases:

* memory consumption;
* processing time;
* rendering latency;
* battery usage on mobile devices.

For this application, preserving every original pixel is less important than providing a responsive and fluid user experience.

The project follows a non-destructive editing model, where image operations never permanently modify the source image used by the processing pipeline.

This raises an architectural question:

> **Should the application always process the original imported image, or should it create an optimized internal working representation?**

---

# Decision

The application shall create an immutable **Source Image** during the import process.

The Source Image is the canonical input for the entire image processing pipeline.

Depending on the capabilities of the current device, the Source Image may be optimized during import.

Possible optimizations include:

* orientation normalization;
* color space conversion;
* removal of unnecessary metadata;
* conversion to an efficient internal pixel format;
* resolution reduction to an appropriate working size.

These optimizations are implementation details and must preserve the visual appearance of the imported image within acceptable tolerances.

The Source Image is immutable for the lifetime of the document.

All image operations derive their results from this immutable representation.

The imported file itself is never modified.

---

# Rationale

The application is intended for image analysis rather than professional photo editing.

Artists primarily work with visual information such as:

* composition;
* proportions;
* values;
* edges;
* shapes;
* color relationships.

Maintaining extremely high pixel counts provides little practical value for these tasks while imposing a significant performance cost.

Creating a device-appropriate Source Image provides several advantages:

* lower memory usage;
* faster rendering;
* faster image processing;
* smoother interaction;
* better battery life;
* more predictable performance across devices.

This approach aligns with the project's **Performance First** principle while maintaining non-destructive editing.

---

# Alternatives Considered

## Alternative 1 – Always Process the Imported Image

Advantages:

* maximum image fidelity;
* simplest conceptual model.

Disadvantages:

* excessive memory usage;
* poor performance on mobile devices;
* unnecessary processing of invisible pixels;
* increased battery consumption.

Decision:

Rejected.

---

## Alternative 2 – Create a Mutable Working Copy

Advantages:

* simple implementation.

Disadvantages:

* violates the non-destructive editing model;
* makes undo/redo more complex;
* increases the risk of accidental data modification.

Decision:

Rejected.

---

## Alternative 3 – Device-Optimized Immutable Source Image

Advantages:

* maintains non-destructive processing;
* significantly improves performance;
* reduces memory consumption;
* enables future optimizations.

Disadvantages:

* exported images may not always match the original imported resolution;
* import may require additional preprocessing.

Decision:

Accepted.

---

# Consequences

Positive:

* responsive user interface;
* lower memory usage;
* consistent performance across devices;
* simplified processing pipeline;
* deterministic rendering;
* easier implementation of caching.

Negative:

* maximum export resolution may be limited by the working image resolution;
* changing optimization strategy may require regenerating the Source Image.

---

# Implementation Notes

The application distinguishes between three different image representations.

## Imported File

The file selected by the user.

The application never modifies this file.

---

## Source Image

The immutable internal image representation created during import.

This image serves as the input to the Image Engine.

All image operations are applied to the Source Image.

---

## Rendered Image

The temporary result produced by applying the current layer stack to the Source Image.

Rendered Images are transient and may be regenerated at any time.

---

# Performance Considerations

The optimal Source Image resolution should be determined dynamically based on:

* available memory;
* device capabilities;
* screen resolution;
* expected rendering performance.

The implementation should avoid hard-coded resolution limits whenever practical.

---

# Future Evolution

Future versions may introduce additional optimizations without changing this architectural decision.

Examples include:

* multi-resolution image pyramids;
* tile-based processing;
* progressive image decoding;
* GPU-optimized image representations;
* adaptive working resolutions;
* background preprocessing.

These enhancements should remain transparent to the rest of the application.

---

# Related Documents

* 20_PROJECT_PRINCIPLES.md
* 00_ARCHITECTURE.md
* 30_PERFORMANCE.md
* 50_IMAGE_ENGINE.md
* 20_DOCUMENT_MODEL.md
