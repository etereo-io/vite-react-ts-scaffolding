export interface User {
  login: string;
  email: string;
  name: string;
  userId: string;
  roles: UserRoles[];
  permissions: string[];
  attributes: { key: string; values: string[] }[];
  userData: {
    description: string;
    employeeId: string;
    employeeNumber: number;
    id: string;
    login: string;
    mail: string;
    name: string;
  };
}

export enum UserRoles {
  ADMIN = "admin",
  STAFF = "staff"
}

export type RequiredPermissions = boolean | string | string[] | string[][];

/**
 * Declarative authorization rule for route-level access control.
 *
 * Evaluation order:
 * 1. bypassPermissions: if user has ANY → ALLOW immediately
 * 2. requiredRoles: if specified, user must have at least one (OR). If not → DENY
 * 3. requiredPermissions: if specified, user must have at least one (OR). If not → DENY
 * 4. customCheck: escape hatch for complex logic
 * 5. Default → ALLOW (rule present but empty = authenticated-only)
 */
export interface AuthorizationRule {
  readonly bypassPermissions?: string[];
  readonly requiredPermissions?: string[];
  readonly requiredRoles?: UserRoles[];
  readonly customCheck?: (user: User) => boolean;
}
