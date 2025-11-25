import { ProductFiltersDrawer } from "./ProductFiltersDrawer.jsx";
import { ProductSidebar } from "./ProductSidebar.jsx";

export function ProductsFiltersPanel({
  categories,
  filters,
  limits,
  appliedFilters,
  isMobileFiltersOpen,
  onCloseMobileFilters,
  onChangeCategory,
  onChangePrice,
  onRemoveFilter,
  onResetFilters,
  children,
}) {
  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <ProductSidebar
          categories={categories}
          filters={filters}
          limits={limits}
          appliedFilters={appliedFilters}
          onChangeCategory={onChangeCategory}
          onChangePrice={onChangePrice}
          onRemoveFilter={onRemoveFilter}
          onReset={onResetFilters}
        />
        <div className="space-y-6">{children}</div>
      </div>

      <ProductFiltersDrawer
        open={isMobileFiltersOpen}
        onClose={onCloseMobileFilters}
        categories={categories}
        filters={filters}
        limits={limits}
        appliedFilters={appliedFilters}
        onChangeCategory={onChangeCategory}
        onChangePrice={onChangePrice}
        onRemoveFilter={onRemoveFilter}
        onReset={onResetFilters}
      />
    </>
  )
}
