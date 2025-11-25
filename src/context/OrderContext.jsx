import { useOrders } from "../hooks/state/useOrders";
import { OrderContext } from "./order-context.js";

export const OrderProvider = ({ children }) => {
  const orderState = useOrders();
  return (
    <OrderContext.Provider value={orderState}>
      {children}
    </OrderContext.Provider>
  );
};

// Nota: useOrderContext y OrderContext se exportan desde ./order-context.js para respetar fast-refresh
