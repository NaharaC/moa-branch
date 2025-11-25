export const buildQueryString = (params = {}) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "") continue;
    if (Array.isArray(v)) {
      v.forEach((x) => (x != null && x !== "" ? qs.append(k, x) : null));
    } else {
      qs.append(k, v);
    }
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
};
