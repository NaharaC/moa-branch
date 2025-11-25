import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../../../services/products.api.js";

const PRODUCTS_QUERY_KEY = ["products"];

const normalizeFilters = (filters) => {
  if (!filters || typeof filters !== "object") return {};
  return filters;
};

export const useProducts = (filters) => {
  const normalizedFilters = useMemo(() => normalizeFilters(filters), [filters]);
  const query = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, normalizedFilters],
    queryFn: () => productsApi.list(normalizedFilters),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  return {
    products: query.data?.items ?? [],
    total: query.data?.total ?? query.data?.items?.length ?? 0,
    isLoading: query.isLoading,
    error: query.error ?? null,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
