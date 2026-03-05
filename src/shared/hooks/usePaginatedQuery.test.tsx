import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { usePaginatedQuery } from "./usePaginatedQuery";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("usePaginatedQuery", () => {
  it("should initialize with page 0 and default limit", async () => {
    const queryFn = vi.fn().mockResolvedValue({ items: [] });

    const { result } = renderHook(
      () =>
        usePaginatedQuery({
          queryKey: ["test"],
          queryFn
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.page).toBe(0);
    expect(result.current.pagination.offset).toBe(0);
    expect(result.current.pagination.limit).toBe(20);

    await waitFor(() =>
      expect(queryFn).toHaveBeenCalledWith({ offset: 0, limit: 20 })
    );
  });

  it("should use custom initial limit", async () => {
    const queryFn = vi.fn().mockResolvedValue({ items: [] });

    const { result } = renderHook(
      () =>
        usePaginatedQuery({
          queryKey: ["test-limit"],
          queryFn,
          initialLimit: 10
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.pagination.limit).toBe(10);
    await waitFor(() =>
      expect(queryFn).toHaveBeenCalledWith({ offset: 0, limit: 10 })
    );
  });

  it("should advance to next page", async () => {
    const queryFn = vi.fn().mockResolvedValue({ items: [] });

    const { result } = renderHook(
      () =>
        usePaginatedQuery({
          queryKey: ["test-next"],
          queryFn,
          initialLimit: 10
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(1);
    expect(result.current.pagination.offset).toBe(10);
  });

  it("should go to previous page without going below 0", async () => {
    const queryFn = vi.fn().mockResolvedValue({ items: [] });

    const { result } = renderHook(
      () =>
        usePaginatedQuery({
          queryKey: ["test-prev"],
          queryFn,
          initialLimit: 10
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.pagination.offset).toBe(0);
  });

  it("should go to specific page", async () => {
    const queryFn = vi.fn().mockResolvedValue({ items: [] });

    const { result } = renderHook(
      () =>
        usePaginatedQuery({
          queryKey: ["test-goto"],
          queryFn,
          initialLimit: 10
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.page).toBe(3);
    expect(result.current.pagination.offset).toBe(30);
  });

  it("should update limit and reset offset", async () => {
    const queryFn = vi.fn().mockResolvedValue({ items: [] });

    const { result } = renderHook(
      () =>
        usePaginatedQuery({
          queryKey: ["test-set-limit"],
          queryFn,
          initialLimit: 20
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.setLimit(50);
    });

    expect(result.current.pagination.limit).toBe(50);
    expect(result.current.pagination.offset).toBe(0);
  });
});
