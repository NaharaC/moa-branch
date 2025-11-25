import React from "react";
import ReactDOM from "react-dom";
import { cx } from "../../utils/ui-helpers.js";


const VARIANT_CLASSES = {
  neutral: "bg-[color:var(--color-dark)] text-[color:var(--color-text-on-dark)]",
  primary: "bg-[color:var(--color-primary1)] text-[color:var(--color-lightest2)]",
  soft: "bg-[color:var(--color-neutral4)] text-[color:var(--color-text)]", 
};

export function Tooltip({
  label,           
  children,  
  position = "right", 
  variant = "neutral", 
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef(null);

  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral;
  const tooltipId = React.useId();
  const isValidElement = React.isValidElement(children);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
        break;
      case "right":
      default:
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
        break;
    }

    setCoords({ top, left });
  }, [position]);

  const handleMouseEnter = React.useCallback(() => {
    setIsVisible(true);
    updatePosition();
  }, [updatePosition]);

  const handleMouseLeave = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleFocus = React.useCallback(() => {
    setIsVisible(true);
    updatePosition();
  }, [updatePosition]);

  const handleBlur = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  React.useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible, updatePosition]);

  const trigger = isValidElement
    ? React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        "aria-describedby": cx(children.props?.["aria-describedby"], tooltipId),
      })
    : children;

  const tooltipContent = isVisible && typeof document !== "undefined" ? ReactDOM.createPortal(
    <span
      id={tooltipId}
      role="tooltip"
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        transform: position === "top" || position === "bottom" ? "translateX(-50%)" : position === "left" ? "translate(-100%, -50%)" : "translateY(-50%)",
      }}
      className={cx(
        "pointer-events-none z-[var(--z-tooltip)] whitespace-nowrap",
        "rounded-md px-3 py-2 text-[0.75rem] leading-snug shadow-lg",
        "opacity-0 invisible",
        "transition-all duration-150 ease-out",
        isVisible && "opacity-100 visible",
        variantClass,
      )}
    >
      {label}
    </span>,
    document.body
  ) : null;

  return (
    <>
      {trigger}
      {tooltipContent}
    </>
  );
}


export const TooltipNeutral = (props) => (
  <Tooltip {...props} variant="neutral" />
);

export const TooltipPrimary = (props) => (
  <Tooltip {...props} variant="primary" />
);

export const TooltipSoft = (props) => (
  <Tooltip {...props} variant="soft" />
);
