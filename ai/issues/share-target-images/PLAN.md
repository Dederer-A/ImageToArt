# Plan: Native Image Sharing Support (up to 10 images) via Capacitor Share Target

## Problem
Users want to share up to 10 images from the native iOS "Photos" app (or other apps) directly into ImageToArt via the native share sheet. When shared, all images should be saved through `persistence.ts`, but only the last received image should be opened in the editor for editing (using the `CURRENT_FILE_NAME` / `current.json` mechanism). Additionally, document initialization logic should be refactored to avoid code duplication between standard file import and shared image import, and `ShareViewController.swift` needs to be fixed to use `loadItem` instead of `loadFileURL`.

## Proposed Changes

### 1. Fix `ShareViewController.swift` (`ios/App/Image to Art/ShareViewController.swift`)
- Replace `loadFileURL` with `loadItem(forTypeIdentifier:options:)` supporting `URL`, `Data`, and `UIImage` representations of shared images.
- Ensure all up to 10 shared images are correctly saved into the App Group container and passed back to the host app.

### 2. Refactor Document Initialization in Workplace Store (`src/workplace/index.ts`)
- Extract a shared helper method `createDocumentObject(filename: string, imageData: ImageData): Document` that sets up a new document with the original source image and default variants/layers initialized from `LayerRegistry`.
- Refactor `initializeDocument(filename: string, imageData: ImageData)` to use `createDocumentObject`.
- Add a new store action `importAndSaveDocument(filename: string, imageData: ImageData, setAsCurrent?: boolean): Promise<string>` which creates the document object, saves it via `Persistence.save()`, and optionally sets it as the current active document via `Persistence.setCurrentDocument()`.

### 3. Implement Share Target Listener in Application Entry Point (`src/App.vue`)
- Import `CapacitorShareTarget` from `@capgo/capacitor-share-target`.
- In `onMounted()`, if `Persistence.isSupported()` is true, register a listener for `CapacitorShareTarget.addListener('shareReceived', async (event) => { ... })`.
- Inside the listener:
  - Iterate through `event.files` (supporting up to 10 images).
  - For each shared file, fetch its content using `Capacitor.convertFileSrc(file.uri)`, convert blob to `File` and then to `ImageData` via `resizeFileToImageData()`.
  - Call `workplace.importAndSaveDocument(file.name || 'Shared Image', imageData, isLast)` where `isLast` is true only for the last file in the batch.
  - Refresh workplace state via `refreshWorkplaceState()` so the gallery updates and the last shared image opens in the `EditorScreen`.

## Verification
1. Run `npm run build` (`vue-tsc -b && vite build`) to ensure TypeScript type checking and Vite build pass without errors.
