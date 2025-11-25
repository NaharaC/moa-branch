import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { cx } from "../../../utils/ui-helpers.js";

export function DropdownMenu({ children }) {
  return <Dropdown.Root>{children}</Dropdown.Root>;
}

export function DropdownMenuTrigger({ children, asChild = true }) {
  return (
    <Dropdown.Trigger asChild={asChild}>
      {children}
    </Dropdown.Trigger>
  );
}

export function DropdownMenuContent({ children, align = "end", className }) {
  return (
    <Dropdown.Portal>
      <Dropdown.Content align={align} sideOffset={6} className={cx(
        "z-50 min-w-[160px] rounded-2xl border border-(--color-border) bg-white p-1.5 shadow-xl",
        className
      )}>
        {children}
      </Dropdown.Content>
    </Dropdown.Portal>
  );
}

export function DropdownMenuItem({ children, onSelect, inset, className }) {
  return (
    <Dropdown.Item
      onSelect={onSelect}
      className={cx(
        "flex cursor-pointer select-none items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm text-(--color-text) outline-none hover:bg-(--color-neutral1)",
        inset && "pl-7",
        className
      )}
    >
      {children}
    </Dropdown.Item>
  );
}

export function DropdownMenuSeparator() {
  return <Dropdown.Separator className="my-1 h-px bg-(--color-border)" />;
}
