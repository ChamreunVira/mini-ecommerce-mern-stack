"use client";

import { useMemo, useState } from "react";

/** Sentinel for "no filtering on this key" — matches the default select option. */
export const ALL = "all";

interface UseTableOptions<T> {
  rows: T[];
  /** Text the search box matches against, e.g. `${p.name} ${p.code}`. */
  searchable: (row: T) => string;
  /** Row values keyed by filter name, e.g. `{ status: p.status }`. */
  filterable?: (row: T) => Record<string, string>;
  /** Filter keys and their starting values — usually all `ALL`. */
  initialFilters?: Record<string, string>;
  pageSize?: number;
}

/**
 * Search + filter + paginate one list, entirely in memory.
 *
 * The hook owns the query, the filter values, and the page so it can reset back
 * to page 1 whenever the result set changes underneath the user.
 */
export function useTable<T>({
  rows,
  searchable,
  filterable,
  initialFilters = {},
  pageSize = 8,
}: UseTableOptions<T>) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (needle && !searchable(row).toLowerCase().includes(needle)) return false;

      if (!filterable) return true;
      const values = filterable(row);
      // Every active filter must match; `ALL` opts that key out.
      return Object.entries(filters).every(
        ([key, value]) => value === ALL || values[key] === value,
      );
    });
  }, [rows, query, filters, searchable, filterable]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  // Clamp instead of tracking resets — deleting the last row on page 3 lands
  // the user on page 2 rather than an empty table.
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  function setFilter(key: string, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function search(value: string) {
    setQuery(value);
    setPage(1);
  }

  function reset() {
    setQuery("");
    setFilters(initialFilters);
    setPage(1);
  }

  const isNarrowed = query.trim().length > 0 || Object.values(filters).some((v) => v !== ALL);

  return {
    query,
    search,
    filters,
    setFilter,
    reset,
    page: safePage,
    setPage,
    pageCount,
    pageSize,
    visible,
    total: rows.length,
    matchCount: filtered.length,
    rangeStart: filtered.length === 0 ? 0 : start + 1,
    rangeEnd: start + visible.length,
    /** True when a search term or filter is hiding rows — drives the empty state copy. */
    isNarrowed,
  };
}
