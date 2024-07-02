import SvgIcon from "@mui/material/SvgIcon";

/**
 * Represents a navigation item in the module navigator.
 */
export type NavItem = {
  icon: typeof SvgIcon;
  path: string;
  label: string;
};
