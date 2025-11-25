import { usePersistentState } from "../../../hooks/usePersistentState.js";
import { useAuth } from "../../../context/auth-context.js";
import { useEffect, useMemo } from "react";
import { apiClient } from "@/services/api-client.js";

export const useWishlist = () => {
  const { token, user, isAuthenticated, isReady } = useAuth();

  const storageKey = useMemo(
    () => (user ? `wishlist.${user.id}` : "wishlist.anon"),
    [user]
  );

  const [wishlist, setWishlist] = usePersistentState(storageKey, {
    initialValue: [],
  });

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      localStorage.removeItem(storageKey);
    }
  }, [user, setWishlist, storageKey]);

  useEffect(() => {
    if (!isReady || !token || !isAuthenticated || !user) return;

    apiClient.private
      .get("/wishlist")
      .then((data) => {
        if (Array.isArray(data.items)) {
          setWishlist(data.items);
        }
      })
      .catch(() => {});
  }, [isReady, token, isAuthenticated, user, setWishlist]);

  const addToWishlist = async (product) => {
    const realId = product.producto_id ?? product.id;

    await apiClient.private.post("/wishlist/add", {
      producto_id: realId,
    });

    setWishlist((prev) => [...prev, { producto_id: realId, ...product }]);
  };

  const removeFromWishlist = async (productId) => {
    await apiClient.private.delete(`/wishlist/remove/${productId}`);

    setWishlist((prev) =>
      prev.filter((item) => item.producto_id !== productId)
    );
  };

  const toggleWishlist = (product) => {
    const realId = product.producto_id ?? product.id;
    const exists = wishlist.some((item) => item.producto_id === realId);

    exists ? removeFromWishlist(realId) : addToWishlist(product);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
};
