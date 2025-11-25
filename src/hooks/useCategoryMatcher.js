import { useMemo } from "react";
import { createCategoryMatcher } from "../modules/products/utils/productsFilter.js";

/** Usa la misma lista de categorías a menos que haya un cambio
 * @param {Array} categories - Lista de categorías normalizadas (de productsApi.listCategories)
 * @returns {(product: object, categoryValue: string|number) => boolean}
 */

export const useCategoryMatcher = (categories = []) => {
  const matcher = useMemo(() => createCategoryMatcher(categories), [categories]);
  return matcher;
};
