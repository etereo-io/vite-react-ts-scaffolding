import type { User } from "@/app/features/auth/auth.types";
import { UserRoles } from "@/app/features/auth/auth.types";
import { PermissionMother } from "./PermissionMother";

export interface MockUserEntry {
  readonly username: string;
  readonly password: string;
  readonly user: User;
}

const mockAdminUser: User = {
  login: "admin",
  email: "admin@test.com",
  name: "Admin User",
  userId: "user-admin-001",
  roles: [UserRoles.ADMIN, UserRoles.STAFF],
  permissions: [],
  attributes: [{ key: "tenants", values: ["tenant1", "tenant2"] }],
  userData: {
    description: "Mock admin user",
    employeeId: "admin_mock",
    employeeNumber: 1001,
    id: "user-admin-001",
    login: "admin",
    mail: "admin@test.com",
    name: "Admin User"
  }
};

const mockStaffUser: User = {
  login: "staff",
  email: "staff@test.com",
  name: "Staff User",
  userId: "user-staff-001",
  roles: [UserRoles.STAFF],
  permissions: [],
  attributes: [{ key: "tenants", values: ["tenant1"] }],
  userData: {
    description: "Mock staff user",
    employeeId: "staff_mock",
    employeeNumber: 2001,
    id: "user-staff-001",
    login: "staff",
    mail: "staff@test.com",
    name: "Staff User"
  }
};

const mockRegularUser: User = {
  login: "user",
  email: "user@test.com",
  name: "Regular User",
  userId: "user-regular-001",
  roles: [],
  permissions: [],
  attributes: [{ key: "tenants", values: ["tenant1"] }],
  userData: {
    description: "Mock regular user",
    employeeId: "user_mock",
    employeeNumber: 3001,
    id: "user-regular-001",
    login: "user",
    mail: "user@test.com",
    name: "Regular User"
  }
};

export const mockUserEntries: MockUserEntry[] = [
  {
    username: "admin",
    password: "admin",
    user: mockAdminUser
  },
  {
    username: "staff",
    password: "staff",
    user: mockStaffUser
  },
  {
    username: "user",
    password: "user",
    user: mockRegularUser
  }
];

function getPermissionsForUser(user: User): string[] {
  const allPermissions = PermissionMother.getMockPermissions();

  if (user.roles.includes(UserRoles.ADMIN)) {
    return allPermissions;
  }

  if (user.roles.includes(UserRoles.STAFF)) {
    return allPermissions.filter((p) => !p.includes(":admin:"));
  }

  return allPermissions.filter((p) => p.includes(":read:"));
}

let currentUser: User | null = null;
let currentToken: string | null = null;

export const mockAuthDb = {
  findUser(username: string, password: string): MockUserEntry | undefined {
    return mockUserEntries.find(
      (entry) => entry.username === username && entry.password === password
    );
  },

  login(
    username: string,
    password: string
  ): { user: User; token: string } | null {
    const entry = this.findUser(username, password);
    if (!entry) {
      return null;
    }
    currentUser = {
      ...entry.user,
      permissions: getPermissionsForUser(entry.user)
    };
    currentToken = `mock-token-${entry.username}-${Date.now()}`;
    return { user: currentUser, token: currentToken };
  },

  logout(): void {
    currentUser = null;
    currentToken = null;
  },

  getCurrentUser(): User | null {
    return currentUser;
  },

  getCurrentToken(): string | null {
    return currentToken;
  },

  refreshToken(): string | null {
    if (!currentUser) {
      return null;
    }
    currentToken = `mock-token-${currentUser.login}-${Date.now()}`;
    return currentToken;
  },

  getEntries(): readonly MockUserEntry[] {
    return mockUserEntries;
  }
};
