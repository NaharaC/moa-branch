const CATEGORY_VALUE_KEYS = ["fk_category_id"];

export const buildProductCategoryPool = (product) => {
  const pool = [];
  CATEGORY_VALUE_KEYS.forEach((key) => {
    const val = product?.[key];
    if (val !== undefined && val !== null) pool.push(val);
  });
  return pool;
};