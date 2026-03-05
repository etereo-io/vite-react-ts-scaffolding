import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDataTable } from "./useDataTable";

describe("useDataTable", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useDataTable());

    expect(result.current.sorting).toEqual([]);
    expect(result.current.columnFilters).toEqual({});
    expect(result.current.globalFilter).toBe("");
    expect(result.current.pagination).toEqual({ pageIndex: 0, pageSize: 20 });
  });

  it("should initialize with custom options", () => {
    const initialSorting = [{ id: "name", desc: false }];
    const { result } = renderHook(() =>
      useDataTable({ initialPageSize: 50, initialSorting })
    );

    expect(result.current.sorting).toEqual(initialSorting);
    expect(result.current.pagination.pageSize).toBe(50);
  });

  it("should update sorting", () => {
    const { result } = renderHook(() => useDataTable());

    act(() => {
      result.current.setSorting([{ id: "date", desc: true }]);
    });

    expect(result.current.sorting).toEqual([{ id: "date", desc: true }]);
  });

  it("should update column filters", () => {
    const { result } = renderHook(() => useDataTable());

    act(() => {
      result.current.setColumnFilters({ status: "active" });
    });

    expect(result.current.columnFilters).toEqual({ status: "active" });
  });

  it("should update global filter", () => {
    const { result } = renderHook(() => useDataTable());

    act(() => {
      result.current.setGlobalFilter("search term");
    });

    expect(result.current.globalFilter).toBe("search term");
  });

  it("should update pagination", () => {
    const { result } = renderHook(() => useDataTable());

    act(() => {
      result.current.setPagination({ pageIndex: 2, pageSize: 10 });
    });

    expect(result.current.pagination).toEqual({ pageIndex: 2, pageSize: 10 });
  });

  it("should reset filters and pagination page index", () => {
    const { result } = renderHook(() => useDataTable());

    act(() => {
      result.current.setColumnFilters({ status: "active" });
      result.current.setGlobalFilter("search");
      result.current.setPagination({ pageIndex: 3, pageSize: 20 });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.columnFilters).toEqual({});
    expect(result.current.globalFilter).toBe("");
    expect(result.current.pagination.pageIndex).toBe(0);
  });
});
