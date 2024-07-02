import { Location, RouteObject } from "react-router-dom";

import type { RequestHandler } from "msw";

import { User } from "@/auth/auth.types";
import { LocaleResources } from "@/i18n/i18n.types";

export interface MenuItem {
  title: string;
  children?: MenuItem[];
  icon?: JSX.Element;
  path?: string;
  isActive?: (location: Location, path?: string) => boolean;
  isAllowed?: (user: User) => boolean;
  priority?: number;
}

export interface Module {
  name: string;
  parent?: string;
  locales?: LocaleResources;
  routes?: RouteObject[];
  // all module mock handlers
  mockHandlers?: RequestHandler[];
  // all module permissions definitions
  permissions?: string[];
}
