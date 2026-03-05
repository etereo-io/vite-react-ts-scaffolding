import { useState } from "react";

interface SortingState {
  readonly id: string;
  readonly desc: boolean;
}

interface UseDataTableOptions {
  readonly initialPageSize?: number;
  readonly initialSorting?: SortingState[];
}

export function useDataTable(options: UseDataTableOptions = {}) {
  const { initialPageSize = 20, initialSorting = [] } = options;

  const [sorting, setSorting] = useState<SortingState[]>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<Record<string, unknown>>(
    {}
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize
  });

  const resetFilters = () => {
    setColumnFilters({});
    setGlobalFilter("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    resetFilters
  };
}
