import { buildProductCategoryPool } from "./productCategory.js";
import { toNum } from "../../../utils/number.js";
import { ALL_CATEGORY_ID } from "../../../config/constants.js";

const s = (v) => (v == null ? "" : String(v));

// Buscar texto en name/description/sku/tags
export const matchesText = (p, text) => {
  if (!text) return true;
  const needle = s(text).toLowerCase();
  const hay = [
    p.name, p.description, p.sku,
    Array.isArray(p.tags) ? p.tags.join(" ") : "",
  ].filter(Boolean).join(" ").toLowerCase();
  return hay.includes(needle);
};

// Comparar producto con categoría (id/slug)
export const createCategoryMatcher = (categories = []) => {
  const SLUG_TO_ID = new Map();
  for (const c of categories) {
    if (c?.slug) SLUG_TO_ID.set(String(c.slug).toLowerCase(), c.id);
  }

  const resolveTarget = (value) => {
    if (value == null || value === ALL_CATEGORY_ID) return null;
    const numeric = toNum(value);
    if (numeric !== null) return numeric;
    const key = s(value).trim().toLowerCase();
    if (!key) return null;
    return SLUG_TO_ID.has(key) ? SLUG_TO_ID.get(key) : null;
  };

  return (product, categoryValue) => {
    if (!categoryValue || categoryValue === ALL_CATEGORY_ID) return true;
    const pool = buildProductCategoryPool(product);
    if (!pool.length) return false;

    const targetId = resolveTarget(categoryValue);
    if (targetId !== null) return pool.some((id) => Number(id) === targetId);

    // Fallback
    const normalized = s(categoryValue).toLowerCase();
    return pool.some((id) => s(id).toLowerCase() === normalized);
  };
};

export const matchesCollection = (p, collectionId) => {
  if (!collectionId) return true;
  const pid = p?.fk_collection_id;
  if (pid == null) return false;
  const target = toNum(collectionId);
  if (target !== null) return Number(pid) === target;
  return s(pid).toLowerCase() === s(collectionId).toLowerCase();
};

export const matchesPrice = (p, minPrice, maxPrice) => {
  const price = Number(p.price ?? 0);
  if (Number.isFinite(minPrice) && price < minPrice) return false;
  if (Number.isFinite(maxPrice) && price > maxPrice) return false;
  return true;
};

export const matchesStatus = (p, status) => {
  if (!status) return true;
  return s(p.status).toLowerCase() === s(status).toLowerCase();
};
