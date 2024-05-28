import { UserMother } from "../__mocks__/UserMother";

export function useUser() {
  return UserMother.getMockUser();
}
