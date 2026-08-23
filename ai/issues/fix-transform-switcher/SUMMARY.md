# Summary: Integrate False Color into Transform Layer

## Changes
1. **Transform Layer (`src/Image/layers/Transform.ts`)**:
   - Added `falseColor: false` to `defaultProperties`.
   - Integrated the thermal/false-color grading logic and LUT into `Transform` layer execution.
2. **False Color Layer Removal**:
   - Removed `FalseColorLayer` and deleted `src/Image/layers/FalseColor.ts`.
   - Removed `FalseColorLayer` registration from `src/workplace/document.ts`.
3. **Editor Screen (`src/components/editor/EditorScreen.vue`)**:
   - Added the False Color toggle button (`Palette` icon) into the Transform `ToolRow` before Inverse.
   - Tied False Color toggle state to `transform.properties.falseColor` and automatic layer enablement logic, ensuring the master switcher and all toggle buttons work together seamlessly.

## Verification
- Ran `npm run build` (`vue-tsc -b && vite build`), which completed successfully with zero errors.
