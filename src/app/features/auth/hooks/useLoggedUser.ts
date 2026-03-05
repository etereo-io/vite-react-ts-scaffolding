import { useContext } from "react";

import { userMother } from "../__mocks__/user.mother";
import { AuthContext } from "../providers/AuthContext";

export function useLoggedUser() {
  const authContext = useContext(AuthContext);

  // If AuthContext is available, use it
  if (authContext) {
    return {
      user: authContext.user ?? undefined,
      isPending: authContext.isPending
    };
  }

  // Fallback to mock user when no AuthProvider is present (backward compat)
  return {
    user: userMother.getMockUser(),
    isPending: false
  };
}
