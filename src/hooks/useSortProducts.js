import { useMemo, useState, useCallback } from "react";
import { sortProducts, PRODUCT_SORT_KEYS, PRODUCT_SORT_DIRS } from "../utils/sort.js";


export const useSortedProducts = (items = [], { sortBy = "updatedAt", sortDir = "desc" } = {}) => {
  const sorted = useMemo(() => sortProducts(items, sortBy, sortDir), [items, sortBy, sortDir]);
  return sorted;
};


export const useSortState = (initial = { sortBy: "updatedAt", sortDir: "desc" }) => {
  const [sortBy, setSortBy] = useState(initial.sortBy);
  const [sortDir, setSortDir] = useState(initial.sortDir);

  const ensureKey = (key) => (PRODUCT_SORT_KEYS.includes(key) ? key : "updatedAt");
  const ensureDir = (dir) => (PRODUCT_SORT_DIRS.includes(dir) ? dir : "desc");

  const setSort = useCallback((by, dir) => {
    const nextBy = ensureKey(by);
    if (dir) {
      setSortBy(nextBy);
      setSortDir(ensureDir(dir));
      return;
    }
    setSortBy((prevBy) => {
      if (prevBy === nextBy) {
        setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
        return prevBy;
      }
      setSortDir("asc");
      return nextBy;
    });
  }, []);

  return { sortBy, sortDir, setSort };
};
