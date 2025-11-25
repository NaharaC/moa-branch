import { PRODUCTS, CATEGORIES, contentDb } from "../database/index.js";
import { delay } from "../../utils/delay.js";
import { normalizeCategory } from "../../utils/normalizers.js";

const catalogDb = {
  categories: CATEGORIES.map(normalizeCategory),
  products: PRODUCTS,
};

const pickCategories = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return catalogDb.categories
      .filter((category) => category.parentId === null)
      .slice(0, 6)
      .map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        coverImage: category.coverImage,
      }));
  }

  const mapped = ids
    .map((categoryId) => {
      const item = catalogDb.categories.find(
        (category) => category.id === categoryId
      );
      if (!item) return null;
      return {
        id: item.id,
        slug: item.slug,
        name: item.name,
        coverImage: item.coverImage,
      };
    })
    .filter(Boolean);

  if (mapped.length) return mapped;
  return pickCategories([]);
};

const resolveCategoryId = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const stringValue = String(value).trim();
  if (!stringValue) return null;
  const numeric = Number(stringValue);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  const match = catalogDb.categories.find(
    (category) =>
      category.slug === stringValue || String(category.id) === stringValue
  );
  return match ? match.id : null;
};

const normalizeCategoryIds = (ids) => {
  const normalized = [];
  const seen = new Set();
  if (!Array.isArray(ids)) return normalized;
  ids.forEach((item) => {
    const resolved = resolveCategoryId(item);
    if (resolved === null || seen.has(resolved)) return;
    seen.add(resolved);
    normalized.push(resolved);
  });
  return normalized;
};

const buildFallbackProducts = (ids) => {
  if (!Array.isArray(ids)) return [];
  return ids
    .map((productId) =>
      catalogDb.products.find((product) => product.id === productId)
    )
    .filter(Boolean);
};

const PRODUCTS_PER_CATEGORY = 4;

const pickProducts = ({
  categoryIds,
  productIds,
  perCategoryLimit = PRODUCTS_PER_CATEGORY,
} = {}) => {
  const limit =
    Number.isFinite(Number(perCategoryLimit)) && Number(perCategoryLimit) > 0
      ? Number(perCategoryLimit)
      : PRODUCTS_PER_CATEGORY;
  const categories = normalizeCategoryIds(categoryIds);
  const fallbackProducts = buildFallbackProducts(productIds);
  const seenProducts = new Set();
  const perCategoryCount = new Map();
  const selected = [];

  const addProduct = (product) => {
    if (!product) return false;
    if (seenProducts.has(product.id)) return false;
    const categoryId = product?.fk_category_id;
    if (categoryId === undefined || categoryId === null) return false;
    const currentCount = perCategoryCount.get(categoryId) ?? 0;
    if (currentCount >= limit) return false;
    seenProducts.add(product.id);
    perCategoryCount.set(categoryId, currentCount + 1);
    selected.push(product);
    return true;
  };

  const fillCategory = (categoryId) => {
    fallbackProducts.forEach((product) => {
      if (product.fk_category_id === categoryId) {
        addProduct(product);
      }
    });

    if ((perCategoryCount.get(categoryId) ?? 0) >= limit) return;

    for (const product of catalogDb.products) {
      if (product.fk_category_id !== categoryId) continue;
      addProduct(product);
      if ((perCategoryCount.get(categoryId) ?? 0) >= limit) break;
    }
  };

  categories.forEach(fillCategory);

  fallbackProducts.forEach(addProduct);

  if (!selected.length) {
    const fallbackSource =
      fallbackProducts.length > 0
        ? fallbackProducts
        : catalogDb.products.slice(0, limit);
    fallbackSource.forEach(addProduct);
  }

  return selected;
};

export const mockHomeApi = {
  async getLanding() {
    await delay();
    const home = contentDb.home;

    return {
      categories: pickCategories(home.featuredCategoryIds),
      featuredProducts: pickProducts({
        categoryIds: home.featuredCategoryIds,
        productIds: home.featuredProductIds,
      }),
      editorialSections: home.editorialSections ?? [],
      testimonials: home.testimonials ?? [],
      contact: home.contact ?? null,
    };
  },
};
