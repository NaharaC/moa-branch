const CLP_FORMATTER = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatCurrencyCLP(value) {
  if (value === null || value === undefined) return "$0";

  // normaliza strings con espacios
  const raw =
    typeof value === "string" ? value.trim().replace(/\s+/g, "") : value;

  const num = Number(raw);
  if (!Number.isFinite(num)) return "$0";

  // redondeo
  const rounded = Math.round(num);
  return CLP_FORMATTER.format(rounded);
}
