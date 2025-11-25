import { formatCurrencyCLP } from "../../utils/currency.js";

export const Price = ({
  value,
  currency = "CLP",
  locale = "es-CL",
  className = "",
}) => {
  const safeNumber = Number.isFinite(Number(value)) ? Number(value) : 0;

  const formatted =
    currency === "CLP"
      ? formatCurrencyCLP(safeNumber)
      : new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
        }).format(safeNumber);

  return (
    <span className={["price", className].filter(Boolean).join(" ")}>
      {formatted}
    </span>
  );
};
