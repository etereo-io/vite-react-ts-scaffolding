import { MemoryRouter } from "react-router-dom";

import { act, renderHook } from "@testing-library/react";

import { useQueryParamState } from "./useQueryParamState";

describe("useQueryParamState", () => {
  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("should update query param and fallback to local storage", () => {
    const key = "myQueryParam";
    const defaultValue = "default";
    const value = "new value";

    const { result } = renderHook(
      () => useQueryParamState(key, { fallbackStore: true, defaultValue, storePrefix: "" }),
      {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      },
    );

    expect(result.current.value).toStrictEqual(defaultValue);

    act(() => {
      result.current.setValue(value);
    });

    expect(result.current.value).toStrictEqual(value);
    expect(localStorage.getItem(key)).toStrictEqual(value);
  });

  it("should update query param without fallback to local storage", () => {
    const key = "myQueryParam";
    const defaultValue = "default";
    const value = "new value";

    window.history.pushState({}, "", `/?${key}=${defaultValue}`);

    const { result } = renderHook(
      () => useQueryParamState(key, { fallbackStore: false, defaultValue, storePrefix: "" }),
      {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      },
    );

    expect(result.current.value).toStrictEqual(defaultValue);

    act(() => {
      result.current.setValue(value);
    });

    expect(result.current.value).toStrictEqual(value);
    expect(localStorage.getItem(key)).toBeFalsy();
  });

  it("should remove query param when value falsy", () => {
    const key = "myQueryParam";
    const defaultValue = "";
    const initialQueryParamValue = "initial";

    const { result } = renderHook(
      () => useQueryParamState(key, { fallbackStore: false, defaultValue, storePrefix: "" }),
      {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      },
    );

    act(() => {
      result.current.setValue(initialQueryParamValue);
    });

    expect(result.current.value).toStrictEqual(initialQueryParamValue);

    act(() => {
      result.current.setValue("");
    });

    expect(result.current.value).toBe("");

    const urlSearchParams = new URLSearchParams(window.location.search);
    expect(urlSearchParams.has(key)).toBeFalsy();
  });

  it("should reset fallaback storage", () => {
    const key = "myQueryParam";
    const defaultValue = "fallback";

    const { result } = renderHook(
      () => useQueryParamState(key, { fallbackStore: true, defaultValue, storePrefix: "" }),
      {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      },
    );

    act(() => {
      result.current.resetFallback();
    });

    expect(localStorage.getItem(key)).toStrictEqual(defaultValue);
  });
});
