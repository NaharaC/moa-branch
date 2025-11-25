import { useEffect, useMemo } from "react";
import { usePersistentState } from "../../../hooks/usePersistentState.js";
import { useAuth } from "../../../context/auth-context.js";
import { api } from "@/services/api";

const CART_STORAGE_KEY = "cart";

export const useCart = () => {
  const { token, isReady } = useAuth();

  const [cartItems, setCartItems] = usePersistentState(CART_STORAGE_KEY, {
    initialValue: [],
  });

  useEffect(() => {
    if (!isReady || !token) return;

    api
      .get("/cart")
      .then((res) => {
        if (Array.isArray(res.data.items)) {
          const normalized = res.data.items.map((item) => ({
            id: item.producto_id,
            quantity: item.cantidad,
            price: item.precio_unit,
            ...item,
          }));
          setCartItems(normalized);
        }
      })
      .catch(() => {});
  }, [isReady, token, setCartItems]);

  const addToCart = async (product) => {
    if (!token) return;

    const res = await api.post("/cart/add", {
      producto_id: product.id,
      cantidad: 1,
    });

    if (res.status !== 200) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId) => {
    const res = await api.delete(`/cart/remove/${productId}`);

    if (res.status !== 200) return;

    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    const res = await api.patch("/cart/update", {
      producto_id: productId,
      cantidad: quantity,
    });

    if (res.status !== 200) return;

    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    const res = await api.delete("/cart/clear");

    if (res.status !== 200) return;

    setCartItems([]);
  };

  const total = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) =>
          acc +
          (Number(item.price) || Number(item.precio_unit) || 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  return {
    cartItems,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
