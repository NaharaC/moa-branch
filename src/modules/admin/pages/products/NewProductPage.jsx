import { useState } from "react";
import { Button } from "../../../../components/ui/Button.jsx";
import { productsApi } from "../../../../services/products.api.js";
import { useCategories } from "../../../products/hooks/useCategories.js";

const initialForm = {
  nombre: "",
  categoria_id: "",
  collection_id: "",
  sku: "",
  precio_cents: "",
  compare_at_price_cents: "",
  stock: "",
  descripcion_corta: "",
  descripcion: "",
  img_url: "",
};

export default function NewProductPage() {
  const { categories, isLoading } = useCategories();
  console.log("categories:", categories);
  console.log("isLoading:", isLoading);

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        ...form,
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        collection_id: form.collection_id ? Number(form.collection_id) : null,
        precio_cents: Number(form.precio_cents),
        compare_at_price_cents: form.compare_at_price_cents
          ? Number(form.compare_at_price_cents)
          : null,
        stock: Number(form.stock),
      };

      const product = await productsApi.create(payload);

      setForm(initialForm);
      setFeedback({
        type: "success",
        message: `Producto "${product.nombre}" creado correctamente.`,
      });
    } catch (error) {
      console.error("Error al crear el producto", error);
      setFeedback({
        type: "error",
        message: error?.message ?? "No pudimos crear el producto.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6">
      <h1>Crear nuevo producto</h1>
      <p className="mb-10">Agrega un nuevo producto al catálogo de MOA.</p>

      {/* --- Formulario --- */}
      <form className="space-y-8 max-w-3xl" onSubmit={handleSubmit}>
        {/* Primera fila */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <label className="flex flex-col text-sm">
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="input-admin"
              placeholder="Ej: Sofá Modular Arena"
            />
          </label>

          <label className="flex flex-col text-sm">
            SKU
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              className="input-admin"
              placeholder="MOA-LIV-SOFA-001"
            />
          </label>

          <label className="flex flex-col text-sm">
            Precio (CLP)
            <input
              type="number"
              name="precio_cents"
              value={form.precio_cents}
              onChange={handleChange}
              min="0"
              step="100"
              required
              className="input-admin"
            />
          </label>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <label className="flex flex-col text-sm">
            Stock
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className="input-admin"
            />
          </label>

          <label className="flex flex-col text-sm">
            Categoría
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="input-admin"
              required
            >
              <option value="">Selecciona una categoría</option>

              {!isLoading &&
                categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        {/* Imagen */}
        <label className="flex flex-col text-sm">
          URL de imagen principal
          <input
            name="img_url"
            value={form.img_url}
            onChange={handleChange}
            className="input-admin"
            placeholder="https://..."
          />
        </label>

        {/* Descripción corta */}
        <label className="flex flex-col text-sm">
          Descripción corta
          <input
            name="descripcion_corta"
            value={form.descripcion_corta}
            onChange={handleChange}
            className="input-admin"
            placeholder="Ej: Tapizado en lino, modelo modular."
          />
        </label>

        {/* Descripción larga */}
        <label className="flex flex-col text-sm">
          Descripción
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="input-admin"
          />
        </label>

        {/* Acciones */}
        <div className="flex gap-3 pt-4">
          <Button
            intent="secondary"
            type="button"
            onClick={() => setForm(initialForm)}
          >
            Limpiar
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar producto"}
          </Button>
        </div>

        {feedback && (
          <p
            className={`text-sm ${feedback.type === "error" ? "text-red-600" : "text-green-600"}`}
          >
            {feedback.message}
          </p>
        )}
      </form>
    </main>
  );
}
