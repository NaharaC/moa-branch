const s = (v) => (v == null ? "" : String(v));

export const PRODUCT_SORT_KEYS = ["price", "name", "createdAt", "updatedAt", "stock", "status"];
export const PRODUCT_SORT_DIRS = ["asc", "desc"];

export const sortProducts = (arr, sortBy = "updatedAt", sortDir = "desc") => {
  if (!PRODUCT_SORT_KEYS.includes(sortBy)) return arr;
  const dir = PRODUCT_SORT_DIRS.includes(sortDir) ? sortDir : "desc";
  const copy = [...arr];

  return copy.sort((a, b) => {
    const av = a?.[sortBy];
    const bv = b?.[sortBy];

    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      const na = new Date(av ?? 0).getTime();
      const nb = new Date(bv ?? 0).getTime();
      return dir === "asc" ? na - nb : nb - na;
    }
    if (sortBy === "price" || sortBy === "stock") {
      const na = Number(av ?? 0);
      const nb = Number(bv ?? 0);
      return dir === "asc" ? na - nb : nb - na;
    }
    const cmp = s(av).localeCompare(s(bv)); // strings: name, status, sku
    return dir === "asc" ? cmp : -cmp;
  });
};
