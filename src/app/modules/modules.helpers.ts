import { RouteObject } from "react-router-dom";

import { deepmerge } from "deepmerge-ts";

import { User } from "@/auth/auth.types";
import { LocaleResources } from "@/i18n/i18n.types";

import { MenuItem, Module } from "../app.types";

const modules: Module[] = [];

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
  return modules.filter((module) => !!module.routes).flatMap((module) => module.routes) as RouteObject[];
};

export function registerModule(module: Module) {
  modules.push(module);
}
