import { createStrictContext } from "./createStrictContext.js";

export const [OrderContext, useOrderContext] = createStrictContext("Order", {
  displayName: "OrderContext",
  errorMessage: "useOrderContext debe usarse dentro de OrderProvider",
});
