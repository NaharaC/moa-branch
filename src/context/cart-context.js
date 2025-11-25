import { createStrictContext } from "./createStrictContext.js";

export const [CartContext, useCartContext] = createStrictContext("Cart", {
  displayName: "CartContext",
  errorMessage: "useCartContext debe usarse dentro de CartProvider",
});
