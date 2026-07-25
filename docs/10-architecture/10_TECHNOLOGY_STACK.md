# TECHNOLOGY_STACK

**Document Type:** Informative
**Authority:** Medium
**Version:** 1.0
**Status:** Active

---

# Purpose

This document defines the implementation technologies used by the project.

Unlike `00_ARCHITECTURE.md`, this document may evolve as technologies improve.

Technology changes should preserve the architectural principles defined in `00_ARCHITECTURE.md`.

---

# Design Goals

The selected technology stack must provide:

- a single codebase;
- web-first development;
- native mobile deployment;
- high performance;
- excellent TypeScript support;
- AI-friendly development;
- long-term maintainability;
- be free (MIT or Apache Licence prefered).

---

# Programming Language

## TypeScript

Used for all application source code.

Reasons:

- static typing;
- excellent IDE support;
- strong AI compatibility;
- safer refactoring;
- maintainability.

JavaScript source files should be avoided.

---

# Dependency Management

## pnpm

The project uses pnpm to install and manage JavaScript and TypeScript dependencies.

The `pnpm-lock.yaml` lockfile must be committed so that local development, continuous integration, and production builds use reproducible dependency versions.

Dependency installation and project scripts should be run with pnpm.

---

# Frontend Framework

## Vue 3

The application uses Vue 3.

Mandatory requirements:

- Composition API
- `<script setup>`
- TypeScript

Options API should not be used.

Reasons:

- excellent developer experience;
- lightweight runtime;
- strong TypeScript integration;
- maintainable architecture.

---

# Internationalization

The project uses Vue I18n for localization.

English is the default and currently the only supported language.

All user-visible strings should be retrieved through the localization framework.

Application code should never contain hardcoded user-facing text except during prototyping.

Translation resources should be organized by language and feature.

Directory structure:

```Text
src/
  locales/
    en/
        common.json
        menu.json
        toolbar.json
        layers.json
        dialogs.json
        errors.json
    de/
    fr/
```

---

# State Management

## Pinia

Pinia and pinia-plugin-persistedstate manages application state.

Business logic should remain outside stores whenever practical.

Stores should coordinate state, not implement algorithms.

---

# Build System

## Vite

Responsibilities:

- development server;
- production builds;
- module bundling;
- asset processing.

---

# User Interface

The user interface is built using:

- HTML
- CSS
- Vue Components

No heavy UI component framework should be introduced unless it provides substantial long-term value.

Custom components are preferred.

---

# UI Libraries

## shadcn-vue

The project uses **shadcn-vue** as the foundation for generic user interface components.

The primary goals are:

- accelerate development;
- provide consistent visual appearance;
- improve accessibility;
- reduce maintenance effort.

Only generic UI primitives should be taken from shadcn-vue, such as:

- Button
- Input
- Select
- Checkbox
- Switch
- Slider
- Tabs
- Dialog
- Popover
- Dropdown Menu
- Context Menu
- Tooltip
- Accordion
- Scroll Area
- Separator
- Resizable Panels
- Toast

Application-specific components must always be implemented within the project.

Examples include:

- Image Viewport
- Layer Panel
- Layer List
- Layer Properties
- Operation Toolbar
- Image Inspector
- Histogram
- Crop Tool
- Grid Overlay
- Status Bar

The application should not depend on complex pre-built layouts or dashboard templates provided by external libraries.

UI libraries should provide building blocks, not application architecture.

---

## Lucide Icons

The project uses **Lucide Icons** as the primary icon set.

Reasons:

- lightweight;
- consistent design language;
- actively maintained;
- excellent Vue integration;
- large collection of commonly used icons.

Icons should communicate actions clearly and consistently throughout the application.

Custom icons should only be introduced when no suitable Lucide icon exists.

---

## Tailwind CSS

Used as the primary styling framework for both application-specific components and shadcn-vue components.

Tailwind should be used primarily for:

- layout;
- spacing;
- sizing;
- typography;
- responsive behavior.

Design tokens should remain centralized through CSS Variables.

Tailwind configuration should be kept minimal and aligned with the project's design system.
Tailwind CSS is used for application layout, spacing, typography and general styling.

Utility classes should be preferred for common styling tasks to improve consistency and reduce custom CSS.

## CSS Variables

