import { Location, RouteObject } from "react-router-dom";

import { deepmerge } from "deepmerge-ts";

import { User } from "@/auth/auth.types";
import { LocaleResources } from "@/i18n/i18n.types";

import { MenuItem, Module } from "../app.types";

// biome-ignore lint/style/useNamingConvention: <explanation>
export type GlobalThis = typeof globalThis & { APP_MODULES: Module[] };

// use globalThis to store modules as singleton
// avoid problems with vite.setup cached imports
if (!(globalThis as GlobalThis).APP_MODULES) {
  (globalThis as GlobalThis).APP_MODULES = [];
}
const modules: Module[] = (globalThis as GlobalThis).APP_MODULES;

export const getModules = () => {
  return modules;
};

export const getAllowedMenuItems = (user: User) => () => {
  return modules

    .flatMap((module) => module.menuItems)
    .filter(Boolean)
    .filter((menuItem) => menuItem!.isAllowed?.(user) ?? true)
    .toSorted((a, b) => (a!.priority || 0) - (b!.priority || 0)) as MenuItem[];
};

export const getAllLocalesResources = () => {
  return modules
    .filter((module) => !!module.locales)
    .reduce((acc, module) => {
      return deepmerge(acc, module.locales!);
    }, {} as LocaleResources);
};

export const getAllRoutes = () => {
  return modules
    .filter((module) => !!module.routes)
    .flatMap((module) => module.routes) as RouteObject[];
};

export const getAllMockHandlers = () => {
  return modules
    .filter((module) => !!module.mockHandlers)
    .flatMap((module) => module.mockHandlers ?? []);
};

export function registerModule(module: Module) {
  modules.push(module);
}

export function defaultIsActiveHandler(location: Location, path?: string) {
  return !!path && location.pathname.includes(path);
}
