import React from "react";
import clsx from "clsx";
import { PILL_STYLES } from "../../config/ui-tokens.js";

// Pill ---------------------------------------------------
export function Pill({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        PILL_STYLES[variant] ?? PILL_STYLES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

export default Pill;
