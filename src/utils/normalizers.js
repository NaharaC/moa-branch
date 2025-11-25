import { toNum } from "./number.js";
import { ALL_CATEGORY_ID } from "../config/constants.js";

export const normalizeProduct = (p = {}) => {
  const id = p.id ?? null;
  const name = p.name ?? ""; 
  const slug = p.slug != null ? String(p.slug) : null;
  const sku = p.sku ?? null;

  const price = toNum(p.price);
  const compareAtPrice = toNum(p.compareAtPrice);

  const imgUrl = p.imgUrl ?? null;
  const gallery = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : (imgUrl ? [imgUrl] : []);

  const stock = toNum(p.stock);
  const stockSafe = stock ?? 0;

  const badge = Array.isArray(p.badge) ? p.badge : (p.badge ? [p.badge] : []);
  const tags = Array.isArray(p.tags)
    ? p.tags
    : typeof p.tags === "string"
    ? p.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const material = p.material ?? (Array.isArray(p.materials) ? p.materials[0] : null);
  const materials = Array.isArray(p.materials) ? p.materials : (material ? [material] : []);

  const status = p.status ?? (stockSafe > 0 ? "activo" : "sin_stock");

  return {
    id,
    name,
    slug,
    sku,
    price,
    compareAtPrice,
    stock: stockSafe,
    description: p.description ?? "",
    imgUrl,
    gallery,
    badge,
    status,
    tags,
    material,
    materials,
    color: p.color ?? null,
    dimensions: p.dimensions ?? null,
    weight: p.weight ?? null,
    specs: p.specs ?? null,
    createdAt: p.createdAt ?? null,
    updatedAt: p.updatedAt ?? null,
    fk_category_id: p.fk_category_id ?? null,
    fk_collection_id: p.fk_collection_id ?? null,
    collection: p.collection ?? null,
  };
};

export const normalizeCategory = (category = {}) => ({
  id: category.id ?? null,
  slug: category.slug ?? null,
  name: category.name ?? category.title ?? "",
  parentId: category.parentId ?? null,
  description: category.description ?? "",
  coverImage: category.coverImage ?? null,
});

export const normalizeCategoryList = (payload) => {
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
  return list.map(normalizeCategory);
};

const normalizeCategoryId = (category, index) =>
  String(category?.id ?? category?.slug ?? `category-${index}`);

const normalizeCategoryName = (category, index, fallback = "Categoría") =>
  category?.name ?? category?.title ?? `${fallback} ${index + 1}`;

export const normalizeCategoryMenuItems = (categories, { includeAll = true, allItem } = {}) => {
  const source = Array.isArray(categories) ? categories : [];
  const rootCategories = source.filter(
    (category) => category && (category.parentId === null || category.parentId === undefined),
  );

  const normalized = rootCategories.map((category, index) => ({
    id: normalizeCategoryId(category, index),
    name: normalizeCategoryName(category, index, "Categoría"),
    slug: category?.slug ?? null,
    raw: category,
  }));

  if (!includeAll) return normalized;

  const fallback = allItem ?? { id: ALL_CATEGORY_ID, name: "Todos", slug: ALL_CATEGORY_ID, raw: null };
  const hasAll = normalized.some((category) => String(category.id) === String(fallback.id));
  return hasAll ? normalized : [fallback, ...normalized];
};

export const normalizeCategoryFilterOptions = (
  categories = [],
  { includeAll = true, allId = ALL_CATEGORY_ID, allLabel = "Todas" } = {},
) => {
  const base = Array.isArray(categories) ? categories : [];
  const mapped = base
    .map((cat, index) => {
      if (!cat) return null;
      if (typeof cat === "string") {
        const id = cat || `cat-${index}`;
        return { id, name: cat || `Categoría ${index + 1}` };
      }
      const id = normalizeCategoryId(cat, index);
      const name = normalizeCategoryName(cat, index, "Categoría");
      return { id, name };
    })
    .filter(Boolean);

  if (!includeAll) return mapped.length ? mapped : [];

  const hasAll = mapped.some((cat) => String(cat.id) === String(allId));
  const allOption = { id: allId, name: allLabel };
  const normalized = hasAll ? mapped : [allOption, ...mapped];
  return normalized.length ? normalized : [allOption];
};

const resolveTabValue = (category, index) => {
  if (category.raw?.id !== undefined && category.raw?.id !== null) return category.raw.id;
  if (category.raw?.slug) return category.raw.slug;
  if (category.slug) return category.slug;
  return category.id ?? `category-${index}`;
};

export const buildCategoryTabs = (categories) =>
  normalizeCategoryMenuItems(categories).map((category, index) => ({
    id: category.id ?? `category-${index}`,
    label: category.name,
    value: resolveTabValue(category, index),
  }));

export const normalizeFeaturedProduct = (product = {}, index = 0, { fallbackPrice = 50000 } = {}) => {
  const normalized = normalizeProduct(product);
  const resolvedId = normalized.id ?? product?.id ?? product?.slug ?? `featured-${index}`;
  const resolvedName = normalized.name || product?.slug || `Producto ${index + 1}`;
  const galleryImage = normalized.gallery?.[0] ?? product?.imgUrl ?? product?.image ?? null;
  const resolvedPrice = normalized.price ?? toNum(product?.price) ?? fallbackPrice;

  return {
    ...normalized,
    id: resolvedId,
    name: resolvedName,
    imgUrl: normalized.imgUrl ?? galleryImage,
    price: resolvedPrice,
  };
};

export const buildCategoriesWithAll = (
  fetchedCategories = [],
  { id = ALL_CATEGORY_ID, name = "Todos" } = {},
) => {
  const base = Array.isArray(fetchedCategories) ? fetchedCategories.filter(Boolean) : [];
  const hasAll = base.some((category) => category && String(category.id) === String(id));
  if (hasAll) return base;
  return [{ id, name, slug: id }, ...base];
};
