import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client.js";
import { useAuth } from "@/context/auth-context.js";

export const useMyOrders = () => {
  const { token, isReady } = useAuth();

  const query = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await apiClient.private.get("/orders/mine");
      return res;
    },
    enabled: isReady && Boolean(token),
    staleTime: 1000 * 60 * 2,
  });

  return {
    orders: query.data?.items ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
