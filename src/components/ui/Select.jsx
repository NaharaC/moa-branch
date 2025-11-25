import React from "react";
import { cx } from "../../utils/ui-helpers.js";


const SIZE_CLASSES = {
  sm: "h-9 px-3 text-xs rounded-[10px]",       
  md: "h-10 px-3 text-sm rounded-[12px]",        
  lg: "h-11 px-4 text-sm rounded-[14px]",       
};

const VARIANT_CLASSES = {
  // borde suave, fondo claro
  neutral: cx(
    "bg-[color:var(--color-neutral2)]",
    "border border-[color:var(--color-neutral3)]",
    "text-[color:var(--color-text)]"
  ),

  // borde y foco con acento
  primary: cx(
    "bg-[color:var(--color-neutral2)]",
    "border border-[color:var(--color-primary3)]",
    "text-[color:var(--color-text)]"
  ),

  // sin fondo, solo borde sutil
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

export function Select({
  id,
  label,                     
  placeholder = "Selecciona una opción", 
  helperText,                
  error,                    
  fullWidth = false,       
  size = "md",           
  variant = "neutral",      
  name,
  value,
  onChange,
  options = [],             
  disabled = false,
  required = false,
}) {

const internalId = React.useId();
  const selectId = id ?? internalId;

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
          htmlFor={selectId}
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

      {/* Contenedor para el select + ícono de flecha */}
      <div className="relative">
        {/* elemento select nativo */}
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cx(
            "block w-full appearance-none",           // full width + sin flecha nativa
            "outline-none",                          // sacamos outline por defecto
            "leading-snug",                          // texto apretado
            "shadow-sm",                             // ligera sombra
            "transition-colors duration-150",        // animaciones suaves
            sizeClass,                               // tamaño
            variantClass,                            // variante visual
            disabled &&
              "opacity-60 cursor-not-allowed bg-[color:var(--color-neutral1)]",
            hasError && ERROR_CLASSES,
            !disabled &&
              !hasError &&
              "focus:border-[color:var(--color-primary4)] focus:ring-2 focus:ring-[color:var(--overlay-soft)]",
            !disabled &&
              hasError &&
              "focus:border-[color:var(--color-error)] focus:ring-2 focus:ring-[color:var(--color-error)]/30"
          )}
        >
          {/* placeholder como opción deshabilitada */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* ícono de flecha dropdown (no dependemos de librerías) */}
        <span
          className={cx(
            "pointer-events-none absolute inset-y-0 right-3",
            "flex items-center text-xs",
            hasError
              ? "text-[color:var(--color-error)]"
              : "text-[color:var(--color-text-muted)]"
          )}
        >
          ▾
        </span>
      </div>

      {/* helper / error text */}
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

/* Atajo Variantes */

// select principal para formularios importantes
export const SelectPrimary = (props) => (
  <Select {...props} variant="primary" />
);

// select fantasmal (sin fondo) para filtros en toolbars / headers
export const SelectGhost = (props) => (
  <Select {...props} variant="ghost" />
);

// select compacto, ideal para filtros en tablas
export const SelectSm = (props) => (
  <Select {...props} size="sm" />
);

// select grande (por ejemplo en forms “hero” tipo checkout)
export const SelectLg = (props) => (
  <Select {...props} size="lg" />
);
