import { User } from "../auth.types";
import { PermissionMother } from "./PermissionMother";
import mockUser from "./user.mock.json";

export class UserMother {
  static getMockUser(user?: Partial<User>) {
    return {
      ...mockUser,
      permissions: PermissionMother.getAll(),
      ...user
    } as User;
  }
}
