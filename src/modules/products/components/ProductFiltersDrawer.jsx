import { useEffect, useRef } from "react";
import { ProductFiltersContent } from "./ProductFiltersContent.jsx";

export function ProductFiltersDrawer({
  open,
  onClose,
  categories,
  filters,
  limits,
  appliedFilters = [],
  onChangeCategory,
  onChangePrice,
  onRemoveFilter,
  onReset,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in">
      <aside
        ref={panelRef}
        tabIndex={-1}
        className="flex h-full w-full max-w-sm flex-col gap-6 overflow-y-auto rounded-l-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10 animate-slide-up"
      >
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Filtros</h2>
            <p className="text-xs text-neutral-500">Personaliza los resultados según tus preferencias.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700"
          >
            <span className="sr-only">Cerrar filtros</span>
            ×
          </button>
        </header>

        <ProductFiltersContent
          categories={categories}
          filters={filters}
          limits={limits}
          onChangeCategory={onChangeCategory}
          onChangePrice={onChangePrice}
        />

        <footer className="mt-auto flex flex-col gap-3">
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-(--line,#e3ddd3) bg-(--color-light-beige,#f6efe7) px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Filtros activos
              </span>
              {appliedFilters.map((filter) => (
                <button
                  key={filter.type}
                  type="button"
                  onClick={() => onRemoveFilter?.(filter.type)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-100"
                >
                  {filter.label}
                  <span aria-hidden className="text-neutral-400">×</span>
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800"
          >
            Limpiar filtros
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-(--color-primary1,#6B5444) px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Mostrar resultados
          </button>
        </footer>
      </aside>
    </div>
  );
}
