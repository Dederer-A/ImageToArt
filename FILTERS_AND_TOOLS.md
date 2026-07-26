# Image Analysis Filters

## Overview

The purpose of these filters is **not** to enhance photographs, but to help artists analyze a reference image before drawing or painting.

Unlike traditional photo editors, these filters are designed to simplify visual information, reveal value relationships, improve proportion analysis, and reduce distracting details.

---

# Value Analysis

## Black & White

**Status**: Implemented

### Purpose

Removes color information, allowing the artist to focus only on value (light and shadow).

### Why it's useful

One of the biggest mistakes beginners make is paying attention to color instead of tonal relationships.

This filter reveals:

- overall contrast
- shadow shapes
- light direction
- value grouping

### Implementation

Uses a Kodak-inspired virtual color filter.

Features:

- Hue-based response
- Saturation-aware weighting
- Gaussian color influence
- Adjustable virtual filter color

---

## Posterize

**Status**: Implemented

### Purpose

Reduces the number of tonal/color levels.

### Why it's useful

Posterization merges many similar values into larger masses.

This makes it much easier to identify:

- shadow masses
- light masses
- large forms
- dominant shapes

Instead of seeing hundreds of slightly different tones, the artist sees only the important ones.

### Implementation

Each RGB channel is quantized independently.

Slider controls the number of levels.

---

## Contrast

**Status**: Implemented

### Purpose

Increases or decreases value separation.

### Why it's useful

A slight increase in contrast often makes forms much easier to read.

Useful for:

- portraits
- landscape painting
- gesture drawing

---

## Gamma

**Status**: Implemented

### Purpose

Brightens shadows or darkens highlights without significantly affecting the opposite end of the histogram.

### Why it's useful

Useful when reference photos have:

- blocked shadows
- blown highlights
- poor exposure

Allows the artist to inspect hidden detail.

---

# Shape Analysis

## Blur

**Status**: Implemented

### Purpose

Removes fine detail.

### Why it's useful

Artists are taught to "squint" to ignore texture and small details.

Blur simulates this effect.

Useful for seeing:

- large forms
- light direction
- composition
- major value masses

### Implementation

Stack Blur.

---

## Squint

**Status**: Implemented

### Purpose

Simulates looking at the subject with partially closed eyes.

### Why it's useful

This is one of the most common techniques taught in classical drawing and painting.

Compared to simple blur, Squint preserves the most important value relationships while suppressing distracting details.

### Suggested implementation

Combination of:

- Blur
- Contrast
- Posterize

---

## Edge Detection

**Status**: Implemented

### Purpose

Shows only important contours.

### Why it's useful

Helps analyze:

- silhouette
- shape design
- construction
- edge hierarchy

Possible implementations:

- Sobel
- Canny
- Difference of Gaussians

---

# Composition Analysis

## Grid

**Status**: Implemented

### Purpose

Draws a proportional grid over the image.

### Why it's useful

Helps transfer proportions to paper or canvas.

Grid size is defined by the number of columns.

Rows are calculated automatically to preserve square cells.

---

## Rule of Thirds

**Status**: Implemented

### Purpose

Displays a 3×3 composition grid.

### Why it's useful

Helps analyze balance and focal points.

---

## Golden Ratio

**Status**: Implemented

### Purpose

Displays Golden Ratio guides.

### Why it's useful

Useful for studying classical composition.

---

# Color Analysis

## Hue Filter

**Status**: Not Implemented

### Purpose

Simulates classical colored photographic filters.

### Why it's useful

Allows the artist to study how different color families contribute to value.

Useful for:

- portraits
- landscape painting
- atmospheric perspective

### Implementation

RGB

↓

HSV

↓

Hue distance

↓

Gaussian weighting

↓

Luminance modification

↓

Grayscale

---

## Saturation

**Status**: Implemented

### Purpose

Reduces or increases color intensity.

### Why it's useful

Sometimes complete grayscale is unnecessary.

Reducing saturation keeps color relationships while making value easier to judge.

---

## Color Temperature

**Status**: Not Implemented

### Purpose

Shifts image toward warm or cool colors.

### Why it's useful

Helps study warm/cool relationships independently from local color.

---

# Detail Analysis

## Shadow Mask

**Status**: Not Implemented

Displays only shadows.

Useful for studying shadow design.

---

## Midtone Mask

**Status**: Not Implemented

Displays only midtones.

Useful for analyzing transitions.

---

## Highlight Mask

**Status**: Not Implemented

Displays only highlights.

Useful for studying light placement.

---

# Recommended Filter Set (MVP)

The following filters provide the highest value for artists while keeping implementation relatively simple.

| Filter         | Priority | Purpose                         | Status      |
| -------------- | -------- | ------------------------------- | ----------- |
| Black & White  | ★★★★★    | Value analysis                  | Implemented |
| Blur           | ★★★★★    | Remove details                  | Implemented |
| Posterize      | ★★★★★    | Simplify value masses           | Implemented |
| Contrast       | ★★★★★    | Improve readability             | Implemented |
| Gamma          | ★★★★★    | Recover shadow/highlight detail | Implemented |
| Grid           | ★★★★★    | Proportion transfer             | Implemented |
| Squint         | ★★★★★    | Simulate squinting              | Implemented |
| Edge Detection | ★★★★☆    | Shape analysis                  | Implemented |
| Saturation     | ★★★★☆    | Reduce color distraction        | Implemented |
| Rule of Thirds | ★★★☆☆    | Composition                     | Implemented |
| Golden Ratio   | ★★★☆☆    | Composition                     | Implemented |

---

# Future Ideas

Potential future filters:

- Notan (2–3 value composition)
- Plane Detection
- Value Histogram Overlay
- Perspective Grid
- Vanishing Point Detection
- Symmetry Overlay
- Face Proportion Guide
- Gesture Simplification
- Color Harmony Visualization
- Atmospheric Perspective Visualization

These are more advanced features and are not required for the initial MVP.

Reference Line
Angle Tool
Plumb Line
Comparative Measurement
