import { usePersistentState } from "./usePersistentState.js";

const ORDERS_STORAGE_KEY = "orders";

export const useOrders = () => {
  const [orders, setOrders] = usePersistentState(ORDERS_STORAGE_KEY, {
    initialValue: [],
  });

  // Guarda una orden REAL (viene del backend)
  const saveOrder = (backendOrder) => {
    const newOrder = {
      id: backendOrder.order_id, // ID REAL
      code: backendOrder.order_code, // código MOA-XXXX
      date: new Date().toISOString(),
      items: backendOrder.items,
      total: backendOrder.total_cents,
      delivery_method: backendOrder.delivery_method,
      payment_method: backendOrder.payment_method,
      notes: backendOrder.notes,
    };

    setOrders((prev) => [...prev, newOrder]);

    return newOrder;
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);

  const clearOrders = () => setOrders([]);

  return { orders, saveOrder, getOrderById, clearOrders };
};
