import { useMemo } from "react";

import { DoubleRangeSlider } from "./DoubleRangeSlider.jsx";
import { normalizeCategoryFilterOptions } from "../../../utils/normalizers.js";
import { clamp } from "../../../utils/math.js";

export function ProductFiltersContent({
  categories,
  filters,
  limits,
  onChangeCategory,
  onChangePrice,
}) {
  const normalizedCategories = useMemo(
    () => normalizeCategoryFilterOptions(categories),
    [categories],
  );
  const minLimit = limits?.min ?? 0;
  const maxLimit = limits?.max ?? 0;
  const selectedMin = clamp(Math.round(filters.min), minLimit, maxLimit);
  const selectedMax = clamp(Math.round(filters.max), selectedMin, maxLimit);
  const sliderStep = Math.max(1, Math.round((maxLimit - minLimit) / 40));
  const hasCustomMin = Number.isFinite(filters.min) && filters.min !== minLimit;
  const hasCustomMax = Number.isFinite(filters.max) && filters.max !== maxLimit;
  const inputMinValue = hasCustomMin ? selectedMin : "";
  const inputMaxValue = hasCustomMax ? selectedMax : "";

  const updateRange = (nextMin, nextMax) => {
    const boundedMin = clamp(Number(nextMin), minLimit, maxLimit);
    const boundedMax = clamp(Number(nextMax), minLimit, maxLimit);
    const normalizedMin = Math.min(boundedMin, boundedMax);
    const normalizedMax = Math.max(boundedMin, boundedMax);
    onChangePrice({
      min: normalizedMin,
      max: normalizedMax,
    });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">Categorías</h3>
        </header>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {normalizedCategories.map((cat) => {
            const active = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChangeCategory(cat.id)}
                className={[
                  "flex w-full items-center justify-between rounded-xl border px-4 py-2 text-sm transition",
                  active
                    ? "border-(--color-primary1,#6B5444) bg-(--color-primary1,#6B5444) text-white"
                    : "border-transparent bg-white text-neutral-700 hover:border-neutral-200",
                ].join(" ")}
              >
                <span>{cat.name}</span>
                {active && <span aria-hidden>•</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">Rango de precio</h3>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={inputMinValue}
              min={minLimit}
              max={selectedMax}
              onChange={(event) => {
                const { value } = event.target;
                if (value === "") {
                  updateRange(minLimit, selectedMax);
                  return;
                }
                const parsed = Number(value);
                updateRange(Number.isFinite(parsed) ? parsed : minLimit, selectedMax);
              }}
              placeholder="Mín."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm transition focus:border-(--color-primary1,#6B5444) focus:outline-none"
            />
            <input
              type="number"
              value={inputMaxValue}
              min={selectedMin}
              max={maxLimit}
              onChange={(event) => {
                const { value } = event.target;
                if (value === "") {
                  updateRange(selectedMin, maxLimit);
                  return;
                }
                const parsed = Number(value);
                updateRange(selectedMin, Number.isFinite(parsed) ? parsed : maxLimit);
              }}
              placeholder="Máx."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm transition focus:border-(--color-primary1,#6B5444) focus:outline-none"
            />
          </div>

          <DoubleRangeSlider
            min={minLimit}
            max={maxLimit}
            valueMin={selectedMin}
            valueMax={selectedMax}
            onChange={updateRange}
            step={sliderStep}
          />
        </div>
      </section>
    </div>
  );
}
