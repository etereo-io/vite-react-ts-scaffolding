import { userMother } from "./__mocks__/user.mother";
import { isUserAllowed } from "./auth.helpers";

describe("auth.helpers", () => {
  describe("isUserAllowed", () => {
    const user = userMother.getMockUser({
      permissions: ["permission1", "permission2"]
    });

    test("should return false if user is not provided", () => {
      expect(
        isUserAllowed({
          permissions: "permission1"
        })
      ).toBe(false);
    });

    test("should return true if user has the required string permission", () => {
      expect(isUserAllowed({ user, permissions: "permission1" })).toBe(true);
    });

    test("should return false if user does not have the required string permission", () => {
      expect(isUserAllowed({ user, permissions: "permission3" })).toBe(false);
    });

    test("should return true if user has at least one of the required string array permissions", () => {
      const permissions = ["permission1", "permission3"];
      expect(isUserAllowed({ user, permissions })).toBe(true);
    });

    test("should return false if user does not have any of the required string array permissions", () => {
      const permissions = ["permission3", "permission4"];
      expect(isUserAllowed({ user, permissions })).toBe(false);
    });

    test("should return true if user has all required permissions from nested arrays", () => {
      const permissions = [["permission1", "permission3"], ["permission2"]];
      expect(isUserAllowed({ user, permissions })).toBe(true);
    });

    test("should return false if user does not have all required permissions from nested arrays", () => {
      const permissions = [["permission1", "permission3"], ["permission4"]];
      expect(isUserAllowed({ user, permissions })).toBe(false);
    });
  });
});
