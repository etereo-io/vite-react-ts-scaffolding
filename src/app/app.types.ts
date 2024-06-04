import { RouteObject } from "react-router-dom";

import type { RequestHandler } from "msw";

import { User } from "@/auth/auth.types";
import { LocaleResources } from "@/i18n/i18n.types";

export interface MenuItem {
  title: string;
  icon: JSX.Element;
  path: string;
  isAllowed?: (user: User) => boolean;
  priority?: number;
}

export interface Module {
  name: string;
  parent?: string;
  locales?: LocaleResources;
  menuItems?: MenuItem[];
  routes?: RouteObject[];
  // all module mock handlers
  mockHandlers?: RequestHandler[];
  // all module permissions definitions
  permissions?: string[];
}
