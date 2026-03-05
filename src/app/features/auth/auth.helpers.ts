import { AUTH_REDIRECT_AFTER_LOGIN_KEY } from "./auth.constants";
import type {
  AuthorizationRule,
  RequiredPermissions,
  User
} from "./auth.types";

/**
 * permissions examples
 * 'permission1' means that user should have permission1
 * ['permission1', 'permission2'] means that user should have either permission1 or permission2
 * [['permission1', 'permission2'], ['permission3']] means that user should have permission1 and either permission2 or permission3
 */
export function isUserAllowed({
  user,
  permissions
}: {
  user?: User;
  permissions: RequiredPermissions;
}) {
  if (!user) {
    return false;
  }

  if (typeof permissions === "string") {
    return user.permissions.includes(permissions);
  }

  if (Array.isArray(permissions)) {
    if (typeof permissions[0] === "string") {
      return (permissions as string[]).some((permission) =>
        user.permissions.includes(permission)
      );
    }

    return permissions.every((permissionGroup) =>
      (permissionGroup as string[]).some((permission) =>
        user.permissions.includes(permission)
      )
    );
  }

  return false;
}

/**
 * Evaluates an authorization rule against a user.
 *
 * Evaluation order:
 * 1. No rule → ALLOW (authentication-only check)
 * 2. bypassPermissions: if user has ANY → ALLOW
 * 3. requiredRoles: if specified, user must have at least one. If not → DENY
 * 4. requiredPermissions: if specified, user must have at least one. If not → DENY
 * 5. customCheck: escape hatch for complex logic
 * 6. Default → ALLOW (rule present but empty = authenticated-only)
 */
export function evaluateAuthorizationRule({
  user,
  rule
}: {
  user: User;
  rule?: AuthorizationRule;
}): boolean {
  if (!rule) {
    return true;
  }

  if (rule.bypassPermissions && rule.bypassPermissions.length > 0) {
    const hasBypass = rule.bypassPermissions.some((permission) =>
      user.permissions.includes(permission)
    );
    if (hasBypass) {
      return true;
    }
  }

  if (rule.requiredRoles && rule.requiredRoles.length > 0) {
    const hasRole = rule.requiredRoles.some((role) =>
      user.roles.includes(role)
    );
    if (!hasRole) {
      return false;
    }
  }

  if (rule.requiredPermissions && rule.requiredPermissions.length > 0) {
    const hasPermission = rule.requiredPermissions.some((permission) =>
      user.permissions.includes(permission)
    );
    if (!hasPermission) {
      return false;
    }
  }

  if (rule.customCheck) {
    return rule.customCheck(user);
  }

  return true;
}

export function setRedirectAfterLogin(path: string): void {
  sessionStorage.setItem(AUTH_REDIRECT_AFTER_LOGIN_KEY, path);
}

export function getAndClearRedirectAfterLogin(): string | null {
  const path = sessionStorage.getItem(AUTH_REDIRECT_AFTER_LOGIN_KEY);
  if (path) {
    sessionStorage.removeItem(AUTH_REDIRECT_AFTER_LOGIN_KEY);
  }
  return path;
}
