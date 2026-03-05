import type { User } from "../auth.types";
import { UserRoles } from "../auth.types";
import { PermissionMother } from "./PermissionMother";
import mockUser from "./user.mock.json";

export const userMother = {
  getMockUser: (user?: Partial<User>) => {
    return {
      ...mockUser,
      permissions: PermissionMother.getMockPermissions(),
      ...user
    } as User;
  },

  getMockAdminUser: (overrides?: Partial<User>): User => {
    return {
      login: "admin",
      email: "admin@test.com",
      name: "Admin User",
      userId: "user-admin-001",
      roles: [UserRoles.ADMIN, UserRoles.STAFF],
      permissions: PermissionMother.getMockPermissions(),
      attributes: [{ key: "tenants", values: ["tenant1", "tenant2"] }],
      userData: {
        description: "Mock admin user",
        employeeId: "admin_mock",
        employeeNumber: 1001,
        id: "user-admin-001",
        login: "admin",
        mail: "admin@test.com",
        name: "Admin User"
      },
      ...overrides
    };
  },

  getMockStaffUser: (overrides?: Partial<User>): User => {
    return {
      login: "staff",
      email: "staff@test.com",
      name: "Staff User",
      userId: "user-staff-001",
      roles: [UserRoles.STAFF],
      permissions: PermissionMother.getMockPermissions(),
      attributes: [{ key: "tenants", values: ["tenant1"] }],
      userData: {
        description: "Mock staff user",
        employeeId: "staff_mock",
        employeeNumber: 2001,
        id: "user-staff-001",
        login: "staff",
        mail: "staff@test.com",
        name: "Staff User"
      },
      ...overrides
    };
  },

  getMockRegularUser: (overrides?: Partial<User>): User => {
    return {
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
      },
      ...overrides
    };
  }
};
