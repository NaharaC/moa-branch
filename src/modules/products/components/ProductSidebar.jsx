import { ProductFiltersContent } from "./ProductFiltersContent.jsx";

export function ProductSidebar({
  categories,
  filters,
  limits,
  appliedFilters = [],
  onChangeCategory,
  onChangePrice,
  onRemoveFilter,
  onReset,
}) {
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col">
      <div className="sticky top-28 rounded-3xl border border-(--line,#e3ddd3) bg-white/95 p-6 shadow-sm backdrop-blur">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Filtros</h2>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-(--color-primary1,#6B5444) underline-offset-2 transition hover:underline"
          >
            Limpiar
          </button>
        </header>

        <ProductFiltersContent
          categories={categories}
          filters={filters}
          limits={limits}
          onChangeCategory={onChangeCategory}
          onChangePrice={onChangePrice}
        />
        {appliedFilters.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl bg-(--color-light-beige,#f6efe7) px-4 py-3">
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
      </div>
    </aside>
  );
}
