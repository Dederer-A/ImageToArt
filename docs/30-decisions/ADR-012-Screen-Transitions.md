# ADR-012: Screen Transitions and Animation

**Status:** Accepted

**Date:** 2026-08-30

---

# Context

The ImageToArt application operates as a single-page application (SPA) containing distinct high-level views: Home, Gallery, and Editor. 

Switching between these screens requires a visual transition to provide a polished user experience. Initially, a standard Vue `<Transition mode="out-in">` was used. However, this approach presented several issues:
1. **White Screen Glitches**: Waiting for the old component to fully unmount before mounting the new one resulted in intermediate blank screens. On mobile frameworks like Capacitor, abrupt full-screen unmounts can cause rendering anomalies or white flashes.
2. **Layout Shifts**: Without strict layout boundaries, concurrent transitions caused screens to push each other out of place during the animation sequence.

---

# Decision

The application shall use a simultaneous cross-fade animation without structural layout shifts.

To achieve this without intermediate white screens:
1. The root application container (`<main>` in `src/App.vue`) is styled as a CSS Grid (`display: grid`).
2. The Vue `<Transition>` component operates without the `mode="out-in"` attribute, allowing entering and leaving components to exist in the DOM simultaneously.
3. During the animation phase, both the entering and leaving screens are forced into the exact same grid space (`grid-area: 1 / 1`). This allows them to cleanly overlap.
4. An opacity transition is applied, creating a seamless cross-fade.

---

# Implementation and Configuration

The transition logic and duration are encapsulated centrally within the root component of the application.

- **File**: `src/App.vue`
- **Mechanism**: Standard Vue `<Transition name="fade">` wrapping the main screen components. Each screen uses a unique `key` to trigger the transition.
- **Configuration**: The animation duration and easing function are explicitly configured in the `<style scoped>` section of `src/App.vue`.

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out; /* The duration and timing function are configured here */
  grid-area: 1 / 1;                     /* Ensures components overlap during the transition */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

To modify the speed or style of screen transitions throughout the app, developers only need to adjust the CSS transition properties in `src/App.vue`.

---

# Motivation

## Improved User Experience
A simultaneous cross-fade removes jarring flashes of the background color and feels more instantaneous and fluid than a sequential "out-then-in" approach.

## Mobile Web View Stability
Keeping an overlapping view active during the transition prevents edge cases in native web views (like iOS/Capacitor) where an empty DOM momentarily triggers a white screen render.

## Simplified Codebase
Using CSS Grid for overlapping elements avoids the need for complex absolute positioning logic, maintaining a predictable flow for the rest of the application.

---

# Consequences

- Adding new high-level screens requires ensuring they exist inside the main `<Transition>` block and have a distinct `:key` attribute.
- Individual screens do not control their entry/exit animations when being mounted/unmounted by the main router/state flow; this behavior is entirely owned by `App.vue`.