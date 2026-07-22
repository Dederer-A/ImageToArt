# DEVELOPMENT WORKFLOW

**Document Type:** Normative  
**Authority:** Highest  
**Version:** 1.0  
**Status:** Active

---

# Purpose

This document defines the standard development workflow for every contribution to the project.

The workflow is designed to:

- produce predictable results;
- preserve architectural consistency;
- maintain high code quality;
- make work resumable at any point;
- provide full traceability from GitHub Issue to implementation.

Every contribution must follow this workflow unless explicitly instructed otherwise.

---

# General Principles

Every task is completed in three distinct phases:

1. Design
2. Implementation
3. Testing

Implementation must never begin before the design phase has been completed.

The approved design becomes the implementation contract.

---

# Workflow Overview

```text
GitHub Issue

        │
        ▼

Analyze Requirements

        │
        ▼

Review Documentation

        │
        ▼

Analyze Existing Code

        │
        ▼

Create Design

        │
        ▼

Save Design Documents

        │
        ▼

Approval

        │
        ▼

Implementation

        │
        ▼

Self Review

        │
        ▼

Documentation Update

        │
        ▼

Tests

        │
        ▼

Commit

        │
        ▼

Push

        │
        ▼

Pull Request
```

---

# Phase 1 — Design

The goal of the Design phase is to completely understand the problem before writing code.

During this phase the AI should:

- read the GitHub Issue;
- review the relevant project documentation;
- analyze the existing implementation;
- identify affected components;
- identify architectural implications;
- identify documentation requiring updates;
- prepare an implementation plan.

No production code should be written during this phase.

---

# Design Artifacts

Every issue receives its own working directory.

Use files from the ai/issues/_TEMPLATE/ directory as a template for all dedicated artifacts. Read _TEMPLATE/README.md first.


```
ai/
    issues/
        <issue-number>/
```

Example:

```
ai/
    issues/
        125/
            PLAN.md
            NOTES.md
            DECISIONS.md
            REVIEW.md
            SUMMARY.md
```

---

## PLAN.md

The implementation plan.

Should include:

- problem summary;
- current behavior;
- desired behavior;
- affected components;
- implementation steps;
- risks;
- validation strategy.

This document is mandatory.

---

## NOTES.md

Temporary implementation notes.

May contain:

- observations;
- useful links;
- experiments;
- research results.

Optional.

---

## DECISIONS.md

Records important implementation decisions that are specific to the issue.

Optional.

---

## REVIEW.md

Created during the review phase.

Contains:

- review findings;
- remaining issues;
- follow-up tasks.

Optional.

---

# Phase 2 — Implementation

Implementation begins only after the design is complete.

During implementation the AI should:

- follow the approved plan from the previous phase;
- modify only the required components;
- keep changes focused;
- preserve architectural consistency;
- avoid unrelated refactoring.

If new architectural decisions become necessary, implementation should pause until the documentation has been updated.

---

# Documentation Updates

Documentation is part of the implementation.

Whenever behavior or architecture changes, update the corresponding documents.

Examples include:

- architecture documents;
- ADRs;
- technology documentation;
- AI documentation.

Documentation should be updated before considering the task complete.

---

# Self Review

Before committing, perform a complete self review.

Verify:

- implementation matches the approved design;
- architecture remains consistent;
- documentation is up to date;
- no unrelated files were modified;
- naming follows project conventions;
- unnecessary complexity has not been introduced.

---

# Testing

Before completing a task:

- build the project;
- run all relevant automated tests;
- perform manual verification when appropriate.

New functionality should be accompanied by appropriate tests whenever practical.

---

# Git Workflow

## Branches

Each GitHub Issue should be implemented in its own branch.

Branch naming convention:

```
feature/<issue-number>-short-description
bugfix/<issue-number>-short-description
docs/<issue-number>-short-description
refactor/<issue-number>-short-description
```

Examples:

```
feature/42-add-crop-tool

bugfix/81-fix-export-size

docs/15-update-architecture
```

---

# Commits

Each commit should represent one logical change.

Avoid combining unrelated modifications into a single commit.

Commits must follow the **Conventional Commits** specification.

Format:

```
<type>(optional-scope): <short description>

<optional body>

Refs: #<issue-number>
```

Examples:

```
feat(image-engine): add contour detection layer

Refs: #42
```

```
fix(export): preserve original image resolution

Refs: #81
```

```
docs(architecture): update render model workflow

Refs: #15
```

Common commit types include:

- feat
- fix
- docs
- refactor
- perf
- test
- chore
- build
- ci

Use a scope whenever it improves clarity.

Every commit related to a GitHub Issue must include the corresponding issue reference.

---

# Pull Requests

Before opening a Pull Request verify:

- implementation is complete;
- documentation is updated;
- architecture remains consistent;
- tests pass;
- commits are clean and meaningful;
- no temporary code remains.

The Pull Request description should summarize:

- what changed;
- why it changed;
- related issue;
- documentation updated;
- testing performed.

---

# Interruptions

Development may stop at any point.

Before stopping:

- update `PLAN.md` if necessary;
- save current progress;
- record unresolved questions;
- document remaining work.

A future AI assistant should be able to continue the task without repeating previous analysis.

---

# Definition of Done

A task is considered complete only when:

- the implementation satisfies the GitHub Issue;
- the approved design has been implemented;
- documentation has been updated where necessary;
- architecture remains consistent;
- relevant tests pass;
- self review has been completed;
- commits follow the Conventional Commits specification;
- every commit references the related GitHub Issue;
- no unrelated changes remain.

---

# Guiding Rule

Think first.

Design second.

Implement third.

Document continuously.

Commit only when the work is complete.