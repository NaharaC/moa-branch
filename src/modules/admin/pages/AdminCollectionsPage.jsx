import { useMemo, useState } from "react";
import { useCategories } from "../../products/hooks/useCategories.js";
import { Button } from "../../../components/ui/Button.jsx";

export default function AdminCollectionsPage() {
  const { categories, isLoading, error, refresh } = useCategories();
  const [featured, setFeatured] = useState(() => new Set());

  const topLevelCategories = useMemo(
    () => (categories || []).filter((c) => c?.parentId == null),
    [categories]
  );

  const toggleFeatured = (id) => {
    setFeatured((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    // TODO: Implement backend save when endpoint is available
    // For now, just show a simple feedback
    alert(
      `Guardado (simulado). Destacadas: ${Array.from(featured).join(", ") || "ninguna"}`
    );
  };

  return (
    <section className="mx-auto w-full max-w-6xl">
      <header className="mb-8">
        <h1 className="title-serif text-2xl text-primary">Colecciones y Categorías</h1>
        <p className="text-sm text-neutral-600">
          Define qué categorías quedan destacadas en la home y organiza tus colecciones.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-primary">Categorías principales</h2>
          {isLoading && <p className="text-sm text-neutral-500">Cargando categorías…</p>}
          {error && (
            <div className="text-sm text-red-600">Error al cargar categorías</div>
          )}
          {!isLoading && !error && (
            <ul className="divide-y divide-neutral-100">
              {topLevelCategories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary/60" />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-primary h-4 w-4"
                      checked={featured.has(cat.id)}
                      onChange={() => toggleFeatured(cat.id)}
                    />
                    Destacada
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex gap-3">
            <Button size="sm" onClick={() => refresh()}>
              Recargar
            </Button>
            <Button size="sm" appearance="primary" onClick={handleSave}>
              Guardar cambios
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-primary">Colecciones</h2>
          <p className="text-sm text-neutral-600">
            Próximamente podrás crear colecciones personalizadas combinando
            categorías y productos.
          </p>
          <ul className="mt-4 list-disc pl-6 text-sm text-neutral-700">
            <li>Crear, renombrar y ordenar colecciones</li>
            <li>Añadir/quitar categorías o productos</li>
            <li>Definir colección destacada</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
