//path/src/modules/admin/components/ProductDrawer.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal.jsx";
import { Trash2 } from "lucide-react";

const STATUS_VALUES = ["activo", "sin_stock", "borrador"];

const productSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(2, "Nombre demasiado corto"),
  sku: z.string().min(2, "SKU requerido"),
  price: z.coerce.number().min(0, "Precio inválido"),
  stock: z.coerce.number().int().min(0, "Stock inválido"),
  status: z.enum(STATUS_VALUES).default("activo"),
  fk_category_id: z.union([z.string(), z.number()]).nullable().optional(),
  fk_collection_id: z.union([z.string(), z.number()]).nullable().optional(),
  imgUrl: z.string().url("URL inválida").or(z.literal("")).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),

  // Dimensiones en el formulario (strings; luego las transformamos a números)
  dimHeight: z.string().optional(),
  dimWidth: z.string().optional(),
  dimLength: z.string().optional(),
  dimUnit: z.string().optional(),
});

const toNumOrNull = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export function ProductDrawer({
  open,
  onClose,
  onSubmit, // (payload) => Promise<void>
  onDelete, // (product) => void
  initial,
  categories = [],
  collections = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
      status: "activo",
      fk_category_id: "",
      fk_collection_id: "",
      imgUrl: "",
      description: "",
      color: "",
      material: "",
      dimHeight: "",
      dimWidth: "",
      dimLength: "",
      dimUnit: "cm",
    },
  });

  // Cargar datos iniciales (incluyendo dimensiones)
  useEffect(() => {
    if (!open) return;

    if (initial) {
      const dim = initial.dimensions || {};
      reset({
        ...initial,
        fk_category_id: initial.fk_category_id ?? "",
        fk_collection_id: initial.fk_collection_id ?? "",
        dimHeight: dim.height ?? "",
        dimWidth: dim.width ?? "",
        dimLength: dim.length ?? "",
        dimUnit: dim.unit ?? "cm",
      });
    } else {
      reset({});
    }
  }, [open, initial, reset]);

  const handleFormSubmit = async (data) => {
    const {
      dimHeight,
      dimWidth,
      dimLength,
      dimUnit,
      ...rest
    } = data;

    const height = toNumOrNull(dimHeight);
    const width = toNumOrNull(dimWidth);
    const length = toNumOrNull(dimLength);
    const unit = dimUnit || null;

    let dimensions = null;
    if (height !== null || width !== null || length !== null || unit) {
      dimensions = { height, width, length, unit };
    }

    const payload = {
      ...rest,
      dimensions,
    };

    await onSubmit?.(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Editar producto" : "Nuevo producto"}
      placement="right"
      showCloseButton
      closeOnOverlayClick={true}
      bodyClassName="h-full max-h-full px-5 py-4"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex h-full flex-col gap-4"
      >
        {/* Contenido scrollable */}
        <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
          {/* Bloque: info principal */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Información básica
            </h3>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block">Nombre</span>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  {...register("name")}
                />
                {errors.name && (
                  <em className="mt-0.5 block text-xs text-red-600">
                    {errors.name.message}
                  </em>
                )}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block">SKU</span>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    {...register("sku")}
                  />
                  {errors.sku && (
                    <em className="mt-0.5 block text-xs text-red-600">
                      {errors.sku.message}
                    </em>
                  )}
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block">Estado</span>
                  <select
                    className="w-full rounded-md border px-3 py-2"
                    {...register("status")}
                  >
                    <option value="activo">Activo</option>
                    <option value="sin_stock">Sin stock</option>
                    <option value="borrador">Borrador</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Bloque: precios / stock */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Inventario
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="mb-1 block">Precio</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border px-3 py-2"
                  {...register("price")}
                />
                {errors.price && (
                  <em className="mt-0.5 block text-xs text-red-600">
                    {errors.price.message}
                  </em>
                )}
              </label>

              <label className="block text-sm">
                <span className="mb-1 block">Stock</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border px-3 py-2"
                  {...register("stock")}
                />
                {errors.stock && (
                  <em className="mt-0.5 block text-xs text-red-600">
                    {errors.stock.message}
                  </em>
                )}
              </label>
            </div>
          </div>

          {/* Bloque: categorización */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Clasificación
            </h3>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block">Categoría</span>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  {...register("fk_category_id")}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1 block">Colección</span>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  {...register("fk_collection_id")}
                >
                  <option value="">Sin colección</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Bloque: imagen */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Imagen
            </h3>
            <label className="block text-sm">
              <span className="mb-1 block">Imagen (URL)</span>
              <input
                className="w-full rounded-md border px-3 py-2"
                {...register("imgUrl")}
              />
              {errors.imgUrl && (
                <em className="mt-0.5 block text-xs text-red-600">
                  {errors.imgUrl.message}
                </em>
              )}
            </label>
          </div>

          {/* Bloque: características */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Características
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="mb-1 block">Color</span>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  {...register("color")}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block">Material</span>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  {...register("material")}
                />
              </label>
            </div>

            <label className="mt-3 block text-sm">
              <span className="mb-1 block">Descripción</span>
              <textarea
                rows={4}
                className="w-full rounded-md border px-3 py-2"
                {...register("description")}
              />
            </label>
          </div>

          {/* Bloque: dimensiones */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Dimensiones
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <label className="block text-xs">
                <span className="mb-1 block">Alto</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border px-2 py-1.5 text-sm"
                  placeholder="cm"
                  {...register("dimHeight")}
                />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block">Ancho</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border px-2 py-1.5 text-sm"
                  placeholder="cm"
                  {...register("dimWidth")}
                />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block">Largo</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-md border px-2 py-1.5 text-sm"
                  placeholder="cm"
                  {...register("dimLength")}
                />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block">Unidad</span>
                <input
                  className="w-full rounded-md border px-2 py-1.5 text-sm"
                  placeholder="cm"
                  {...register("dimUnit")}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer: Guardar / Eliminar */}
        <div className="mt-3 flex justify-between gap-2 border-t border-neutral-100 pt-3">
          {initial ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
              onClick={() => onDelete?.(initial)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-(--color-primary1) px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ProductDrawer;
