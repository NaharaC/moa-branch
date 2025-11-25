//path/src/modules/admin/components/ProductFiltersBar.jsx
import React, { useMemo } from "react";
import { PRODUCT_STATUS_OPTIONS } from "../../../config/status-options.js";

export function ProductFilters({
  categories = [],
  value = { q: "", status: "", categoryId: "", minPrice: "", maxPrice: "" },
  onChange,
  className = "",
}) {
  const set = (patch) => onChange?.({ ...value, ...patch });

  const categoryOptions = useMemo(
    () => [{ value: "", label: "Todas las categorías" }, ...categories.map((c) => ({
      value: c.id,
      label: c.name,
    }))],
    [categories],
  );

  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3 shadow-sm ${className}`}
    >
      <div className="grid gap-3 md:grid-cols-6">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-neutral-600">
            Búsqueda
          </label>
          <input
            className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm"
            placeholder="Nombre, SKU o tags…"
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-medium text-neutral-600">
            Categoría
          </label>
          <select
            className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm"
            value={value.categoryId}
            onChange={(e) => set({ categoryId: e.target.value })}
          >
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-medium text-neutral-600">
            Estado
          </label>
          <select
            className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm"
            value={value.status}
            onChange={(e) => set({ status: e.target.value })}
          >
            {PRODUCT_STATUS_OPTIONS.map((o) => (
              <option key={o.value ?? "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min / Max precio */}
        <div>
          <label className="block text-xs font-medium text-neutral-600">
            Precio mín.
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm"
            placeholder="0"
            value={value.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600">
            Precio máx.
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm"
            placeholder="∞"
            value={value.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
