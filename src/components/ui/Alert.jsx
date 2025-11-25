import React from "react";
import { cx } from "../../utils/ui-helpers.js";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

/* Alert Component -------------------------------------------------------------------------- */

const VARIANT_CONFIG = {
  info: {
    icon: Info,
    bgClass: "bg-[color:var(--color-secondary2)]/10",
    borderClass: "border-[color:var(--color-secondary2)]/30",
    textClass: "text-[color:var(--color-secondary2)]",
    iconClass: "text-[color:var(--color-secondary2)]",
  },
  success: {
    icon: CheckCircle,
    bgClass: "bg-[color:var(--color-success)]/10",
    borderClass: "border-[color:var(--color-success)]/30",
    textClass: "text-[color:var(--color-success)]",
    iconClass: "text-[color:var(--color-success)]",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-[color:var(--color-warning)]/15",
    borderClass: "border-[color:var(--color-warning)]/30",
    textClass: "text-[color:var(--color-warning)]",
    iconClass: "text-[color:var(--color-warning)]",
  },
  error: {
    icon: XCircle,
    bgClass: "bg-[color:var(--color-error)]/10",
    borderClass: "border-[color:var(--color-error)]/30",
    textClass: "text-[color:var(--color-error)]",
    iconClass: "text-[color:var(--color-error)]",
  },
};

/**
 * Alert 
 * 
 * @param {string} variant - Variante: info, success, warning, error
 * @param {string} title - Título de la alerta
 * @param {React.ReactNode} children - Mensaje o contenido
 * @param {boolean} dismissible - Si puede cerrarse
 * @param {function} onDismiss - Callback al cerrar
 * @param {React.ReactNode} icon - Ícono customizado (opcional)
 * @param {string} className - Clases adicionales
 */
export function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className,
  ...rest
}) {
  const [isVisible, setIsVisible] = React.useState(true);

  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.info;
  const IconComponent = icon || config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className={cx(
        "flex items-start gap-3",
        "p-4 rounded-[var(--radius-lg)]",
        "border",
        config.bgClass,
        config.borderClass,
        "transition-all duration-200",
        className
      )}
      {...rest}
    >
      {/* Ícono */}
      {IconComponent && (
        <div className={cx("shrink-0 mt-0.5", config.iconClass)}>
          <IconComponent className="w-5 h-5" />
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4
            className={cx(
              "font-medium text-sm mb-1",
              config.textClass
            )}
          >
            {title}
          </h4>
        )}
        {children && (
          <div
            className={cx(
              "text-sm",
              title ? config.textClass : config.textClass,
              "opacity-90"
            )}
          >
            {children}
          </div>
        )}
      </div>

      {/* Botón de cerrar */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cx(
            "shrink-0 p-1 rounded-md",
            "transition-colors duration-150",
            "hover:bg-black/5",
            config.iconClass
          )}
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* Variantes derivadas  -------------------------------------------------------------------------- */

export const AlertInfo = (props) => (
  <Alert {...props} variant="info" />
);

export const AlertSuccess = (props) => (
  <Alert {...props} variant="success" />
);

export const AlertWarning = (props) => (
  <Alert {...props} variant="warning" />
);

export const AlertError = (props) => (
  <Alert {...props} variant="error" />
);
