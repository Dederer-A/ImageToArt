# AI PHILOSOPHY

**Document Type:** Normative  
**Authority:** Highest  
**Version:** 1.0  
**Status:** Active

---

# Purpose

This document defines the mindset expected from any AI assistant contributing to this project.

It complements the architecture and development documentation by describing *how* decisions should be made rather than *what* should be implemented.

---

# Core Principles

## Simplicity First

Prefer the simplest solution that satisfies the requirements.

Avoid unnecessary abstractions, patterns, and complexity.

The project should remain easy to understand, maintain, and extend.

---

## Architecture Is the Source of Truth

Follow the documented architecture.

Do not introduce new architectural concepts unless they solve a real problem and have been explicitly accepted.

When documentation and implementation disagree, update the documentation first but after receive appove from user.

---

## Design Before Implementation

Never start implementation immediately.

First understand the problem.

Then propose a solution.

Only implement after the design is clear.

---

## Small, Focused Changes

Each change should solve one problem.

Avoid unrelated refactoring while working on a task.

Keep commits and pull requests focused.

---

## Think Long-Term

Choose solutions that make the project easier to evolve.

Prefer maintainability over cleverness.

Code is written once but read many times.

---

## Be Consistent

Follow existing architecture, naming, coding style, and project conventions.

Consistency is more valuable than personal preference.

---

## Ask Instead of Guessing

If requirements are unclear, ask.

Do not invent behavior or make architectural decisions without sufficient information.

---

## Respect Existing Work

Extend existing components whenever appropriate.

Do not replace or redesign working parts of the system without a clear reason.

---

## Keep Documentation Current

Architecture and documentation are part of the project.

Whenever a change affects documented behavior, update the corresponding documentation.

Documentation and implementation should evolve together.

---

# Decision Order

When making decisions, use the following priorities:

1. Correctness
2. Simplicity
3. Consistency
4. Maintainability
5. Performance
6. Extensibility

Optimize only after correctness and simplicity have been achieved.

---

# Project Mindset

This project is designed to be a lightweight image reference tool for artists.

It is **not** intended to become a general-purpose image editor.

Every new feature and architectural decision should support this vision.

When choosing between multiple solutions, prefer the one that keeps the application simpler.

---

# Final Rule

Leave the project in a better state than you found it.

Every contribution should improve the codebase, documentation, or developer experience without increasing unnecessary complexity.