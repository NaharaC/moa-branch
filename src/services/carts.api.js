import { apiClient } from "./api-client.js";
import { API_PATHS } from "../config/api-paths.js";

export const cartsApi = {
  // GET
  carts: async () => {
    const res = await apiClient.private.get(API_PATHS.cart.root());
    return res?.data ?? res;
  },
};
