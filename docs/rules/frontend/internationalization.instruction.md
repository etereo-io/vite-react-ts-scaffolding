# Internationalization (i18n) Guidelines

## Key Naming Convention

Follow the structure: **`[feature].[component].[element].[modifier]`**

Feature namespace is mandatory. Build keys progressively:

```json
{
  "translation": {
    // Feature + Component
    "board.editor.title": "Coach Board",
    "board.tools.pointer": "Pointer",
    "board.canvas.loading": "Loading canvas...",
    
    // Feature + Component + Element
    "board.editor.tabs.tools": "Tools",
    "board.canvas.zoom.in": "Zoom In",
    "board.slides.add": "Add Slide",
    
    // Feature + Component + Element + Modifier
    "board.canvas.zoom.reset": "Reset Zoom",
    "board.parameters.stroke.width": "Stroke Width",
    
    // Error states
    "board.error.load_background": "Failed to load background",
    "board.error.save": "Failed to save board"
  }
}
```

## Feature-Based Organization

All translations are colocated within feature directories:

```
src/
├── board/
│   └── assets/
│       └── locales/
│           ├── en.json
│           ├── es.json
│           └── fr.json
├── charts/
│   └── assets/
│       └── locales/
│           ├── en.json
│           ├── es.json
│           └── fr.json
└── shared/
    └── assets/
        └── locales/           # Only for truly shared translations
            ├── en.json
            ├── es.json
            └── fr.json
```

### Example Feature Translations

```json
// src/board/assets/locales/en.json
{
  "translation": {
    "board.editor.title": "Coach Board",
    "board.editor.save": "Save",
    "board.editor.undo": "Undo",
    "board.editor.redo": "Redo",
    
    "board.tools.pointer": "Pointer",
    "board.tools.circle": "Circle",
    "board.tools.rectangle": "Rectangle",
    "board.tools.line": "Line",
    "board.tools.arrow": "Arrow",
    "board.tools.text": "Text",
    
    "board.canvas.zoom.in": "Zoom In",
    "board.canvas.zoom.out": "Zoom Out",
    "board.canvas.zoom.reset": "Reset Zoom",
    
    "board.slides.add": "Add Slide",
    "board.slides.duplicate": "Duplicate Slide",
    "board.slides.delete": "Delete Slide",
    
    "board.parameters.title": "{{toolName}} Parameters",
    "board.parameters.fill": "Fill Color",
    "board.parameters.stroke": "Stroke Color",
    
    "board.error.load_background": "Failed to load background",
    "board.error.save": "Failed to save board"
  }
}
```

## Usage in Components

### Basic Translation

```typescript
import { useTranslation } from "react-i18next";

export function BoardEditor() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("board.editor.title")}</h1>
      <button>{t("board.editor.save")}</button>
      <button>{t("board.editor.undo")}</button>
    </div>
  );
}
```

### Translation with Interpolation

Use simple interpolation when necessary:

```typescript
export function BoardParameters({ toolName }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("board.parameters.title", { toolName })}</h2>
      <label>{t("board.parameters.fill")}</label>
      <label>{t("board.parameters.stroke")}</label>
    </div>
  );
}
```

### Static Keys (Preferred)

```typescript
// ✅ Use static keys
export function BoardCanvas() {
  const { t } = useTranslation();

  return (
    <div>
      <button>{t("board.canvas.zoom.in")}</button>
      <button>{t("board.canvas.zoom.out")}</button>
      <button>{t("board.canvas.zoom.reset")}</button>
    </div>
  );
}

// ❌ Avoid dynamic key construction
export function BadExample({ tools }: Props) {
  const { t } = useTranslation();
  
  return (
    <div>
      {tools.map(tool => (
        <button key={tool.id}>
          {t(`board.tools.${tool.type}`)} {/* Avoid this */}
        </button>
      ))}
    </div>
  );
}
```

## Configuration

```typescript
// i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import feature translations
import boardEn from "../board/assets/locales/en.json";
import boardEs from "../board/assets/locales/es.json";
import chartsEn from "../charts/assets/locales/en.json";
import chartsEs from "../charts/assets/locales/es.json";

const resources = {
  en: {
    translation: {
      ...boardEn.translation,
      ...chartsEn.translation,
    },
  },
  es: {
    translation: {
      ...boardEs.translation,
      ...chartsEs.translation,
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
```

## Translation Constants

Define constants for better maintainability:

```typescript
// board/board.constants.ts
export const I18N_KEYS = {
  // Editor
  EDITOR_TITLE: "board.editor.title",
  EDITOR_SAVE: "board.editor.save",
  EDITOR_UNDO: "board.editor.undo",
  EDITOR_REDO: "board.editor.redo",
  
  // Tools
  TOOLS_POINTER: "board.tools.pointer",
  TOOLS_CIRCLE: "board.tools.circle",
  TOOLS_LINE: "board.tools.line",
  
  // Canvas
  CANVAS_ZOOM_IN: "board.canvas.zoom.in",
  CANVAS_ZOOM_OUT: "board.canvas.zoom.out",
  CANVAS_ZOOM_RESET: "board.canvas.zoom.reset",
  
  // Errors
  ERROR_LOAD_BACKGROUND: "board.error.load_background",
  ERROR_SAVE: "board.error.save",
} as const;

// Usage
export function BoardEditor() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t(I18N_KEYS.EDITOR_TITLE)}</h1>
      <button>{t(I18N_KEYS.EDITOR_SAVE)}</button>
    </div>
  );
}
```

## Best Practices

1. **Consistent Key Structure**: Follow `[feature].[component].[element].[modifier]` pattern
2. **Static Keys**: Avoid dynamic key construction for better maintainability
3. **Feature-Based Organization**: Keep translations colocated with feature code
4. **Error Patterns**: Use consistent error key patterns like `[feature].error.[action]`
5. **Translation Constants**: Use constants instead of magic strings
