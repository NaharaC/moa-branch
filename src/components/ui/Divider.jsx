import React from "react";
import { cx } from "../../utils/ui-helpers.js";

/**
 * Divider
 * 
 * @param {string} orientation - Orientación: horizontal o vertical
 * @param {string} variant - Variante visual: solid, dashed, dotted
 * @param {string} color - Color: primary, secondary, neutral, light
 * @param {string} spacing - Espaciado: none, sm, md, lg
 * @param {React.ReactNode} label - Texto opcional en el medio (solo horizontal)
 * @param {string} className - Clases adicionales
 */
export function Divider({
  orientation = "horizontal",
  variant = "solid",
  color = "neutral",
  spacing = "md",
  label,
  className,
  ...rest
}) {
  const isVertical = orientation === "vertical";

  // Colores
  const colorClasses = {
    primary: "border-[color:var(--color-primary1)]",
    secondary: "border-[color:var(--color-secondary1)]",
    neutral: "border-[color:var(--color-neutral3)]",
    light: "border-[color:var(--color-border-light)]",
    muted: "border-[color:var(--color-text-muted)]/20",
  };

  // Variantes de estilo
  const variantClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  // Espaciado
  const spacingClasses = {
    horizontal: {
      none: "my-0",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
      xl: "my-8",
    },
    vertical: {
      none: "mx-0",
      sm: "mx-2",
      md: "mx-4",
      lg: "mx-6",
      xl: "mx-8",
    },
  };

  const colorClass = colorClasses[color] ?? colorClasses.neutral;
  const variantClass = variantClasses[variant] ?? variantClasses.solid;
  const spacingClass = isVertical
    ? spacingClasses.vertical[spacing] ?? spacingClasses.vertical.md
    : spacingClasses.horizontal[spacing] ?? spacingClasses.horizontal.md;

  // Con label (solo horizontal)
  if (label && !isVertical) {
    return (
      <div
        className={cx(
          "flex items-center",
          spacingClass,
          className
        )}
        role="separator"
        {...rest}
      >
        <div
          className={cx(
            "flex-1 border-t",
            colorClass,
            variantClass
          )}
        />
        <span className="px-3 text-xs font-medium text-[color:var(--color-text-muted)] uppercase tracking-wider">
          {label}
        </span>
        <div
          className={cx(
            "flex-1 border-t",
            colorClass,
            variantClass
          )}
        />
      </div>
    );
  }

  // Sin label
  if (isVertical) {
    return (
      <div
        className={cx(
          "inline-block h-full border-l",
          colorClass,
          variantClass,
          spacingClass,
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...rest}
      />
    );
  }

  return (
    <hr
      className={cx(
        "border-t border-0",
        colorClass,
        variantClass,
        spacingClass,
        className
      )}
      role="separator"
      {...rest}
    />
  );
}

/* Variantes derivadas-------------------------------------------------------------------------- */

export const DividerHorizontal = (props) => (
  <Divider {...props} orientation="horizontal" />
);

export const DividerVertical = (props) => (
  <Divider {...props} orientation="vertical" />
);

export const DividerDashed = (props) => (
  <Divider {...props} variant="dashed" />
);

export const DividerDotted = (props) => (
  <Divider {...props} variant="dotted" />
);

export const DividerLight = (props) => (
  <Divider {...props} color="light" />
);

export const DividerWithLabel = ({ label, ...props }) => (
  <Divider {...props} label={label} />
);
