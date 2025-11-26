import { apiClient } from "./api-client.js";
import { API_PATHS } from "../config/api-paths.js";

export const cartsApi = {
  carts: () => apiClient.private.get(API_PATHS.cart.root()),

  add: (producto_id, cantidad = 1) =>
    apiClient.private.post(API_PATHS.cart.add(), {
      producto_id,
      cantidad,
    }),

  remove: (producto_id) =>
    apiClient.private.delete(API_PATHS.cart.remove(producto_id)),

  update: (producto_id, cantidad) =>
    apiClient.private.patch(API_PATHS.cart.update(), {
      producto_id,
      cantidad,
    }),

  clear: () => apiClient.private.delete(API_PATHS.cart.clear()),
};
