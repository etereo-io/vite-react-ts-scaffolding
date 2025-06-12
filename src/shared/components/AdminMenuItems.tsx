import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";

import { useLoggedUser } from "@/app/features/auth/hooks/useLoggedUser";
import {
  defaultIsActiveHandler,
  getAllowedMenuItems
} from "@/app/features/modules/modules.helpers";

export function AdminMenuItems() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useLoggedUser();

  const handleNavigate = (path: string) => () => {
    path && navigate(path);
  };

  return (
    <ul className="space-y-1 px-3">
      {getAllowedMenuItems(user)().map((menuItem) => {
        const isActive = (menuItem.isActive ?? defaultIsActiveHandler)(
          location,
          menuItem.path
        );

        return (
          <React.Fragment key={menuItem.path}>
            <li>
              <button
                onClick={handleNavigate(menuItem.path ?? "")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="flex-shrink-0">{menuItem.icon}</span>
                <span className="truncate">{t(menuItem.title)}</span>
              </button>
            </li>

            {!!menuItem.children?.length && (
              <li>
                <ul className="ml-6 space-y-1">
                  {menuItem.children.map((child) => {
                    const childIsActive = (
                      child.isActive ?? defaultIsActiveHandler
                    )(location, child.path);

                    return (
                      <li key={child.title}>
                        <button
                          onClick={handleNavigate(child.path ?? "")}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            childIsActive
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <span className="flex-shrink-0">{child.icon}</span>
                          <span className="truncate text-sm">
                            {t(child.title)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
}
