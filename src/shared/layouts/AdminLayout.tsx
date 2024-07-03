import * as React from "react";
import { Outlet } from "react-router-dom";

import { Divider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

import { LocaleSelector } from "@/i18n/components/LocaleSelector";

import { NavigationMenu } from "../components/NavigationMenu";

export function AdminLayout({ children }: { readonly children?: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }} data-testid="dashboard-page">
      <CssBaseline />
      <AppBar position="absolute" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Box
              component="img"
              sx={{
                width: 52,
              }}
              alt="Dashboard Icon"
              src={new URL("/src/assets/images/mas-orange-logo.svg", import.meta.url).href}
            />
          </Box>
          <NavigationMenu />
          <Divider sx={{ mx: 1 }} />
          <LocaleSelector />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[50],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Outlet />
          {children}
        </Container>
      </Box>
    </Box>
  );
}
