import mockUser from "./user.mock.json";
import { User } from "../auth.types";

export class UserMother {
  static getMockUser() {
    return mockUser as User;
  }
}
