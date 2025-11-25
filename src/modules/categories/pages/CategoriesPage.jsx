import { useMemo } from "react";
import { CategoriesCard } from "../components/CategoriesCard.jsx";
import { useCategories } from "../../products/hooks/useCategories.js";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../../config/constants.js";

export const CategoriesPage = () => {
  const { categories, isLoading, error } = useCategories();

  const parents = useMemo(() => {
    const source = Array.isArray(categories) ? categories : [];
    return source
      .filter((category) => category?.parentId === null)
      .map((category, index) => ({
        ...category,
        id: category?.id ?? `category-${index}`,
        name: category?.name ?? `Categoría ${index + 1}`,
        coverImage: category?.coverImage ?? DEFAULT_PLACEHOLDER_IMAGE,
      }));
  }, [categories]);

  const heroCategory = parents[0] ?? null;
  const featuredCategories = parents.slice(1, 3);
  const remainingCategories = parents.slice(3);
  const hasCategories = parents.length > 0;

  return (
    <main className="page bg-light py-12">
      <section className="container-px mx-auto max-w-5xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-secondary2">Categorías</p>
        <h1 className="title-serif mt-4 text-4xl text-dark sm:text-5xl">Encuentra lo que buscas</h1>
        <p className="mx-auto mt-4 max-w-4xl text-base text-secondary1 sm:text-lg">
          Explora nuestras líneas de muebles y decoración según el ambiente o estilo que más te inspire.
        </p>
        {error && (
          <p className="mt-4 text-sm text-red-600">
            No pudimos cargar las categorías. Intenta nuevamente en unos minutos.
          </p>
        )}
      </section>

      {heroCategory && (
        <section className="container-px mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.4fr_1fr]">
          <CategoriesCard category={heroCategory} variant="hero" />
          <div className="grid gap-6">
            {featuredCategories.map((category) => (
              <CategoriesCard key={category.id} category={category} variant="featured" />
            ))}
            {featuredCategories.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-neutral-200 bg-white/60 p-8 text-center text-neutral-500">
                Sin más categorías destacadas por el momento.
              </div>
            )}
          </div>
        </section>
      )}

      {remainingCategories.length > 0 && (
        <section className="container-px mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {remainingCategories.map((category) => (
            <CategoriesCard key={category.id} category={category} />
          ))}
        </section>
      )}

      {!hasCategories && !isLoading && (
        <div className="container-px mx-auto mt-12 max-w-4xl rounded-3xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center text-neutral-500">
          Categorías no disponibles por el momento.
        </div>
      )}

      {isLoading && (
        <div className="container-px mx-auto mt-12 max-w-4xl rounded-3xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center text-neutral-500">
          Cargando categorías...
        </div>
      )}
    </main>
  );
};

export default CategoriesPage;
