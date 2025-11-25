import { useEffect, useMemo, useState } from "react";
import { useCategories } from "../../products/hooks/useCategories.js";
import { normalizeCategoryMenuItems } from "../../../utils/normalizers.js";

export default function CategoriesMenu({
  title = "Productos",
  description = "Explora nuestras categorías principales y descubre piezas curadas para cada ambiente.",
  categories: providedCategories,
  onSelectCategory,
}) {
  const shouldUseRemote = !Array.isArray(providedCategories) || providedCategories.length === 0;
  const {
    categories: fetchedCategories,
    isLoading,
    error,
  } = useCategories({ enabled: shouldUseRemote });

  const categories = useMemo(() => {
    const source = shouldUseRemote ? fetchedCategories : providedCategories;
    return normalizeCategoryMenuItems(source);
  }, [fetchedCategories, providedCategories, shouldUseRemote]);

  const [activeCategoryId, setActiveCategoryId] = useState("all");

  useEffect(() => {
    if (!categories.length) return;
    const activeCategory = categories.find((category) => category.id === activeCategoryId);
    if (!activeCategory) {
      setActiveCategoryId(categories[0].id);
      return;
    }
    if (activeCategory.raw || activeCategory.id === "all") {
      onSelectCategory?.(activeCategory.raw ?? null);
    }
  }, [categories, activeCategoryId, onSelectCategory]);

  const handleSelectCategory = (category) => {
    setActiveCategoryId(category.id);
  };

  return (
    <section className="bg-light py-12 text-center">
      <div className="mx-auto max-w-4xl space-y-4 px-4">
        <h2 className="font-italiana text-4xl text-dark">{title}</h2>
        <p className="font-garamond text-secondary1 text-lg">{description}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 px-4">
        {isLoading && categories.length === 0 && (
          <div className="text-sm text-secondary1">Cargando categorías…</div>
        )}

        {error && categories.length === 0 && (
          <div className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600">
            No pudimos cargar las categorías.
          </div>
        )}

        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelectCategory(category)}
              className={`rounded-full border px-6 py-2 font-garamond text-base transition ${
                isActive
                  ? "border-primary1 bg-primary1 text-white"
                  : "border-secondary2 text-dark hover:border-primary1 hover:text-primary1"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
