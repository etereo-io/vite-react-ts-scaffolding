# Modules Instruction

## What is a Module?
A module in this frontend architecture is a self-contained feature unit that encapsulates its own routes, menu items, localization, and business logic. Modules enable scalable, maintainable, and domain-driven development by isolating feature concerns and promoting clear boundaries between application domains.

## How to Declare a Module
To declare a module, create an entrypoint file (typically `index.tsx`) within the feature directory (e.g., `src/features/dashboard/index.tsx`). This file should:

1. **Define Routes**: Export a `routes` array of route objects for React Router, representing the navigation structure for the module.
2. **Define Menu Items**: Export a `menuItems` array, each item describing a menu entry (title, icon, path, and access control logic).
3. **Provide Locales**: Export a `locales` object containing translation keys and values for internationalization.
4. **Register the Module**: Call `registerModule` with an object containing the module's name (constant), routes, menuItems, and locales.

Example (from `dashboard/index.tsx`):
```tsx
const routes: RouteObject[] = [ ... ];
const menuItems: MenuItem[] = [ ... ];
const locales = { ... };
registerModule({
  name: MODULE_DASHBOARD,
  routes,
  menuItems,
  locales
});
```

## Elements Involved in Module Declaration
- **Module Entrypoint**: The main file (e.g., `index.tsx`) that declares and registers the module.
- **Module Constant**: A unique constant (e.g., `MODULE_DASHBOARD`) identifying the module.
- **Routes**: Route definitions for navigation and page rendering.
- **Menu Items**: Menu configuration for UI navigation, including access control.
- **Locales**: Localization resources for the module.
- **registerModule Function**: Registers the module with the application, making it discoverable and active.
- **Active Modules List**: The file `src/app/features/modules/modules.ts` imports all active modules to enable them in the app.

## How Modules Are Activated
To activate a module, import its entrypoint in `src/app/features/modules/modules.ts`:
```ts
import "@/features/dashboard";
```
This ensures the module is registered and available in the application.

## Summary
- Modules encapsulate feature logic, routes, menu, and i18n.
- Declare modules in their own entrypoint file and register with `registerModule`.
- Activate modules by importing them in the central modules file.
- Follow project conventions for naming, structure, and separation of concerns.
