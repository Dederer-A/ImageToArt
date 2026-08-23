# Summary: Fix Transform ToolRow Switcher in EditorScreen

## Changes
- Updated `src/components/editor/EditorScreen.vue` to add `@update:model-value="updateLayerEnable('transform', $event)"` to the Transform `ToolRow`.
- This ensures that when the user manually toggles the left switcher for the transform tool, `updateLayerEnable` correctly updates the `transform` layer state (`enabled`), mirroring the behavior of all other tool rows.

## Verification
- Ran `npm run build` (`vue-tsc -b && vite build`), which completed successfully without type errors or build failures.
