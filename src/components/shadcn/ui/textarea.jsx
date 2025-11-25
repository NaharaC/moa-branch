import * as React from "react";
import { cn } from "@/utils/cn.js";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[120px] w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/80 px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]/60 disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

