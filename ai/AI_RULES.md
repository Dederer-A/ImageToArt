# AI RULES

**Document Type:** Normative  
**Authority:** Highest  
**Version:** 1.0  
**Status:** Active

---

# Purpose

This document defines the mandatory rules that every AI assistant must follow while working on this project.

These rules apply to every task unless explicitly overridden by the user.

---

# General Rules

## Follow the Documentation

Project documentation is the primary source of truth.

Before introducing new concepts or modifying existing behavior, consult the relevant documentation.

---

## Respect the Architecture

Do not violate the documented architecture.

Do not bypass subsystem responsibilities.

Do not introduce shortcuts that conflict with established architectural principles.

---

## Keep It Simple

Always prefer the simplest solution that satisfies the requirements.

Avoid unnecessary abstractions, patterns, or optimizations.

---

## Stay Focused

Work only on the requested task.

Avoid unrelated improvements, refactoring, or feature additions unless explicitly requested.

---

# Development Rules

## Design Before Implementation

Implementation must always be preceded by design.

If the solution is unclear, create or update the design before writing code.

---

## Architecture Before Code

If implementation requires architectural changes:

1. Update the architecture documentation.
2. Create or update an ADR if necessary.
3. Only then update the implementation.

---

## Documentation Is Part of the Code

Documentation must remain synchronized with the implementation.

Whenever behavior changes, update the corresponding documentation.

---

## Preserve Existing Behavior

Avoid changing existing behavior unless it is required by the current task.

Backward compatibility should be maintained whenever practical.

---

# Code Quality

## Read Before Writing

Understand the existing code before modifying it.

Reuse existing abstractions whenever appropriate.

---

## Minimize Changes

Prefer small, isolated changes over large rewrites.

Every change should have a clear purpose.

---

## Keep Public APIs Stable

Avoid changing public interfaces without a clear architectural reason.

When changes are necessary, update the corresponding documentation.

---

## Avoid Duplication

Reuse existing functionality whenever possible.

Extract shared logic only when it provides a clear benefit.

---

# Decision Making

When multiple solutions are possible, prefer the one that is:

1. Correct
2. Simple
3. Consistent with the architecture
4. Easy to maintain
5. Easy to extend

Do not optimize prematurely.

---

# Communication

## Be Explicit

Explain important architectural or technical decisions.

State assumptions clearly.

---

## Ask When Unsure

If requirements are ambiguous or incomplete, ask for clarification instead of guessing.

---

## Be Honest

Do not claim work has been completed unless it has actually been completed.

Clearly distinguish facts, assumptions, and recommendations.

---

# Project Structure

Use the project structure as intended.

- `docs/` contains architecture and project documentation.
- `ai/` contains AI instructions and workflows.
- `src/` contains application source code.
- `tests/` contains automated tests.

Do not place files outside their intended locations.

---

# Final Checklist

Before completing any task, verify that:

- the requested work has been completed;
- the solution follows the documented architecture;
- documentation has been updated if necessary;
- no unrelated changes were introduced;
- the solution remains as simple as possible.

---

# Final Rule

When in doubt, choose the solution that makes the project easier to understand, maintain, and evolve.
