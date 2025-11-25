import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../../../services/products.api.js";

const ADMIN_PRODUCTS_QUERY_KEY = ["admin-products"];

const buildAdminParams = ({
  page = 1,
  limit = 20,
  search = "",
  status = "",
  onlyLowStock = false,
}) => {
  const safeLimit = Math.max(1, limit);
  const safePage = Math.max(1, page);

  const params = {
    offset: (safePage - 1) * safeLimit,
    limit: safeLimit,
    scope: "admin",
  };

  if (search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (onlyLowStock) params.low_stock = true;

  return params;
};

export function useAdminProducts({ page, limit, search, status, onlyLowStock }) {
  const params = useMemo(
    () => buildAdminParams({ page, limit, search, status, onlyLowStock }),
    [page, limit, search, status, onlyLowStock],
  );

  const query = useQuery({
    queryKey: [...ADMIN_PRODUCTS_QUERY_KEY, params],
    queryFn: () => productsApi.list(params),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? items.length;

  const offset = query.data?.page?.offset ?? params.offset;
  const pageSize = query.data?.page?.limit ?? params.limit;
  const pageNumber = Math.floor(offset / pageSize) + 1;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    total,
    page: pageNumber,
    pageSize,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
