import { usePersistentState } from "./usePersistentState.js";

const ORDERS_STORAGE_KEY = "orders";

export const useOrders = () => {
  const [orders, setOrders] = usePersistentState(ORDERS_STORAGE_KEY, {
    initialValue: [],
  });

  // Crear  nueva orden
  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(), // ID único (temporal)
      date: new Date().toISOString(),
      ...orderData, // { productos, total, etc. }
    };

    setOrders((prev) => [...prev, newOrder]);

    return newOrder;
  };

  // Obtener una orden específica
  const getOrderById = (id) => orders.find((o) => o.id === id);

  // Borrar  órdenes
  const clearOrders = () => {
    setOrders([]);
  };

  return { orders, createOrder, getOrderById, clearOrders };
};
