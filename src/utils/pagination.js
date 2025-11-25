export const paginate = (collection = [], { page = 1, limit = 20 } = {}) => {
  const list = Array.isArray(collection) ? collection : [];

  const safeLimit = Number(limit) || 20;
  const safePage = Math.max(1, Number(page) || 1);
  const offset = (safePage - 1) * safeLimit;

  const items = list.slice(offset, offset + safeLimit);
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    items,
    total,
    totalPages,
    page: {
      index: safePage,
      limit: safeLimit,
      offset,
    },
  };
};
