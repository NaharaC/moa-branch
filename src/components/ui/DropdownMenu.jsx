import { useState, useRef, useEffect } from "react";
import { Button } from "./Button"; 
import { cx } from "../../utils/ui-helpers.js";


export function Dropdown({
  label = "Seleccionar",        
  items = [],                   
  onSelect,                     
  align = "left",            
  className,
}) {
  const [open, setOpen] = useState(false);      
  const ref = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (item) => {
    setSelected(item);      
    setOpen(false);             
    onSelect?.(item.value);  
  };

  const menuAlignClass =
    align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left";

  return (
    <div
      ref={ref}
      className={cx(
        "relative inline-flex", 
        className
      )}
    >
      {/* Botón de disparo del dropdown */}
      <Button
        appearance="outline"
        intent="neutral"
        size="md"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2"
      >

        <span className="truncate">
          {selected?.label ?? label}
        </span>

        <span
          className={cx(
            "transition-transform duration-150",
            open ? "rotate-180" : "rotate-0"
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </Button>

      {/* Menú desplegable */}
      {open && (
        <div
          className={cx(
            "absolute z-40 mt-2 min-w-[180px]",
            "rounded-(--radius-lg) border borde(--color-neutral3)",
            "bg-surface shadow-md",
            menuAlignClass
          )}
        >
          <ul className="py-1 max-h-64 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted">
                Sin opciones
              </li>
            )}

            {items.map((item) => (
              <li key={item.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={cx(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                    "text-body hover:bg-subtle transition-colors duration-100",
                    selected?.value === item.value
                      ? "bg-subtle font-medium"
                      : ""
                  )}
                >
                  {/* Icono Izq. (opcional) */}
                  {item.icon && (
                    <span className="shrink-0">
                      {item.icon}
                    </span>
                  )}

                  <span className="truncate">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
