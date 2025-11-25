import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cx } from "../../../utils/ui-helpers.js";

export function Popover({ children, open, onOpenChange }) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </PopoverPrimitive.Root>
  );
}

export function PopoverTrigger({ children, asChild = true }) {
  return <PopoverPrimitive.Trigger asChild={asChild}>{children}</PopoverPrimitive.Trigger>;
}

export function PopoverContent({ children, align = "end", className }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content sideOffset={8} align={align} className={cx(
        "z-50 w-72 rounded-2xl border border-(--color-border) bg-white p-3 shadow-xl",
        className
      )}>
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
