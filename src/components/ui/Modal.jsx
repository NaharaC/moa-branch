import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export function Modal({
  open,
  onClose,
  title,
  children,
  placement = "center",
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  headerClassName,
  bodyClassName,
  footer,
}) {
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Smooth enter animation
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (panel) {
      const baseTransition = "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out";
      panel.style.transition = baseTransition;
      panel.style.opacity = 0;
      if (placement === "right") {
        panel.style.transform = "translateX(24px)";
      } else {
        panel.style.transform = "translateY(8px) scale(0.98)";
      }
      requestAnimationFrame(() => {
        panel.style.opacity = 1;
        panel.style.transform = "translateX(0) translateY(0) scale(1)";
      });
    }
    if (overlay) {
      overlay.style.transition = "opacity 200ms ease-out";
      overlay.style.opacity = 0;
      requestAnimationFrame(() => {
        overlay.style.opacity = 1;
      });
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, placement]);

  if (!open) return null;

  const containerClass =
    placement === "right"
      ? "fixed inset-0 z-50 flex"
      : "fixed inset-0 z-50 flex items-center justify-center";

  const panelBase = "relative bg-white shadow-2xl focus:outline-none";
  const sizeClassesByPlacement =
    placement === "right"
      ? "ml-auto h-full w-full max-w-[520px]"
      : size === "sm"
      ? "w-full max-w-md rounded-2xl"
      : size === "lg"
      ? "w-full max-w-3xl rounded-2xl"
      : "w-full max-w-xl rounded-2xl";

  const panelClasses = twMerge(panelBase, sizeClassesByPlacement, className);

  const handleOverlayClick = () => {
    if (!closeOnOverlayClick) return;
    onClose?.();
  };

  const handlePanelClick = (event) => event.stopPropagation();

  return (
    <div className={containerClass} aria-modal="true" role="dialog">
      <div ref={overlayRef} className="absolute inset-0 bg-black/20" onClick={handleOverlayClick} />
      <div ref={panelRef} className={panelClasses} onClick={handlePanelClick}>
        {(title || showCloseButton) && (
          <div
            className={twMerge(
              "flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3",
              headerClassName,
            )}
          >
            <div className="min-w-0">
              {typeof title === "string" ? (
                <h2 className="truncate text-base font-semibold">{title}</h2>
              ) : (
                title
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-xs text-neutral-600 hover:bg-neutral-50"
                aria-label="Cerrar"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div
          className={twMerge(
            "hide-scrollbar max-h-[calc(100vh-8rem)] overflow-y-auto px-4 py-3",
            placement === "right" && "h-full max-h-full",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer && <div className="border-t border-neutral-100 px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}
