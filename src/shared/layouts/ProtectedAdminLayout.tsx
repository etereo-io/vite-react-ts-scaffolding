import type { AuthorizationRule } from "@/app/features/auth/auth.types";
import { UserRoles } from "@/app/features/auth/auth.types";
import { ProtectedRoute } from "@/app/features/auth/components/ProtectedRoute";

import { AdminLayout } from "./AdminLayout";

const DEFAULT_ADMIN_AUTHORIZATION: AuthorizationRule = {
  requiredRoles: [UserRoles.ADMIN, UserRoles.STAFF]
};

interface ProtectedAdminLayoutProps {
  readonly authorization?: AuthorizationRule;
}

export function ProtectedAdminLayout({
  authorization = DEFAULT_ADMIN_AUTHORIZATION
}: ProtectedAdminLayoutProps) {
  return (
    <ProtectedRoute authorization={authorization}>
      <AdminLayout />
    </ProtectedRoute>
  );
}
