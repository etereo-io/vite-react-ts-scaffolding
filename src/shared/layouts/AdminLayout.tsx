import { Bell, ChevronLeft, Menu } from "lucide-react";
import * as React from "react";
import { Outlet } from "react-router";

import { LocaleSelector } from "@/app/features/i18n/components/LocaleSelector";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

import { AdminMenuItems } from "../components/AdminMenuItems";

const drawerWidth = 240;

export function AdminLayout({
  children
}: {
  readonly children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="flex h-screen bg-gray-100" data-testid="dashboard-page">
      {/* App Bar */}
      <header
        className={`fixed top-0 z-20 bg-blue-600 text-white transition-all duration-300 ${
          open ? `left-${drawerWidth / 4} right-0` : "left-0 right-0"
        }`}
        style={{
          marginLeft: open ? `${drawerWidth}px` : "0",
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%"
        }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {!open && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDrawer}
                className="text-white hover:bg-blue-700"
                aria-label="open drawer"
              >
                <Menu className="w-6 h-6" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700 relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                4
              </span>
            </Button>
            <LocaleSelector />
          </div>
        </div>
      </header>

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-30 ${
          open ? "w-60" : "w-16"
        }`}
      >
        <div className="flex items-center justify-end p-4">
          <Button variant="ghost" size="icon" onClick={toggleDrawer}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        <Separator />

        <nav className="py-4">
          <AdminMenuItems />
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 pt-20 transition-all duration-300 ${
          open ? "ml-60" : "ml-16"
        }`}
      >
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 gap-6">
            <Outlet />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
