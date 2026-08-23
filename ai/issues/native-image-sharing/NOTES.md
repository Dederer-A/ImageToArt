# Notes

- Using `@capgo/capacitor-share-target` plugin.
- Limiting / processing up to 10 images.
- Updated `ShareViewController` from `SLComposeServiceViewController` to `UIViewController` to remove the text input / post compose sheet when sharing from Photos.
- Implemented file copying into the shared App Group container (`group.com.imagetoart.app`) to avoid iOS sandbox permission errors (Code 257).
