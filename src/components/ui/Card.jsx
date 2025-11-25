import React from "react";
import { cx } from "../../utils/ui-helpers.js";

/* -------------------------------------------------------------------------- */
/* Card Component - Tarjeta reutilizable con variantes                       */
/* -------------------------------------------------------------------------- */

const VARIANT_CLASSES = {
  elevated: cx(
    "bg-[color:var(--color-neutral2)]",
    "shadow-[var(--shadow-md)]",
    "border border-transparent"
  ),
  flat: cx(
    "bg-[color:var(--color-neutral2)]",
    "shadow-none",
    "border border-transparent"
  ),
  outlined: cx(
    "bg-[color:var(--color-neutral2)]",
    "shadow-none",
    "border border-[color:var(--color-neutral3)]"
  ),
  ghost: cx(
    "bg-transparent",
    "shadow-none",
    "border border-[color:var(--color-neutral3)]"
  ),
};

const PADDING_CLASSES = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

/**
 * Card - Componente de tarjeta reutilizable
 * 
 * @param {React.ReactNode} children - Contenido de la tarjeta
 * @param {string} variant - Variante visual: elevated, flat, outlined, ghost
 * @param {string} padding - Padding interno: none, sm, md, lg, xl
 * @param {boolean} hoverable - Si debe tener efecto hover
 * @param {boolean} clickable - Si debe verse como clickeable
 * @param {function} onClick - Función onClick opcional
 * @param {string} className - Clases adicionales
 */
export function Card({
  children,
  variant = "elevated",
  padding = "md",
  hoverable = false,
  clickable = false,
  onClick,
  className,
  as,
  ...rest
}) {
  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.elevated;
  const paddingClass = PADDING_CLASSES[padding] ?? PADDING_CLASSES.md;

  const isInteractive = Boolean(onClick) || clickable;
  const Component = as || "div";

  return (
    <Component
      className={cx(
        "rounded-[var(--radius-xl)]",
        "transition-all duration-200",
        variantClass,
        paddingClass,
        hoverable && "hover:shadow-[var(--shadow-lg)] hover:translate-y-[-2px]",
        isInteractive && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Card sub-components para estructura                                       */
/* -------------------------------------------------------------------------- */

export function CardHeader({ children, className, ...rest }) {
  return (
    <div
      className={cx(
        "border-b border-[color:var(--color-neutral3)]",
        "pb-3 mb-3",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, as, ...rest }) {
  const Component = as || "h3";

  return (
    <Component
      className={cx(
        "text-base font-medium font-sans",
        "text-[color:var(--color-text)]",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className, ...rest }) {
  return (
    <p
      className={cx(
        "text-sm",
        "text-[color:var(--color-text-secondary)]",
        "mt-1",
        className
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

export function CardBody({ children, className, ...rest }) {
  return (
    <div className={cx("text-sm", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...rest }) {
  return (
    <div
      className={cx(
        "border-t border-[color:var(--color-neutral3)]",
        "pt-3 mt-3",
        "flex items-center gap-2",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Variantes derivadas                                                       */
/* -------------------------------------------------------------------------- */

export const CardElevated = (props) => (
  <Card {...props} variant="elevated" />
);

export const CardFlat = (props) => (
  <Card {...props} variant="flat" />
);

export const CardOutlined = (props) => (
  <Card {...props} variant="outlined" />
);

export const CardGhost = (props) => (
  <Card {...props} variant="ghost" />
);

export const CardHoverable = (props) => (
  <Card {...props} hoverable />
);

export const CardClickable = (props) => (
  <Card {...props} clickable hoverable />
);
