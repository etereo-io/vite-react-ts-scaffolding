import { UserMother } from "../__mocks__/UserMother";

export function useLoggedUser() {
  return {
    user: UserMother.getMockUser(),
    isPending: false,
  };
}
