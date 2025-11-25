import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../../services/products.api.js';

const CATEGORIES_QUERY_KEY = ['categories'];

const normalizeCategories = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export function useCategories({ enabled = true } = {}) {
  const normalizedEnabled = useMemo(() => Boolean(enabled), [enabled]);
  const query = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => normalizeCategories(await productsApi.listCategories()),
    enabled: normalizedEnabled,
    staleTime: 1000 * 60 * 5,
  });

  return {
    categories: query.data ?? [],
    isLoading: normalizedEnabled ? query.isLoading : false,
    error: normalizedEnabled ? query.error ?? null : null,
    refresh: query.refetch,
    isFetching: query.isFetching,
  };
}
