import { render } from "@testing-library/react";
import { Mock } from "vitest";

import { useUserAuth } from "../hooks/useUserAuth";
import { AllowedAuth } from "./AllowedAuth";

vi.mock("@/auth/hooks/useUserAuth");

describe("AllowedAuth", () => {
  const mockUseUserAuth = useUserAuth as Mock;

  const childrenContent = <div>Allowed Content</div>;
  const errorContent = <div>Error Content</div>;

  test("should render loading state when isPending is true", () => {
    mockUseUserAuth.mockReturnValue({ isAllowed: vi.fn(), isPending: true });
    const { container } = render(
      <AllowedAuth permissions={true}>{childrenContent}</AllowedAuth>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("should render children when permissions is true", () => {
    mockUseUserAuth.mockReturnValue({ isAllowed: vi.fn(), isPending: false });
    const { getByText } = render(
      <AllowedAuth permissions={true}>{childrenContent}</AllowedAuth>
    );
    expect(getByText("Allowed Content")).toBeInTheDocument();
  });

  test("should render error when permissions is false", () => {
    mockUseUserAuth.mockReturnValue({ isAllowed: vi.fn(), isPending: false });
    const { getByText } = render(
      <AllowedAuth permissions={false} error={errorContent}>
        {childrenContent}
      </AllowedAuth>
    );
    expect(getByText("Error Content")).toBeInTheDocument();
  });

  test("should render error when user is not allowed", () => {
    const isAllowedMock = vi.fn().mockReturnValue(false);
    mockUseUserAuth.mockReturnValue({
      isAllowed: isAllowedMock,
      isPending: false
    });
    const { getByText } = render(
      <AllowedAuth permissions={["permission1"]} error={errorContent}>
        {childrenContent}
      </AllowedAuth>
    );
    expect(getByText("Error Content")).toBeInTheDocument();
    expect(isAllowedMock).toHaveBeenCalledWith(["permission1"]);
  });

  test("should render children when user is allowed", () => {
    const isAllowedMock = vi.fn().mockReturnValue(true);
    mockUseUserAuth.mockReturnValue({
      isAllowed: isAllowedMock,
      isPending: false
    });
    const { getByText } = render(
      <AllowedAuth permissions={["permission1"]}>{childrenContent}</AllowedAuth>
    );
    expect(getByText("Allowed Content")).toBeInTheDocument();
    expect(isAllowedMock).toHaveBeenCalledWith(["permission1"]);
  });

  test("should render empty when permissions is false and no error is provided", () => {
    mockUseUserAuth.mockReturnValue({ isAllowed: vi.fn(), isPending: false });
    const { container } = render(
      <AllowedAuth permissions={false}>{childrenContent}</AllowedAuth>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
