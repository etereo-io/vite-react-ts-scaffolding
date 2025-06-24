import type { RequestHandler, WebSocketHandler } from "msw";
import type { ReactElement } from "react";
import type { Location, RouteObject } from "react-router";

import type { User } from "@/app/features/auth/auth.types";
import type { LocaleResources } from "@/app/features/i18n/i18n.types";

export interface MenuItem {
  title: string;
  children?: MenuItem[];
  icon?: ReactElement;
  path?: string;
  isActive?: (location: Location, path?: string) => boolean;
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
  getMockHandlers?: () => (RequestHandler | WebSocketHandler)[];
  // all module permissions definitions
  permissions?: string[];
}
