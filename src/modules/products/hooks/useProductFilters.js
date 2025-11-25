import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ALL_CATEGORY_ID, DEFAULT_PAGE_SIZE } from "../../../config/constants.js";
import { ensureNumber } from "../../../utils/number.js";
import { clamp } from "../../../utils/math.js";
import { formatCurrencyCLP } from "../../../utils/currency.js";
import { buildCategoriesWithAll } from "../../../utils/normalizers.js";
import { createCategoryMatcher, resolveProductPrice } from "../utils/products.js";

const resolveCategoryFromQuery = (categoryQuery, categories) => {
  if (!categoryQuery) return ALL_CATEGORY_ID;
  if (String(categoryQuery).toLowerCase() === String(ALL_CATEGORY_ID)) {
    return ALL_CATEGORY_ID;
  }

  const match = categories.find((cat) => {
    if (!cat) return false;
    if (cat.slug && String(cat.slug).toLowerCase() === String(categoryQuery).toLowerCase()) {
      return true;
    }
    return String(cat.id) === String(categoryQuery);
  });

  if (match?.id !== undefined && match?.id !== null) {
    return match.id;
  }

  const numeric = Number(categoryQuery);
  return Number.isFinite(numeric) ? numeric : ALL_CATEGORY_ID;
};

const buildPriceBounds = (products = []) => {
  const validPrices = products
    .map((product) => resolveProductPrice(product))
    .filter((value) => Number.isFinite(value));

  if (!validPrices.length) return { minPrice: 0, maxPrice: 0 };
  return {
    minPrice: Math.min(...validPrices),
    maxPrice: Math.max(...validPrices),
  };
};

export const useProductFilters = ({
  products: fetchedProducts = [],
  categories: fetchedCategories = [],
  sort: selectedSort = "relevance",
  itemsPerPage: selectedPageSize = DEFAULT_PAGE_SIZE,
  defaultPageSize = DEFAULT_PAGE_SIZE,
} = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(ALL_CATEGORY_ID);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => buildCategoriesWithAll(fetchedCategories), [fetchedCategories]);
  const matchCategory = useMemo(() => createCategoryMatcher(categories), [categories]);
  const allProducts = useMemo(
    () => (Array.isArray(fetchedProducts) && fetchedProducts.length ? fetchedProducts : []),
    [fetchedProducts],
  );

  const { minPrice, maxPrice } = useMemo(() => buildPriceBounds(allProducts), [allProducts]);
  const categoryQuery = searchParams.get("category");
  const searchParamsSnapshot = searchParams.toString();

  const resolvedCategoryFromQuery = useMemo(
    () => resolveCategoryFromQuery(categoryQuery, categories),
    [categoryQuery, categories],
  );

  useEffect(() => {
    if (resolvedCategoryFromQuery === undefined || resolvedCategoryFromQuery === null) return;
    setCategory((prev) => (prev === resolvedCategoryFromQuery ? prev : resolvedCategoryFromQuery));
  }, [resolvedCategoryFromQuery]);

  useEffect(() => {
    setMin(minPrice);
    setMax(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, min, max, selectedSort, setCurrentPage]);

  useEffect(() => {
    const nextParam =
      category === ALL_CATEGORY_ID
        ? null
        : (() => {
            const active = categories.find(
              (cat) => String(cat.id) === String(category),
            );
            if (active?.slug) return active.slug;
            return String(category);
          })();
    const normalizedCurrent = categoryQuery ?? null;
    if ((nextParam ?? null) === normalizedCurrent) return;

    const nextSearchParams = new URLSearchParams(searchParamsSnapshot);
    if (nextParam === null) {
      nextSearchParams.delete("category");
    } else {
      nextSearchParams.set("category", nextParam);
    }
    setSearchParams(nextSearchParams, { replace: true });
  }, [category, categories, categoryQuery, searchParamsSnapshot, setSearchParams]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const price = resolveProductPrice(product) ?? 0;
      const safeMin = ensureNumber(min, minPrice);
      const safeMax = ensureNumber(max, maxPrice);
      const withinPriceRange = price >= safeMin && price <= safeMax;
      const matchesCat = matchCategory(product, category);
      return withinPriceRange && matchesCat;
    });
  }, [allProducts, category, min, max, minPrice, maxPrice, matchCategory]);

  const sortedProducts = useMemo(() => {
    if (selectedSort === "relevance") return filteredProducts;
    const copy = [...filteredProducts];
    if (selectedSort === "price-asc") {
      return copy.sort(
        (a, b) => (resolveProductPrice(a) ?? 0) - (resolveProductPrice(b) ?? 0),
      );
    }
    if (selectedSort === "price-desc") {
      return copy.sort(
        (a, b) => (resolveProductPrice(b) ?? 0) - (resolveProductPrice(a) ?? 0),
      );
    }
    if (selectedSort === "name-asc") {
      return copy.sort((a, b) => (a.name ?? a.slug ?? "").localeCompare(b.name ?? b.slug ?? ""));
    }
    return copy;
  }, [filteredProducts, selectedSort]);

  const totalResults = sortedProducts.length;
  const paginationInfo = useMemo(() => {
    const safeLimit = Math.max(
      1,
      ensureNumber(selectedPageSize ?? defaultPageSize, DEFAULT_PAGE_SIZE),
    );
    const totalItems = totalResults;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const safePage = clamp(ensureNumber(currentPage, 1), 1, totalPages);
    const startIndex = (safePage - 1) * safeLimit;
    const endIndex = Math.min(startIndex + safeLimit, totalItems);

    return {
      items: sortedProducts.slice(startIndex, endIndex),
      page: safePage,
      totalPages,
      totalItems,
      pageSize: safeLimit,
      start: totalItems === 0 ? 0 : startIndex + 1,
      end: endIndex,
    };
  }, [sortedProducts, currentPage, selectedPageSize, defaultPageSize, totalResults]);

  const handleChangePrice = ({ min: nextMin, max: nextMax }) => {
    setMin(ensureNumber(nextMin, minPrice));
    setMax(ensureNumber(nextMax, maxPrice));
  };

  const handleRemoveFilter = (type) => {
    if (type === "category") setCategory(ALL_CATEGORY_ID);
    if (type === "min") setMin(minPrice);
    if (type === "max") setMax(maxPrice);
  };

  const resetFilters = () => {
    setCategory(ALL_CATEGORY_ID);
    setMin(minPrice);
    setMax(maxPrice);
    setCurrentPage(1);
  };

  const activeCategory = useMemo(() => {
    if (category === ALL_CATEGORY_ID) return null;
    return categories.find(
      (cat) => cat.id === category || String(cat.id) === String(category),
    );
  }, [category, categories]);

  const appliedFilters = [
    activeCategory ? { label: activeCategory.name, type: "category" } : null,
    min > minPrice ? { label: `Desde ${formatCurrencyCLP(min)}`, type: "min" } : null,
    max < maxPrice ? { label: `Hasta ${formatCurrencyCLP(max)}`, type: "max" } : null,
  ].filter(Boolean);

  return {
    categories,
    filters: { category, min, max },
    limits: { min: minPrice, max: maxPrice },
    appliedFilters,
    paginationInfo,
    paginatedProducts: paginationInfo.items,
    currentPage: paginationInfo.page,
    setCurrentPage,
    onChangeCategory: setCategory,
    onChangePrice: handleChangePrice,
    handleRemoveFilter,
    resetFilters,
    totalResults,
  };
};
