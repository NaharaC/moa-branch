import { env } from "../config/env.js";
import { apiClient } from "./api-client.js";

const mockOrdersApi = {
  async list() {
    return { items: [] };
  },

  async create(payload = {}) {
    return { ok: true, mock: true, payload };
  },

  async me() {
    return { items: [] };
  },
};

const remoteOrdersApi = {
  async create(payload) {
    const data = await apiClient.private.post("/orders", payload);
    return data;
  },

  async me() {
    const data = await apiClient.private.get("/orders/mine");
    return { items: Array.isArray(data) ? data : [] };
  },

  async list() {
    return await remoteOrdersApi.me();
  },
};

export const ordersApi = env.USE_MOCKS ? mockOrdersApi : remoteOrdersApi;
