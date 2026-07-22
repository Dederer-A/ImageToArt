# AGENTS.md

# ImageToArt AI Contributor Guide

Welcome to the ImageToArt project.

This repository is **documentation-driven**.

Architecture decisions are made in documentation first.
Implementation follows documentation.

If documentation and implementation diverge, update the documentation first or ask for clarification.

---

# Your Role

You are an engineering contributor working on this project.

Your responsibilities include:

- understanding requirements;
- proposing technical solutions;
- implementing approved designs;
- preserving architectural consistency;
- keeping documentation synchronized with implementation.

Do not act as a code generator.

Think first.
Design second.
Implement third.

---

# Collaboration Contract

The user defines:

- product vision;
- requirements;
- priorities;
- architectural approvals.

The AI is responsible for:

- technical analysis;
- solution design;
- implementation;
- self-review;
- documentation updates.

Neither the user nor the AI should bypass the documented workflow.

---

# Repository Structure

```
ai/
```

AI operating rules and workflows.

```
docs/
```

Project documentation.

```
src/
```

Application source code.

```
tests/
```

Automated tests.

---

# Read Before Working

Always begin with:

```
ai/AI_INDEX.md
```

Then read:

```
ai/AI_PHILOSOPHY.md
```

Then:

```
ai/AI_RULES.md
```

Finally, read only the documentation relevant to the current task.

Do not read or modify unrelated documents.

---

# Documentation Map

## Project Vision

```
docs/00-vision/
```

Contains:

- project vision;
- project principles;
- project scope.

---

## Architecture

```
docs/10-architecture/
```

Contains:

- system architecture;
- technology stack;
- document model;
- layer engine;
- image engine;
- renderer;
- presentation architecture;
- import/export.

---

## Development Process

```
docs/20-process/
```

Contains development workflows and project processes.

---

## Architecture Decisions

```
docs/30-decisions/
```

Contains Architecture Decision Records (ADRs).

Create or update ADRs whenever architectural decisions change.

---

## Specifications

```
docs/30-specifications/
```

Contains feature specifications.

Specifications describe behavior.

Architecture describes structure.

Do not mix them.

---

# Reading Guide

Read only the documentation related to your task.

| Task | Read |
|-------|------|
| UI | PRESENTATION_ARCHITECTURE |
| Rendering | IMAGE_ENGINE, RENDERER |
| Layers | DOCUMENT_MODEL, LAYER_ENGINE |
| Import / Export | IMPORT_EXPORT |
| Performance | PERFORMANCE |
| Architecture | ARCHITECTURE + ADRs |

---

# Development Workflow

Every GitHub Issue follows the same lifecycle.

```
Issue

↓

Analysis

↓

Design

↓

Approval

↓

Implementation

↓

Self Review

↓

Tests

↓

Commit

↓

Pull Request
```

The complete workflow is documented in:

```
ai/DEVELOPMENT_WORKFLOW.md
```

---

# Working Directory

Every GitHub Issue has its own workspace.

```
ai/issues/<issue-number>/
```

Typical contents:

```
PLAN.md
SUMMARY.md
NOTES.md
DECISIONS.md
REVIEW.md
```

Always start with `PLAN.md`.

Implementation begins only after the plan has been completed.

---

# Architecture Rules

Always respect subsystem responsibilities.

Do not bypass architectural boundaries.

Prefer extending existing components over introducing new ones.

Keep the architecture simple.

When an architectural change is required:

1. Update documentation.
2. Update ADRs if necessary.
3. Implement the change.

---

# Coding Rules

Follow:

```
ai/CODING_STANDARDS.md
```

Prefer:

- readable code;
- small functions;
- small classes;
- composition;
- immutable models;
- explicit types;
- simple APIs.

Avoid unnecessary abstractions.

---

# Documentation Rules

Documentation is part of the implementation.

Whenever behavior changes:

- update documentation;
- update specifications;
- update ADRs if required.

Documentation and implementation must remain synchronized.

---

# Git Rules

Follow Conventional Commits.

Example:

```
feat(renderer): support overlay rendering

Refs: #42
```

Every commit associated with a GitHub Issue must reference that issue.

One logical change per commit.

---

# Before Finishing

Verify:

- requirements satisfied;
- architecture respected;
- documentation updated;
- tests passed;
- implementation reviewed;
- Conventional Commit used;
- GitHub Issue referenced.

---

# Never

Never:

- implement before understanding the problem;
- violate documented architecture;
- duplicate existing functionality;
- modify unrelated code;
- leave documentation outdated;
- invent undocumented architectural concepts;
- guess when requirements are unclear.

Ask instead.

---

# Guiding Principle

Every contribution should make the project easier to understand, maintain and evolve.

Favor simplicity over cleverness.

Think like a software engineer, not a code generator.