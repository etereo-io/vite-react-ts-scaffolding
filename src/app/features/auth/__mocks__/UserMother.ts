import type { User } from "../auth.types";
import { PermissionMother } from "./PermissionMother";
import mockUser from "./user.mock.json";

export const UserMother = {
  getMockUser: (user?: Partial<User>) => {
    return {
      ...mockUser,
      permissions: PermissionMother.getMockPermissions(),
      ...user
    } as User;
  }
};
