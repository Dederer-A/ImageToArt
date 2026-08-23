# Plan: Fix Transform ToolRow Switcher in EditorScreen

## Problem
The `ToolRow` for `toolbar.Transform` in `EditorScreen.vue` passes `:model-value` but lacks `@update:model-value`, causing manual toggling of the left switcher to do nothing.

## Proposed Changes
1. Update `src/components/editor/EditorScreen.vue`:
   - Add `@update:model-value="updateLayerEnable('transform', $event)"` to the `<ToolRow>` component for `toolbar.Transform`.

## Verification
1. Run `npm run build` to verify type-checking and compilation (`vue-tsc -b && vite build`).
