import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context.js";
import { userApi } from "@/services/user.api.js";

export const useUser = () => {
  const { token, user, isReady } = useAuth();

  const query = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => userApi.getById(user.id),
    enabled: isReady && Boolean(token) && Boolean(user?.id),
  });

  return {
    user: query.data ?? user,
    isLoading: query.isLoading,
    error: query.error,
  };
};
