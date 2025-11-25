// toNum > convierte a num válido o null
export const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ensureNumber > para fallback en una sola línea
export function ensureNumber(value, fallback) {
  const n = toNum(value);
  return n !== null ? n : fallback;
}