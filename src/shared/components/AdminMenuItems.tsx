import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { List } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
  defaultIsActiveHandler,
  getAllowedMenuItems,
} from "@/app/modules/modules.helpers";
import { useLoggedUser } from "@/auth/hooks/useLoggedUser";

export function AdminMenuItems() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useLoggedUser();

  const handleNavigate = (path: string) => () => {
    path && navigate(path);
  };

  return getAllowedMenuItems(user)().map((menuItem) => {
    return (
      <React.Fragment key={menuItem.path}>
        <ListItemButton
          selected={(menuItem.isActive ?? defaultIsActiveHandler)(
            location,
            menuItem.path,
          )}
          onClick={handleNavigate(menuItem.path ?? "")}
        >
          <ListItemIcon>{menuItem.icon}</ListItemIcon>
          <ListItemText primary={t(menuItem.title)} />
        </ListItemButton>
        {!!menuItem.children?.length &&
          menuItem.children.map((child) => (
            <List disablePadding key={child.title}>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={(child.isActive ?? defaultIsActiveHandler)(
                  location,
                  child.path,
                )}
                onClick={handleNavigate(child.path ?? "")}
              >
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={t(child.title)} />
              </ListItemButton>
            </List>
          ))}
      </React.Fragment>
    );
  });
}
