import { useEffect, useMemo } from "react";
import { usePersistentState } from "../../../hooks/usePersistentState.js";
import { useAuth } from "../../../context/auth-context.js";
import { cartsApi } from "@/services/carts.api.js";

const CART_STORAGE_KEY = "cart";

export const useCart = () => {
  const { token, isReady } = useAuth();

  const [cartItems, setCartItems] = usePersistentState(CART_STORAGE_KEY, {
    initialValue: [],
  });

  useEffect(() => {
    if (!isReady || !token) return;

    cartsApi
      .carts()
      .then((res) => {
        const items = res?.items || res?.data?.items || [];

        if (Array.isArray(items)) {
          const normalized = items.map((item) => ({
            id: item.producto_id,
            quantity: item.cantidad,
            price: item.precio_unit,
            ...item,
          }));
          setCartItems(normalized);
        }
      })
      .catch((err) => {
        console.error("Error cargando carrito:", err);
      });
  }, [isReady, token, setCartItems]);

  // -----------------------------------
  // ADD TO CART
  // -----------------------------------
  const addToCart = async (product) => {
    if (!token) return;

    await cartsApi.add(product.id, 1);

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

  // -----------------------------------
  // REMOVE FROM CART
  // -----------------------------------
  const removeFromCart = async (productId) => {
    await cartsApi.remove(productId); // si falla, lanza error

    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // -----------------------------------
  // UPDATE QUANTITY
  // -----------------------------------
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    const res = await cartsApi.update(productId, quantity);

    if (res?.status !== 200) return;

    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  // -----------------------------------
  // CLEAR CART
  // -----------------------------------
  const clearCart = async () => {
    const res = await cartsApi.clear();

    if (res?.status !== 200) return;

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
