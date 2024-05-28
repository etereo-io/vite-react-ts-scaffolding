import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { getAllowedMenuItems } from "@/app/modules/modules.helpers";
import { useUser } from "@/auth/hooks/useUser";

export function AdminMenuItems() {
  const { t } = useTranslation();

  const user = useUser();

  return getAllowedMenuItems(user)().map((menuItem) => (
    <Link to={menuItem.path} key={menuItem.path}>
      <ListItemButton>
        <ListItemIcon>{menuItem.icon}</ListItemIcon>
        <ListItemText primary={t(menuItem.title)} />
      </ListItemButton>
    </Link>
  ));
}
