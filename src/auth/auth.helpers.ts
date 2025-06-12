import { RequiredPermissions, User } from "./auth.types";

/**
 * permissions examples
 * 'permission1' means that user should have permission1
 * ['permission1', 'permission2'] means that user should have either permission1 or permission2
 * [['permission1', 'permission2'], ['permission3']] means that user should have permission1 and either permission2 or permission3
 */
export function isUserAllowed({
  user,
  permissions,
}: { user?: User; permissions: RequiredPermissions }) {
  if (!user) {
    return false;
  }

  if (typeof permissions === "string") {
    return user.permissions.includes(permissions);
  }

  if (Array.isArray(permissions)) {
    if (typeof permissions[0] === "string") {
      return (permissions as string[]).some((permission) =>
        user.permissions.includes(permission),
      );
    }

    return permissions.every((permissionGroup) =>
      (permissionGroup as string[]).some((permission) =>
        user.permissions.includes(permission),
      ),
    );
  }

  return false;
}
