import { userMother } from "../__mocks__/user.mother";

export function useLoggedUser() {
  return {
    user: userMother.getMockUser(),
    isPending: false
  };
}
