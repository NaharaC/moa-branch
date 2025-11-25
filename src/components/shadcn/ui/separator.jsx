import * as React from "react";
import { cn } from "@/utils/cn.js";

export const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <div
    ref={ref}
    role={decorative ? "none" : "separator"}
    aria-orientation={orientation === "vertical" ? "vertical" : "horizontal"}
    className={cn(
      "shrink-0 bg-[var(--border)]/80",
      orientation === "vertical" ? "w-px" : "h-px",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

