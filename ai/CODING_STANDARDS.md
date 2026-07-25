# CODING STANDARDS

**Document Type:** Normative  
**Authority:** High  
**Version:** 1.0  
**Status:** Active

---

# Purpose

This document defines the coding standards used throughout the project.

The goal is to keep the codebase consistent, readable, maintainable, and easy to evolve.

Formatting rules are enforced by automated tools and are intentionally not described here.

---

# General Principles

## Keep It Simple

Prefer the simplest solution that satisfies the requirements.

Avoid unnecessary abstractions and clever implementations.

---

## Readability Over Brevity

Code is read far more often than it is written.

Choose names and structures that make intent obvious.

---

## Consistency

Follow existing project conventions.

When multiple valid approaches exist, prefer the one already used in the project.

---

# TypeScript

## Use Strict Mode

The project uses TypeScript in strict mode.

Compiler warnings should be treated as errors.

---

## Avoid `any`

Never use `any` unless there is no practical alternative.

Prefer:

- explicit types;
- generics;
- `unknown`;
- discriminated unions.

---

## Prefer Explicit Types

Public APIs should have explicit type definitions.

Rely on inference primarily for local variables.

---

## Prefer Interfaces for Public Contracts

Use `interface` for public contracts that describe objects.

Use `type` aliases when representing:

- unions;
- intersections;
- mapped types;
- utility types;
- function signatures.

---

# Architecture

## Single Responsibility

Every class, function, and module should have one primary responsibility.

---

## Composition Over Inheritance

Prefer composition whenever possible.

Avoid deep inheritance hierarchies.

---

## Dependency Direction

Dependencies must follow the documented architecture.

Lower-level modules must never depend on higher-level modules.

---

## Prefer Immutable Models

Document models should be treated as immutable.

Functions should return new objects instead of modifying existing ones whenever practical.

---

## Keep Business Logic Out of the UI

Presentation components should contain as little business logic as possible.

Business rules belong to application services and engines.

---

## Keep Models Passive

Models represent data.

They should not contain business logic.

---

# Functions

## Small Functions

Functions should perform one task.

Large functions should be split into smaller ones.

---

## Clear Parameters

Prefer small parameter lists.

Group related values into dedicated objects when appropriate.

---

## Avoid Hidden Side Effects

Functions should clearly communicate what they modify.

Unexpected side effects should be avoided.

---

# Classes

## Small Classes

Classes should have a clearly defined responsibility.

If a class becomes difficult to describe in one sentence, it should probably be split.

---

## Constructor Injection

Dependencies should be provided through constructors or explicit parameters.

Avoid global state.

---

# Naming

## Use Meaningful Names

Names should describe intent.

Avoid abbreviations unless they are universally understood.

---

## Boolean Names

Boolean variables should read naturally.

Examples:

```typescript
isVisible;
hasSelection;
canExport;
supportsWebGPU;
```

---

## Event Handlers

Use descriptive handler names.

Examples:

```typescript
onClick();

onImageLoaded();

onLayerRemoved();
```

---

## Avoid Generic Names

Avoid names such as:

```text
data
value
item
object
manager
helper
utils
misc
```

Choose names that describe the actual responsibility.

---

# Error Handling

Fail early when invalid input is detected.

Error messages should clearly describe the problem.

Never silently ignore errors.

---

# Comments

Write code that explains itself.

Comments should explain:

- why something exists;
- why a decision was made;
- non-obvious behavior.

Comments should not explain what obvious code already expresses.

---

# TODOs

Avoid leaving unfinished work.

When a TODO is necessary, it should describe:

- what remains;
- why it is postponed.

---

# File Organization

One file should contain one primary responsibility.

Avoid excessively large files.

Split code into smaller modules when it improves readability.

---

# Testing

New business logic should be designed to be testable.

Avoid unnecessary coupling to browser APIs.

Separate pure logic from platform-specific code whenever practical.

---

# Performance

Write correct and readable code first.

Optimize only after identifying a measurable performance problem.

Do not sacrifice readability for speculative optimizations.

---

# Final Checklist

Before considering code complete, verify that:

- responsibilities are clearly separated;
- naming is consistent;
- no unnecessary complexity has been introduced;
- the code follows the documented architecture;
- public APIs remain simple and understandable;
- the solution is easy to maintain.
