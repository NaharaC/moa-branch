import { useCart } from "../modules/cart/hooks/useCart";
import { CartContext } from "./cart-context.js";

export const CartProvider = ({ children }) => {
  const cartState = useCart();
  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
};

// Re-export hook para mantener compatibilidad con imports existentes
// Nota: para usar el hook importa desde "./cart-context.js"
// export { useCartContext } from "./cart-context.js";
