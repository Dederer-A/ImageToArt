# Decisions

- Extracted `createDocumentObject` helper function in `src/workplace/index.ts` to share document creation logic between `initializeDocument` and `importAndSaveDocument`.
- Added `importAndSaveDocument` action to Workplace Store to handle saving and optional setting as current document.
