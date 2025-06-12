import { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { act, renderHook } from "@testing-library/react";
import { Mock } from "vitest";

import { useQueryParams } from "./useQueryParams";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useLocation: vi.fn(),
  useNavigate: () => mockNavigate,
}));

interface WrapperProps {
  children: ReactNode;
}

describe("useQueryParams", () => {
  beforeEach(() => {
    (useLocation as Mock).mockImplementation(() => ({
      search: "?param1=value1&param2=value2",
    }));
  });

  it("should clear params", () => {
    const wrapper = ({ children }: WrapperProps) => (
      <MemoryRouter initialEntries={["/test?param1=value1"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useQueryParams(), { wrapper });

    act(() => {
      result.current.clear();
    });
    expect(mockNavigate).toHaveBeenCalledWith({ search: "" });
  });

  it("should apply new params", () => {
    const wrapper = ({ children }: WrapperProps) => (
      <MemoryRouter initialEntries={["/test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useQueryParams(), { wrapper });

    const params = new URLSearchParams();
    params.append("param2", "value2");

    act(() => {
      result.current.applyParams(params);
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      { search: "param2=value2" },
      undefined,
    );

    act(() => {
      result.current.applyParams(params, { replace: true });
    });

    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith(
      { search: "param2=value2" },
      { replace: true },
    );
  });

  it("should remove specific params", () => {
    const wrapper = ({ children }: WrapperProps) => (
      <MemoryRouter initialEntries={["/test?param1=value1&param2=value2"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useQueryParams(), { wrapper });

    act(() => {
      result.current.removeParams("param1");
    });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      { search: "param2=value2" },
      undefined,
    );

    act(() => {
      result.current.removeParams("param1", { replace: true });
    });
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith(
      { search: "param2=value2" },
      { replace: true },
    );
  });
});
