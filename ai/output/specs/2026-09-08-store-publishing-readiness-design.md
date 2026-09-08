# App Store & Google Play Store Publishing Readiness Specification

- **Ticket:** STORE-PUB-001
- **Date:** 2026-09-08

## Overview

This specification outlines all required configuration changes, code updates, environment cleanups, asset preparations, and hosting setup to bring **ImageToArt** (`com.imagetoart.app`) from development state to full production readiness for Apple App Store and Google Play Store submission.

---

## 1. Domain Names, URLs & Emails

- **Primary Domain**: `imagetoart.dederer.me`
- **Support Email**: `support@dederer.me`
- **Future Migration Strategy**: If upgraded to `imagetoart.app` later, set up an Nginx 301 redirect on `imagetoart.dederer.me` to `imagetoart.app`. The update endpoint `/latest_version.json` will continue serving old app clients via redirect or fallback.

### 1.1 App Code (`src/services/UpdateService.ts`)
- **`APP_STORE_URL`**: Replace placeholder `'https://apps.apple.com/app/id0000000000'` with the actual App Store URL (e.g., `https://apps.apple.com/app/id<APPLE_APP_ID>`).
- **`LATEST_VERSION_URL`**: Replace `'https://imagetoart.example.com/latest_version.json'` with `'https://imagetoart.dederer.me/latest_version.json'`.

### 1.2 Landing Page (`landingPage/`)
- **`landingPage/index.html`**:
  - OpenGraph URL (`<meta property="og:url">`): Update to `https://imagetoart.dederer.me/`.
  - App Store Badge Link (`href="#"`): Update link to live App Store product page.
  - Google Play Badge Link (`href="#"`): Update link to live Google Play Store product page.
  - Support Link (`a[href^="mailto:"]`): Replace `support@imagetoart.example.com` with `support@dederer.me`.
- **`landingPage/privacy-policy.html` & `term-of-use.html`**:
  - Update support email links from `support@imagetoart.example.com` to `support@dederer.me`.

### 1.3 Nginx / Web Hosting Config (`NGINX.md`)
- Update `server_name` directive from `imagetoart.example.com` to `imagetoart.dederer.me`.

---

## 2. Package & Build Metadata

### 2.1 `package.json`
- **`name`**: Change from `"temporary-project"` to `"imagetoart"`.
- **`version`**: Update from `"0.0.0"` to `"1.0.0"`.

---

## 3. Capacitor & Native Platform Configurations

### 3.1 Capacitor (`capacitor.config.ts`)
- Confirm `appId`: `'com.imagetoart.app'`.
- Confirm `appName`: `'ImageToArt'`.
- Share Target App Group: `group.com.imagetoart.app`.

### 3.2 iOS Platform (`ios/`)
- **Bundle Identifier**: `com.imagetoart.app`.
- **App Group**: Register `group.com.imagetoart.app` in Apple Developer Portal and attach to main app & share target targets.
- **Target Device Family**: iPhone only (`TARGETED_DEVICE_FAMILY = 1` in Xcode target).
- **`Info.plist`**:
  - `CAPACITOR_DEBUG`: Ensure debug mode is disabled for Release builds (`false` / `0`).
  - Permission descriptions verified: `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`.
- **Icons & Launch Screen**:
  - Replace placeholder icon in `ios/App/App/Assets.xcassets/AppIcon.appiconset` with official 1024x1024 icon asset and generated variants.
- **Code Signing & Distribution**:
  - Configure Automatic/Manual Signing with Apple Developer Distribution Certificate & App Store Provisioning Profile in Xcode.

### 3.3 Android Platform (`android/`)
- **App Package & Versioning (`android/app/build.gradle`)**:
  - `applicationId`: `"com.imagetoart.app"`.
  - `versionCode`: `1`.
  - `versionName`: `"1.0.0"`.
- **Release Build Signing (`android/app/build.gradle`)**:
  - Configure `signingConfigs.release` with keystore file path, `storePassword`, `keyAlias`, and `keyPassword`.
  - Ensure release build type uses `signingConfig signingConfigs.release`.
- **Icons (`android/app/src/main/res/mipmap-*`)**:
  - Replace default Capacitor icons with custom adaptive icons (`ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`).
- **Permissions (`AndroidManifest.xml`)**:
  - Verified `android.permission.INTERNET` and Share Target Intent Filters.

---

## 4. Debug Mode & Environment Cleanup

1. Verify `DEV_MODE` flag in `src/services/UpdateService.ts` is explicitly set to `false`.
2. Ensure production Vue build (`npm run build`) runs cleanly without warnings or errors.
3. Validate that offline-first functionality operates smoothly without network connectivity.

---

## 5. Landing Page Hosting & Store Links Setup

1. Deploy `landingPage/` to HTTPS production host at `https://imagetoart.dederer.me`.
2. Verify Privacy Policy page (`/privacy-policy.html`) and Terms of Use page (`/term-of-use.html`) are publicly reachable via HTTPS (required for store listing submission).
3. Host initial `latest_version.json` at `https://imagetoart.dederer.me/latest_version.json`:
   ```json
   {
     "version": 1,
     "updates": ["Initial release of ImageToArt"]
   }
   ```

---

## 6. Store Listing & Compliance Requirements

### Apple App Store Connect:
- Primary Category: Graphics & Design / Photo & Video.
- Age Rating: 4+ (Local image reference tool, no dynamic user content upload).
- Privacy Policy URL pointing to deployed `privacy-policy.html`.
- Support URL pointing to production site or direct support email.
- Screenshots required: 6.7" Display (iPhone 15/16 Pro Max) and 6.5" Display (iPhone XS Max/11 Pro Max). iPad screenshots are **not required** for iPhone-only target.

### Google Play Console:
- Target Audience & Content Rating questionnaire completion.
- Privacy Policy URL.
- App Bundle (`.aab`) generated via `./gradlew bundleRelease`.
- Graphics Assets: App Icon (512x512 PNG), Feature Graphic (1024x500 PNG), Phone Screenshots (min 2), 7-inch & 10-inch Tablet Screenshots.
