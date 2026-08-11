# ImageToArt

![Vue](https://img.shields.io/badge/Vue-3-42b883)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF)
![License](https://img.shields.io/github/license/Dederer-A/ImageToArt)

This project exists to help artists study and understand reference images before drawing or painting.

The application is designed specifically for image analysis, not for image editing.

Its purpose is to simplify observation of proportions, values, composition, shapes and edges while keeping the workflow simple, fast and distraction-free.

---

## Development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
pnpm exec vite --force
```

Build the application:

```bash
pnpm build
```

---

## iOS

Before the first iOS build:

```bash
npx cap add ios
```

After each web build, synchronize the native project:

```bash
pnpm build
npx cap sync ios
```

Open the project in Xcode:

```bash
npx cap open ios
```

---

## Android

Before the first Android build:

```bash
pnpm add @capacitor/android
npx cap add android
```

After each web build, synchronize the native project:

```bash
pnpm build
npx cap sync android
```

Open the project in Android Studio:

```bash
npx cap open android
```

---

To run `smart_prompt_builder.py` install the following library (work wich clipboard):

```bash
pip install pyperclip
```

---

## Generate OPEN_SOURCE_LICENSES.md

```bash
pnpm license-checker-rseidelsohn \
  --production \
  --files \
  --markdown \
  > OPEN_SOURCE_LICENSES.md
```

---

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Capacitor
- Tailwind CSS v4
- shadcn-vue
- VueUse
- Lucide Icons

---

## Recommended VS Code Extensions

- Vue - Official
- ESLint
- Prettier
- Error Lens
- GitLens
- EditorConfig
- Path Intellisense

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
