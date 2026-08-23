# Plan: In-App Version Update Checker

## Objective
Implement automatic version checking on app startup (specifically on `GalleryScreen.vue`), comparing the installed app version against a remote `latest_version.json` file fetched via HTTPS, saving the version locally, and displaying an update modal dialog when a newer version is available.

## Requirements
1. **Version Constant**: Define `CURRENT_APP_VERSION = 1` (as a number).
2. **Remote Fetch**: On `GalleryScreen.vue` mount, fetch `latest_version.json` via HTTPS.
3. **Error Handling**: If offline or fetch fails, catch the error silently, log the error to `console.log()`, and show nothing to the user.
4. **Local Storage**:
   - Use Capacitor Filesystem to read/write `latest_version.json` in the app's local data directory.
   - If local `latest_version.json` does not exist (first install), download and save remote `latest_version.json` locally with `notified: true` without showing any dialog.
   - If local `latest_version.json` exists, compare `remote.version > local.version`.
   - If remote version is newer, **immediately** save the new `latest_version.json` (with `notified: true`) locally, then show the update modal dialog on `GalleryScreen.vue`.
5. **Update Modal Component (`UpdateModal.vue`)**:
   - Reuse `ModalPage.vue` to display the new version number and list of updates (`updates: string[]`).
6. **Code Quality**:
   - Follow existing project standards.
   - Ensure `npm run build` (`vue-tsc -b && vite build`) passes successfully.
