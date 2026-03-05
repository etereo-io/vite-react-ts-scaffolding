import { userMother } from "./__mocks__/user.mother";
import {
  evaluateAuthorizationRule,
  getAndClearRedirectAfterLogin,
  isUserAllowed,
  setRedirectAfterLogin
} from "./auth.helpers";
import { UserRoles } from "./auth.types";

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

  describe("evaluateAuthorizationRule", () => {
    test("should return true when no rule is provided", () => {
      const user = userMother.getMockAdminUser();
      expect(evaluateAuthorizationRule({ user })).toBe(true);
    });

    test("should return true when rule is empty object", () => {
      const user = userMother.getMockRegularUser();
      expect(evaluateAuthorizationRule({ user, rule: {} })).toBe(true);
    });

    test("should return true when user has a bypass permission", () => {
      const user = userMother.getMockAdminUser({
        permissions: ["admin:all"]
      });
      expect(
        evaluateAuthorizationRule({
          user,
          rule: {
            bypassPermissions: ["admin:all"],
            requiredPermissions: ["tasks:read:all"]
          }
        })
      ).toBe(true);
    });

    test("should return false when user lacks required role", () => {
      const user = userMother.getMockRegularUser({ roles: [] });
      expect(
        evaluateAuthorizationRule({
          user,
          rule: { requiredRoles: [UserRoles.ADMIN] }
        })
      ).toBe(false);
    });

    test("should return true when user has at least one required role", () => {
      const user = userMother.getMockStaffUser();
      expect(
        evaluateAuthorizationRule({
          user,
          rule: { requiredRoles: [UserRoles.ADMIN, UserRoles.STAFF] }
        })
      ).toBe(true);
    });

    test("should return false when user lacks required permissions", () => {
      const user = userMother.getMockRegularUser({ permissions: [] });
      expect(
        evaluateAuthorizationRule({
          user,
          rule: { requiredPermissions: ["tasks:read:all"] }
        })
      ).toBe(false);
    });

    test("should return true when user has at least one required permission", () => {
      const user = userMother.getMockAdminUser({
        permissions: ["tasks:read:all"]
      });
      expect(
        evaluateAuthorizationRule({
          user,
          rule: {
            requiredPermissions: ["tasks:read:all", "tasks:write:all"]
          }
        })
      ).toBe(true);
    });

    test("should use customCheck when no other rules cause early return", () => {
      const user = userMother.getMockAdminUser();
      const customCheck = vi.fn().mockReturnValue(false);
      expect(evaluateAuthorizationRule({ user, rule: { customCheck } })).toBe(
        false
      );
      expect(customCheck).toHaveBeenCalledWith(user);
    });

    test("should deny when roles pass but permissions fail", () => {
      const user = userMother.getMockStaffUser({ permissions: [] });
      expect(
        evaluateAuthorizationRule({
          user,
          rule: {
            requiredRoles: [UserRoles.STAFF],
            requiredPermissions: ["tasks:admin:all"]
          }
        })
      ).toBe(false);
    });

    test("should allow when both roles and permissions pass", () => {
      const user = userMother.getMockStaffUser({
        permissions: ["tasks:read:all"]
      });
      expect(
        evaluateAuthorizationRule({
          user,
          rule: {
            requiredRoles: [UserRoles.STAFF],
            requiredPermissions: ["tasks:read:all"]
          }
        })
      ).toBe(true);
    });
  });

  describe("redirect-after-login helpers", () => {
    afterEach(() => {
      sessionStorage.clear();
    });

    test("should store and retrieve redirect path", () => {
      setRedirectAfterLogin("/admin/tasks/list");
      expect(getAndClearRedirectAfterLogin()).toBe("/admin/tasks/list");
    });

    test("should clear the stored path after retrieval", () => {
      setRedirectAfterLogin("/admin/tasks/list");
      getAndClearRedirectAfterLogin();
      expect(getAndClearRedirectAfterLogin()).toBeNull();
    });

    test("should return null when no path is stored", () => {
      expect(getAndClearRedirectAfterLogin()).toBeNull();
    });
  });
});
