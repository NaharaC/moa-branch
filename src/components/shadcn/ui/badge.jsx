import * as React from "react";
import { cn } from "@/utils/cn.js";

const variantClasses = {
  default: "bg-[var(--color-primary4)] text-[var(--color-primary1)]",
  outline: "border border-[var(--border)] text-[var(--color-text-secondary)]",
  neutral: "bg-[var(--color-neutral3)] text-[var(--color-text)]",
  accent: "bg-[var(--color-primary1)] text-[var(--color-text-on-dark)]",
};

export const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
      variantClasses[variant] ?? variantClasses.default,
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

