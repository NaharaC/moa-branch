import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../../../services/orders.api.js";

const buildAdminParams = ({ page = 1, limit = 20, status = "", search = "" }) => {
  const safeLimit = Math.max(1, Number(limit) || 20);
  const safePage = Math.max(1, Number(page) || 1);
  const sanitizedStatus = String(status ?? "").trim();
  const sanitizedSearch = String(search ?? "").trim();

  const params = {
    page: safePage,
    limit: safeLimit,
  };

  if (sanitizedStatus) params.status = sanitizedStatus;
  if (sanitizedSearch) params.q = sanitizedSearch;

  return params;
};

export function useAdminOrders({ page, limit, status, search }) {
  const params = useMemo(
    () => buildAdminParams({ page, limit, status, search }),
    [page, limit, status, search],
  );

  const query = useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => ordersApi.list(params),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? items.length;
  const pageSize = query.data?.page?.limit ?? params.limit;
  const offset = query.data?.page?.offset ?? (params.page - 1) * params.limit;
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
