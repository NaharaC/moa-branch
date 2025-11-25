import React from "react";
import { cx } from "../../utils/ui-helpers.js";

/* Spinner -------------------------------------------------------------------------- */

const SIZE_MAP = {
  xs: "w-3 h-3 border-[1.5px]",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
  xl: "w-12 h-12 border-[3px]",
};

const COLOR_MAP = {
  primary: "border-[color:var(--color-primary1)]",
  secondary: "border-[color:var(--color-secondary1)]",
  white: "border-white",
  current: "border-current",
};

/**
 * Spinner
 * 
 * @param {string} size - Tamaño: xs, sm, md, lg, xl
 * @param {string} color - Color: primary, secondary, white, current
 * @param {string} label - Label de accesibilidad
 * @param {string} className - Clases adicionales
 */
export function Spinner({
  size = "md",
  color = "primary",
  label = "Cargando...",
  className,
  ...rest
}) {
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;
  const colorClass = COLOR_MAP[color] ?? COLOR_MAP.primary;

  return (
    <div
      role="status"
      aria-label={label}
      className={cx("inline-flex items-center justify-center", className)}
      {...rest}
    >
      <div
        className={cx(
          "rounded-full animate-spin",
          "border-transparent",
          "border-t-current",
          sizeClass,
          colorClass
        )}
        style={{
          animationDuration: "0.8s",
        }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/* Variantes derivadas  -------------------------------------------------------------------------- */

export const SpinnerXs = (props) => <Spinner {...props} size="xs" />;
export const SpinnerSm = (props) => <Spinner {...props} size="sm" />;
export const SpinnerMd = (props) => <Spinner {...props} size="md" />;
export const SpinnerLg = (props) => <Spinner {...props} size="lg" />;
export const SpinnerXl = (props) => <Spinner {...props} size="xl" />;

export const SpinnerPrimary = (props) => <Spinner {...props} color="primary" />;
export const SpinnerSecondary = (props) => <Spinner {...props} color="secondary" />;
export const SpinnerWhite = (props) => <Spinner {...props} color="white" />;

/* Spinner con overlay para pantalla completa  -------------------------------------------------------------------------- */

export function SpinnerOverlay({
  message = "Cargando...",
  size = "lg",
  className,
  ...rest
}) {
  return (
    <div
      className={cx(
        "fixed inset-0 z-50",
        "flex flex-col items-center justify-center gap-3",
        "bg-[color:var(--overlay-soft)]",
        "backdrop-blur-sm",
        className
      )}
      {...rest}
    >
      <Spinner size={size} color="primary" />
      {message && (
        <p className="text-sm font-medium text-[color:var(--color-text)]">
          {message}
        </p>
      )}
    </div>
  );
}

/* Dots Loader  -------------------------------------------------------------------------- */

export function DotsLoader({
  size = "md",
  color = "primary",
  className,
  ...rest
}) {
  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const colorClasses = {
    primary: "bg-[color:var(--color-primary1)]",
    secondary: "bg-[color:var(--color-secondary1)]",
    current: "bg-current",
  };

  const dotSize = dotSizes[size] ?? dotSizes.md;
  const dotColor = colorClasses[color] ?? colorClasses.primary;

  return (
    <div
      className={cx("inline-flex items-center gap-1.5", className)}
      role="status"
      aria-label="Cargando..."
      {...rest}
    >
      <span
        className={cx("rounded-full animate-bounce", dotSize, dotColor)}
        style={{ animationDelay: "0ms", animationDuration: "1s" }}
      />
      <span
        className={cx("rounded-full animate-bounce", dotSize, dotColor)}
        style={{ animationDelay: "150ms", animationDuration: "1s" }}
      />
      <span
        className={cx("rounded-full animate-bounce", dotSize, dotColor)}
        style={{ animationDelay: "300ms", animationDuration: "1s" }}
      />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
