import * as React from "react";
import { cn } from "@/utils/cn.js";

export const Label = React.forwardRef(({ className, required = false, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-[var(--color-error)]">*</span>}
  </label>
));
Label.displayName = "Label";

