import React from "react";
import { Dialog, DialogContent } from "../../../components/ui/radix/Dialog.jsx";
import { Price } from "../../../components/data-display/Price.jsx";
import { StatusPill } from "../../../components/ui/StatusPill.jsx";
import { Accordion } from "../../../components/ui/Accordion.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { formatDate_ddMMyyyy } from "../../../utils/date.js";
import { Package, Tag, Layers, Calendar, TrendingUp, AlertCircle } from "lucide-react";

// Helpers
const safeDate = (value) => (value ? formatDate_ddMMyyyy(value) : "–");
const safeText = (v) => (v == null || v === "" ? "–" : v);
const safeNumber = (v, defaultValue = 0) => (Number.isFinite(Number(v)) ? Number(v) : defaultValue);

export default function ProductDetailDrawer({ open, product, onClose, categoryMap = {} }) {
  if (!open || !product) return null;

  const {
    name,
    slug,
    sku,
    description,
    price,
    comparePrice,
    stock,
    lowStockThreshold = 10,
    status,
    fk_category_id: categoryId,
    fk_subcategory_id: subcategoryId,
    featured = false,
    tags = [],
    imgUrl,
    images = [],
    createdAt,
    updatedAt,
  } = product;

  const categoryName = categoryId ? (categoryMap[categoryId] ?? "Sin categoría") : "Sin categoría";
  const mainImage = imgUrl || images[0] || null;
  const allImages = imgUrl ? [imgUrl, ...images.filter((img) => img !== imgUrl)] : images;
  const stockStatus = stock <= 0 ? "out" : stock <= lowStockThreshold ? "low" : "ok";
  const hasDiscount = comparePrice && comparePrice > price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        variant="drawer"
        placement="right"
        className="w-full max-w-[720px]"
        showClose={true}
      >
        <div className="flex h-full flex-col bg-(--color-neutral2) text-(--color-text)">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-(--color-border) bg-white/90 px-6 py-4 backdrop-blur">
            <div className="flex items-start gap-4">
              {mainImage && (
                <img
                  src={mainImage}
                  alt={name}
                  className="h-16 w-16 rounded-lg border border-(--color-border) object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-(--color-text-muted)">
                  Producto
                </p>
                <h2 className="mt-0.5 truncate text-lg font-semibold tracking-tight text-primary">
                  {name ?? "Producto"}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-xs text-(--color-text-muted)">SKU: {sku ?? "–"}</span>
                  {featured && <Badge variant="primary" size="sm">Destacado</Badge>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <span className="text-xs text-(--color-text-muted)">Estado</span>
                <StatusPill status={status} domain="product" />
              </div>
            </div>
          </header>

          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Pricing & Stock Cards */}
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-(--color-border) bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-(--color-text-muted)">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wide">Precio</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <Price value={price} className="text-lg font-semibold" />
                  {hasDiscount && (
                    <Price value={comparePrice} className="text-xs text-(--color-text-muted) line-through" />
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-(--color-border) bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-(--color-text-muted)">
                  <Package className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wide">Stock</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-semibold">{safeNumber(stock)}</span>
                  {stockStatus === "low" && (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  {stockStatus === "out" && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-(--color-border) bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-(--color-text-muted)">
                  <Layers className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wide">Categoría</span>
                </div>
                <p className="mt-1 truncate text-sm font-medium">{categoryName}</p>
              </div>
            </div>

            {/* Accordion Sections */}
            <Accordion
              className="divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-white shadow-sm"
              sections={[
                {
                  key: "details",
                  title: "Detalles del producto",
                  defaultOpen: true,
                  render: () => (
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Descripción</p>
                        <p className="mt-1 leading-relaxed">
                          {description ? description : <span className="text-(--color-text-muted) italic">Sin descripción</span>}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">SKU</p>
                          <p className="mt-0.5 font-mono text-sm">{sku ?? "–"}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Slug</p>
                          <p className="mt-0.5 font-mono text-sm">{slug ?? "–"}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Umbral stock bajo</p>
                          <p className="mt-0.5">{lowStockThreshold} unidades</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Stock actual</p>
                          <p className="mt-0.5 font-semibold">{safeNumber(stock)} unidades</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "categorization",
                  title: "Categorización y etiquetas",
                  render: () => (
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Categoría</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-(--color-text-muted)" />
                          <span className="font-medium">{categoryName}</span>
                        </div>
                      </div>

                      {subcategoryId && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Subcategoría</p>
                          <p className="mt-0.5">{categoryMap[subcategoryId] ?? subcategoryId}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-(--color-text-muted)">Etiquetas</p>
                        {tags.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-full border border-(--color-border) bg-(--color-neutral2) px-2 py-0.5 text-xs"
                              >
                                <Tag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1 text-(--color-text-muted) italic">Sin etiquetas</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-neutral2) px-3 py-2">
                        {featured ? (
                          <>
                            <span className="text-lg">⭐</span>
                            <span className="font-medium">Producto destacado</span>
                          </>
                        ) : (
                          <>
                            <span className="text-(--color-text-muted)">Producto estándar</span>
                          </>
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "images",
                  title: "Imágenes",
                  render: () => (
                    <div className="space-y-3">
                      {allImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {allImages.map((img, idx) => (
                            <div key={idx} className="overflow-hidden rounded-lg border border-(--color-border)">
                              <img
                                src={img}
                                alt={`${name} - imagen ${idx + 1}`}
                                className="aspect-square w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-neutral2)">
                          <p className="text-sm text-(--color-text-muted) italic">Sin imágenes</p>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: "metadata",
                  title: "Metadatos",
                  render: () => (
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-(--color-text-muted)">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Creado</span>
                        </div>
                        <p className="mt-0.5">{safeDate(createdAt)}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-(--color-text-muted)">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Actualizado</span>
                        </div>
                        <p className="mt-0.5">{safeDate(updatedAt)}</p>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
