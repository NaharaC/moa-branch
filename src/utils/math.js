export const clamp = (value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) =>
  Math.min(Math.max(value, min), max);
