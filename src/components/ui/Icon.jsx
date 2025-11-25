import React from "react";
import { cx } from "../../utils/ui-helpers.js";

/* -------------------------------------------------------------------------- */
/* Icon Component - Wrapper para lucide-react con tokens CSS                 */
/* -------------------------------------------------------------------------- */

const SIZE_MAP = {
  xs: "0.875rem",   // 14px
  sm: "1rem",       // 16px
  md: "1.25rem",    // 20px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
};

const COLOR_MAP = {
  primary: "var(--color-primary1)",
  secondary: "var(--color-secondary1)",
  tertiary: "var(--color-secondary2)",
  muted: "var(--color-text-muted)",
  dark: "var(--color-dark)",
  light: "var(--color-light)",
  white: "var(--color-white)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
  inherit: "currentColor",
};

/**
 * Icon - Wrapper para iconos de lucide-react con sizing y coloring consistente
 * 
 * @param {React.ReactElement} icon - Componente de ícono de lucide-react
 * @param {string} size - Tamaño: xs, sm, md (default), lg, xl
 * @param {string} color - Color del token CSS
 * @param {string} className - Clases adicionales
 */
export function Icon({
  icon,
  size = "md",
  color = "inherit",
  className,
  ...rest
}) {
  if (!icon) return null;

  const sizeValue = SIZE_MAP[size] ?? SIZE_MAP.md;
  const colorValue = COLOR_MAP[color] ?? COLOR_MAP.inherit;

  // Si el ícono es un React Element, clonarlo con props
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, {
      className: cx(icon.props.className, className),
      style: {
        width: sizeValue,
        height: sizeValue,
        color: colorValue,
        ...icon.props.style,
      },
      ...rest,
    });
  }

  // Si es un componente, renderizarlo
  const IconComponent = icon;
  return (
    <IconComponent
      className={className}
      style={{
        width: sizeValue,
        height: sizeValue,
        color: colorValue,
      }}
      {...rest}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Variantes derivadas para uso común                                        */
/* -------------------------------------------------------------------------- */

export const IconXs = (props) => <Icon {...props} size="xs" />;
export const IconSm = (props) => <Icon {...props} size="sm" />;
export const IconMd = (props) => <Icon {...props} size="md" />;
export const IconLg = (props) => <Icon {...props} size="lg" />;
export const IconXl = (props) => <Icon {...props} size="xl" />;

export const IconPrimary = (props) => <Icon {...props} color="primary" />;
export const IconSecondary = (props) => <Icon {...props} color="secondary" />;
export const IconMuted = (props) => <Icon {...props} color="muted" />;
export const IconSuccess = (props) => <Icon {...props} color="success" />;
export const IconWarning = (props) => <Icon {...props} color="warning" />;
export const IconError = (props) => <Icon {...props} color="error" />;

/* -------------------------------------------------------------------------- */
/* IconButton wrapper (si no se quiere usar el IconButton del Button.jsx)    */
/* -------------------------------------------------------------------------- */

export function IconWrapper({
  children,
  size = "md",
  color = "inherit",
  className,
  onClick,
  disabled,
  ...rest
}) {
  const sizeValue = SIZE_MAP[size] ?? SIZE_MAP.md;
  const colorValue = COLOR_MAP[color] ?? COLOR_MAP.inherit;

  const Comp = onClick ? "button" : "span";

  return (
    <Comp
      className={cx(
        "inline-flex items-center justify-center shrink-0",
        onClick && "cursor-pointer transition-opacity hover:opacity-75",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: sizeValue,
        height: sizeValue,
        color: colorValue,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
