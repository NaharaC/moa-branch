import React from "react";
import { cx } from "../../utils/ui-helpers.js";
import { BADGE_VARIANTS, BADGE_SIZES } from "../../config/ui-tokens.js";

/* Badge Component  -------------------------------------------------------------------------- */

export function Badge({ 
  children, 
  variant = "primary", 
  size = "md",
  className, 
  ...props 
}) {
  const variantClass = BADGE_VARIANTS[variant] ?? BADGE_VARIANTS.primary;
  const sizeClass = BADGE_SIZES[size] ?? BADGE_SIZES.md;

  return (
    <span
      className={cx(
        "w-fit inline-flex items-center justify-center",
        "rounded-3xl",
        "font-sans font-medium tracking-[1.5871px] uppercase",
        "transition-colors duration-150",
        sizeClass,
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
