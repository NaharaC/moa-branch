import * as React from "react";
import { cn } from "@/utils/cn.js";

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/80 px-4 text-sm text-[var(--color-text)] shadow-[inset_0_1px_1px_rgba(16,14,8,0.05)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]/60 disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

