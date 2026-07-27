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
- VeeValidate + Zod

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

```Text
WorkspaceStore (Pinia)
│
├── document              // сериализуемая модель
│   ├── sourceImage
│   ├── variants[]
│   └── metadata
│
├── runtime               // кэши и вычисленные данные
│   └── variantRuntimes
│
├── activeVariantId       // UI-состояние
│
└── actions / getters
    ├── currentVariant
    ├── currentRuntime
    ├── currentImageData
    ├── undo()
    ├── redo()
    ├── createVariant()
    ├── duplicateVariant()
    ├── deleteVariant()
    └── selectVariant()
```

| Сущность          | Что использовать | Почему                                                         |
| ----------------- | ---------------- | -------------------------------------------------------------- |
| `Document`        | **interface**    | Это DTO (данные), которые сериализуются в JSON.                |
| `Variant`         | **interface**    | Тоже часть сериализуемой модели.                               |
| `Layer`           | **interface**    | Аналогично.                                                    |
| `DocumentRuntime` | **class**        | Это объект поведения, управляющий кэшами и runtime-состоянием. |
| `VariantRuntime`  | **class**        | Аналогично.                                                    |
