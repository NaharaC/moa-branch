import { env } from "../config/env.js";
import { API_PATHS } from "../config/api-paths.js";
import { mockCatalogApi } from "../mocks/api/products.js";
import { apiClient } from "./api-client.js";
import {
  normalizeCategoryList,
  normalizeProduct,
} from "../utils/normalizers.js";
import { buildQueryString } from "../utils/https.js";

const normalizeListResponse = (payload = {}) => {
  const src = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.products)
      ? payload.products
      : [];
  const items = src.map(normalizeProduct);
  const total = Number.isFinite(payload.total) ? payload.total : items.length;

  const page =
    payload.page && typeof payload.page === "object"
      ? {
          offset: Number.isFinite(Number(payload.page.offset))
            ? Number(payload.page.offset)
            : 0,
          limit: Number.isFinite(Number(payload.page.limit))
            ? Number(payload.page.limit)
            : items.length,
        }
      : { offset: 0, limit: items.length };

  return { items, total, page };
};

const remoteProductsApi = {
  async list(params = {}) {
    const query = buildQueryString(params);
    const data = await apiClient.public.get(
      `${API_PATHS.products.products}${query}`
    );
    return normalizeListResponse(data);
  },
  async getById(id) {
    if (id == null) throw new Error("product id is required");
    const data = await apiClient.public.get(
      API_PATHS.products.productDetail(id)
    );
    return normalizeProduct(data);
  },
  async listCategories(params = {}) {
    const query = buildQueryString(params);
    const data = await apiClient.public.get(
      `${API_PATHS.products.categories}${query}`
    );
    return normalizeCategoryList(data);
  },
  async create(payload = {}) {
    const data = await apiClient.private.post(
      API_PATHS.products.products,
      payload
    );
    return normalizeProduct(data);
  },

  async update(id, patch = {}) {
    if (id == null) throw new Error("product id is required");
    const data = await apiClient.private.put(
      API_PATHS.admin.productsDetail(id),
      patch
    );
    return normalizeProduct(data);
  },

  async remove(id) {
    if (id == null) throw new Error("product id is required");
    const data = await apiClient.private.delete(
      API_PATHS.admin.productsDetail(id)
    );
    return { ok: true, removedId: id, ...(data || {}) };
  },
};

const mockProductsApi = {
  async list(params = {}) {
    const data = await mockCatalogApi.list(params);
    return normalizeListResponse(data);
  },
  async getById(id) {
    if (id == null) throw new Error("product id is required");
    const data = await mockCatalogApi.getById(id);
    return normalizeProduct(data);
  },
  async listCategories(params = {}) {
    const data = await mockCatalogApi.listCategories(params);
    return normalizeCategoryList(data);
  },
  async create(payload = {}) {
    const data = await mockCatalogApi.create(payload);
    return normalizeProduct(data);
  },
  async update(id, patch = {}) {
    if (id == null) throw new Error("product id is required");
    const data = await mockCatalogApi.update(id, patch);
    return normalizeProduct(data);
  },
  async remove(id) {
    if (id == null) throw new Error("product id is required");
    const data = await mockCatalogApi.remove(id);
    return { ok: true, removedId: data?.removedId ?? id };
  },
};

export const productsApi = env.USE_MOCKS ? mockProductsApi : remoteProductsApi;
