import React from "react";
import { cx } from "../../utils/ui-helpers.js";

/* Tamaños & Variantes  -------------------------------------------------------------------------- */

const SIZE_CLASSES = {
  sm: "h-9 px-3 text-xs rounded-[10px]",
  md: "h-10 px-3 text-sm rounded-[12px]",
  lg: "h-11 px-4 text-sm rounded-[14px]",
};

const VARIANT_CLASSES = {
  // Estilo neutral con fondo claro
  neutral: cx(
    "bg-[color:var(--color-neutral2)]",
    "border border-[color:var(--color-neutral3)]",
    "text-[color:var(--color-text)]"
  ),

  // Estilo primario con borde accent
  primary: cx(
    "bg-[color:var(--color-neutral2)]",
    "border border-[color:var(--color-primary3)]",
    "text-[color:var(--color-text)]"
  ),

  // Estilo ghost sin fondo
  ghost: cx(
    "bg-transparent",
    "border border-[color:var(--color-neutral3)]",
    "text-[color:var(--color-text)]"
  ),
};

const ERROR_CLASSES = cx(
  "border-[color:var(--color-error)]",
  "text-[color:var(--color-error)]"
);

/* -------------------------------------------------------------------------- */
/* Componente Base                                                            */
/* -------------------------------------------------------------------------- */

export function Input({
  id,
  label,
  placeholder,
  helperText,
  error,
  fullWidth = false,
  size = "md",
  variant = "neutral",
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  className,
  ...rest
}) {
  const internalId = React.useId();
  const inputId = id ?? internalId;

  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral;

  const hasError = Boolean(error);

  return (
    <div
      className={cx(
        "flex flex-col gap-1",
        fullWidth && "w-full"
      )}
    >
      {/* Label opcional */}
      {label && (
        <label
          htmlFor={inputId}
          className={cx(
            "text-xs font-medium",
            hasError
              ? "text-[color:var(--color-error)]"
              : "text-[color:var(--color-text-secondary)]"
          )}
        >
          {label}
          {required && <span className="text-[color:var(--color-error)]"> *</span>}
        </label>
      )}

      {/* Contenedor para input + iconos */}
      <div className="relative">
        {/* Ícono izquierdo */}
        {leftIcon && (
          <span
            className={cx(
              "pointer-events-none absolute inset-y-0 left-3",
              "flex items-center text-base",
              hasError
                ? "text-[color:var(--color-error)]"
                : "text-[color:var(--color-text-muted)]"
            )}
          >
            {leftIcon}
          </span>
        )}

        {/* Input field */}
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={cx(
            "block w-full",
            "outline-none",
            "leading-snug",
            "shadow-sm",
            "transition-colors duration-150",
            sizeClass,
            variantClass,
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            disabled &&
              "opacity-60 cursor-not-allowed bg-[color:var(--color-neutral1)]",
            hasError && ERROR_CLASSES,
            !disabled &&
              !hasError &&
              "focus:border-[color:var(--color-primary4)] focus:ring-2 focus:ring-[color:var(--overlay-soft)]",
            !disabled &&
              hasError &&
              "focus:border-[color:var(--color-error)] focus:ring-2 focus:ring-[color:var(--color-error)]/30",
            className
          )}
          {...rest}
        />

        {/* Ícono derecho */}
        {rightIcon && (
          <span
            className={cx(
              "pointer-events-none absolute inset-y-0 right-3",
              "flex items-center text-base",
              hasError
                ? "text-[color:var(--color-error)]"
                : "text-[color:var(--color-text-muted)]"
            )}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper text o error */}
      {(helperText || error) && (
        <p
          className={cx(
            "text-[0.70rem] mt-0.5",
            hasError
              ? "text-[color:var(--color-error)]"
              : "text-[color:var(--color-text-muted)]"
          )}
        >
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  );
}

/* Variantes derivadas  -------------------------------------------------------------------------- */

export const InputPrimary = (props) => (
  <Input {...props} variant="primary" />
);

export const InputGhost = (props) => (
  <Input {...props} variant="ghost" />
);

export const InputSm = (props) => (
  <Input {...props} size="sm" />
);

export const InputLg = (props) => (
  <Input {...props} size="lg" />
);

/* Textarea (similar estructura) -------------------------------------------------------------------------- */

export function Textarea({
  id,
  label,
  placeholder,
  helperText,
  error,
  fullWidth = false,
  variant = "neutral",
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  rows = 4,
  className,
  ...rest
}) {
  const internalId = React.useId();
  const textareaId = id ?? internalId;

  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral;
  const hasError = Boolean(error);

  return (
    <div
      className={cx(
        "flex flex-col gap-1",
        fullWidth && "w-full"
      )}
    >
      {label && (
        <label
          htmlFor={textareaId}
          className={cx(
            "text-xs font-medium",
            hasError
              ? "text-[color:var(--color-error)]"
              : "text-[color:var(--color-text-secondary)]"
          )}
        >
          {label}
          {required && <span className="text-[color:var(--color-error)]"> *</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={cx(
          "block w-full px-3 py-2",
          "text-sm rounded-[12px]",
          "outline-none",
          "leading-relaxed",
          "shadow-sm",
          "resize-vertical",
          "transition-colors duration-150",
          variantClass,
          disabled &&
            "opacity-60 cursor-not-allowed bg-[color:var(--color-neutral1)]",
          hasError && ERROR_CLASSES,
          !disabled &&
            !hasError &&
            "focus:border-[color:var(--color-primary4)] focus:ring-2 focus:ring-[color:var(--overlay-soft)]",
          !disabled &&
            hasError &&
            "focus:border-[color:var(--color-error)] focus:ring-2 focus:ring-[color:var(--color-error)]/30",
          className
        )}
        {...rest}
      />

      {(helperText || error) && (
        <p
          className={cx(
            "text-[0.70rem] mt-0.5",
            hasError
              ? "text-[color:var(--color-error)]"
              : "text-[color:var(--color-text-muted)]"
          )}
        >
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  );
}