CSS Variables define the application's design tokens, including:

- colors;
- spacing;
- typography;
- border radius;
- shadows;
- animation durations.

Theme customization should be implemented primarily through CSS Variables.

## Custom CSS

Custom CSS should be written only when utility classes cannot provide a clear or maintainable solution.

Complex selectors and deeply nested rules should be avoided.

## Layout

Application layouts should use modern CSS features:

- Flexbox
- CSS Grid
- Container Queries (where appropriate)

Layouts must adapt gracefully to different screen sizes while preserving usability.

## Component Styling

Reusable UI components should encapsulate their styling whenever practical.

Application-specific components should expose only the styling APIs necessary for customization.

## Responsive Design

Responsive behavior should be implemented using a mobile-first approach.

The interface should reorganize itself to make efficient use of available screen space rather than removing functionality.

## Animations

Animations should be subtle, purposeful and performant.

Animations should improve usability by communicating state changes rather than serving decorative purposes.

Users who prefer reduced motion should receive an accessible experience consistent with platform accessibility settings.

---

# Utility Libraries

## VueUse

The project uses **VueUse** for reusable Composition API utilities.

VueUse should be preferred over custom implementations for common application functionality whenever it improves readability and maintainability.

Typical use cases include:

- keyboard shortcuts;
- mouse interactions;
- window size detection;
- resize observers;
- clipboard access;
- local storage;
- element measurements;
- reactive utilities;
- device capabilities.

Application-specific business logic should never depend on VueUse.

VueUse should remain a convenience layer for user interface and browser integration.

---

## Additional Libraries

Third-party libraries should satisfy the following criteria before being introduced:

- actively maintained;
- widely adopted;
- TypeScript support;
- tree-shakeable;
- compatible with long-term maintenance;
- provide clear value over a custom implementation.

Introducing a dependency requires evaluating its long-term maintenance cost in addition to its immediate development benefits.

Dependencies should simplify the project, not increase its complexity.

---

# Image Rendering

Primary rendering technology:

Canvas 2D API

Future optimizations may include:

- OffscreenCanvas
- ImageBitmap
- Web Workers

The rendering implementation should remain hidden behind the Rendering Engine.

---

# Image Processing

Image processing is implemented using OpenCV WASM library @techstark/opencv-js

---

# Mobile Platform

Native mobile applications are packaged using Capacitor.

The goal is to maximize code sharing between:

- Web
- Progressive Web App
- iOS
- Android

Platform-specific code should be isolated.

---

# Desktop Platform

Primary desktop platform:

Modern web browsers.

Future native desktop packaging may use Tauri.

Electron is not planned.

---

# Testing

Vitest library for unit testing purpose.

Playwright for E2E testing.

Testing should be integrated into continuous integration.

---

# Code Quality

Required tools:

- ESLint
- Prettier

Formatting should be automatic.

Linting errors should be resolved before merging.

---

# Version Control

Git

Hosted on GitHub.

Development workflow uses:

- GitHub Issues
- GitHub Projects
- Pull Requests
- Code Reviews

---

# Documentation

All documentation is stored inside the repository using Markdown.

Documentation evolves together with source code.

Documentation changes are considered part of feature development.

---

# Dependency Policy

Dependencies are introduced only when they provide significant long-term value.

The project should prefer:

- browser standards over external libraries;
- small focused libraries over large frameworks;
- source-available components over opaque abstractions;
- composition over inheritance.

Every dependency increases maintenance cost.

Before introducing a new dependency, consider whether:

- the functionality is already available in the browser;
- it can be implemented with reasonable effort;
- the dependency aligns with the project's architecture and principles.

---

# AI-Assisted Development

Project documentation is intentionally structured to support AI-assisted software development.

AI agents are expected to follow:

- 00_PROJECT_GOVERNANCE.md
- 10_PROJECT_VISION.md
- 20_PROJECT_PRINCIPLES.md
- 30_PROJECT_SCOPE.md
- AGENTS.md

before making architectural or implementation decisions.

---

# Future Technology Changes

Technology choices may evolve over time.

Replacing a framework, library or tool is acceptable provided that:

- architectural principles remain unchanged;
- public behavior remains compatible where practical;
- project principles continue to be respected.

Technology serves the architecture, not the other way around.
