import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cx } from "../../../utils/ui-helpers.js";

export function Dialog({ children, open, onOpenChange }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogTrigger({ children, asChild = true }) {
  return <DialogPrimitive.Trigger asChild={asChild}>{children}</DialogPrimitive.Trigger>;
}

export function DialogContent({ children, className, variant = "center", placement = "right", showClose = true }) {
  const isDrawer = variant === "drawer";
  
  const drawerPositionClasses = {
    right: "right-0 top-0 h-full translate-x-0",
    left: "left-0 top-0 h-full translate-x-0",
    top: "top-0 left-0 w-full translate-y-0",
    bottom: "bottom-0 left-0 w-full translate-y-0",
  };

  const contentClasses = isDrawer
    ? cx(
        "fixed z-50 bg-white shadow-2xl",
        drawerPositionClasses[placement] || drawerPositionClasses.right,
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        placement === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        placement === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        placement === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        placement === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        className
      )
    : cx(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-(--color-border) bg-white p-5 shadow-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      );

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-(--overlay-dark) data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content className={contentClasses}>
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 text-(--color-text-muted) opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-(--color-primary1) focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ title, description }) {
  return (
    <div className="mb-3">
      {title && <h3 className="text-lg font-semibold text-(--color-primary1)">{title}</h3>}
      {description && <p className="text-sm text-(--color-secondary2)">{description}</p>}
    </div>
  );
}

export function DialogClose({ children, asChild = true, className }) {
  if (asChild) {
    return <DialogPrimitive.Close asChild>{children}</DialogPrimitive.Close>;
  }

  return (
    <DialogPrimitive.Close
      className={cx(
        "inline-flex h-9 items-center justify-center rounded-full border border-(--color-border) px-4 text-sm font-medium text-(--color-primary1) transition hover:border-(--color-primary1) hover:text-(--color-primary1) focus:outline-none focus:ring-2 focus:ring-(--color-primary1)/40 focus:ring-offset-2",
        className,
      )}
    >
      {children}
    </DialogPrimitive.Close>
  );
}
