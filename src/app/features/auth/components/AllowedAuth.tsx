import type { RequiredPermissions } from "../auth.types";
import { useUserAuth } from "../hooks/useUserAuth";

export function AllowedAuth({
  permissions,
  children,
  error
}: {
  readonly permissions: RequiredPermissions;
  readonly children: React.ReactNode;
  readonly error?: React.ReactNode;
}) {
  const { isAllowed, isPending } = useUserAuth();

  if (isPending) {
    // loading state
    return <></>;
  }

  if (typeof permissions === "boolean") {
    return permissions ? children : error;
  }

  if (!isAllowed(permissions)) {
    return error;
  }

  return children;
}
