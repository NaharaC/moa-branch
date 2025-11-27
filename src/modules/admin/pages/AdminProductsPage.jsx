//path/frontend/src/modules/admin/pages/products/ProductsAdminPage.jsx
import React, { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import ProductDetailDrawer from "../components/ProductDetailDrawer.jsx";
import ProductDrawer from "../components/ProductDrawer.jsx";

import { DataTableV2 } from "../../../components/data-display/DataTableV2.jsx";
import {
  TableToolbar,
  TableSearch,
  FilterSelect,
  FilterTags,
  ToolbarSpacer,
  QuickFilterPill,
  ColumnsMenuButton,
  ClearFiltersButton,
  LayoutToggleButton,
} from "../../../components/data-display/TableToolbar.jsx";
import { Button } from "../../../components/ui/Button.jsx";

import { useAdminProducts } from "../hooks/useAdminProducts.js";
import { useCategories } from "../../products/hooks/useCategories.js";
import { buildProductColumns } from "../utils/ProductsColumns.jsx";
import { DEFAULT_PAGE_SIZE } from "../../../config/constants.js";
import { PRODUCT_STATUS_OPTIONS } from "../../../config/status-options.js";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../../../services/products.api.js";
import { useQueryClient } from "@tanstack/react-query";

// import { handleError } from "../utils/";

export default function ProductsAdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const [condensed, setCondensed] = useState(false);
  const [selectedProductView, setSelectedProductView] = useState(null);
  const [selectedProductEdit, setSelectedProductEdit] = useState(null);

  const limit = DEFAULT_PAGE_SIZE;

  const { items, total, isLoading, refetch } = useAdminProducts({
    page,
    limit,
    search,
    status,
    onlyLowStock,
  });

  const { categories } = useCategories();
  const categoryMap = useMemo(
    () => Object.fromEntries((categories ?? []).map((c) => [c.id, c.name])),
    [categories]
  );

  const columns = useMemo(
    () =>
      buildProductColumns({
        categoryMap,
        onView: (product) => {
          setSelectedProductView(product);
        },
        onEdit: (product) => {
          setSelectedProductEdit(product);
        },
        onDuplicate: (product) => {
          console.log("duplicate product", product);
          // TODO: Implement duplicate logic
          // Create a copy with new SKU and set to draft status
          refetch();
        },
        onDelete: async (product) => {
          if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
            try {
              await productsApi.remove(product.id);

              queryClient.invalidateQueries(["admin-products"]);
              queryClient.invalidateQueries(["products"]); // opcional

              setSelectedProductEdit(null);
            } catch (error) {
              console.error("Error eliminando el producto:", error);
            }
          }
        },
      }),

    [categoryMap, refetch]
  );

  // Escuchar eventos de producto creado desde la página de creación
  // para forzar un refetch del listado sin necesidad de navegación.
  React.useEffect(() => {
    const handler = () => {
      // ev.detail puede contener el producto creado; por ahora solo refetch
      try {
        refetch();
      } catch (err) {
        console.error("Error refetch after product created event:", err);
      }
    };

    window.addEventListener("admin:product-created", handler);
    return () => window.removeEventListener("admin:product-created", handler);
  }, [refetch]);

  // Chequear si hubo un producto creado mientras esta vista estaba desmontada.
  // NewProductPage escribe una marca en localStorage que usamos para forzar refetch
  // la próxima vez que el listado se monta.
  React.useEffect(() => {
    try {
      const ts = window.localStorage.getItem("admin:product-created-ts");
      if (ts) {
        // limpiamos la marca y forzamos refetch
        window.localStorage.removeItem("admin:product-created-ts");
        refetch();
      }
    } catch {
      // si localStorage no está disponible, ignoramos
    }
  }, [refetch]);

  const clearAll = () => {
    setSearch("");
    setStatus("");
    setOnlyLowStock(false);
    setActiveTags([]);
    setPage(1);
  };

  const toolbar = useMemo(
    () => (table) => (
      <TableToolbar>
        <TableSearch
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Buscar por nombre, SKU…"
        />
        <ToolbarSpacer />
        <FilterSelect
          label="Estado"
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
            if (v) {
              setActiveTags((tags) => [
                {
                  key: "status",
                  value: v,
                  label: `Estado: ${PRODUCT_STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v}`,
                },
                ...tags.filter((t) => t.key !== "status"),
              ]);
            } else {
              setActiveTags((tags) => tags.filter((t) => t.key !== "status"));
            }
          }}
          options={PRODUCT_STATUS_OPTIONS}
        />
        <ToolbarSpacer />
        <QuickFilterPill
          active={onlyLowStock}
          onClick={() => {
            setOnlyLowStock((v) => !v);
            setPage(1);
          }}
        >
          Stock crítico
        </QuickFilterPill>
        <ToolbarSpacer />
        <FilterTags
          tags={activeTags}
          onRemove={(tag) => {
            setActiveTags((tags) =>
              tags.filter((t) => !(t.key === tag.key && t.value === tag.value))
            );
            if (tag.key === "status") setStatus("");
          }}
        />
        <div className="ml-auto flex items-center gap-2">
          <ColumnsMenuButton table={table} />
          <ClearFiltersButton onClear={clearAll} />
          <LayoutToggleButton
            condensed={condensed}
            onToggle={() => setCondensed((v) => !v)}
          />
          <Button
            appearance="ghost"
            intent="neutral"
            size="sm"
            onClick={() => refetch()}
            leadingIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refrescar
          </Button>
          <Button
            appearance="solid"
            intent="primary"
            size="sm"
            leadingIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              console.log("CLICK ok!");
              navigate("/admin/productos/nuevo");
            }}
          >
            Nuevo producto
          </Button>
        </div>
      </TableToolbar>
    ),
    [search, status, onlyLowStock, activeTags, condensed, refetch, navigate]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-sans text-xl font-semibold tracking-tight text-primary">
            Productos
          </h1>
          <p className="text-sm text-(--text-weak)">
            Administra el catálogo y el inventario de la tienda MOA.
          </p>
        </div>
      </div>

      {/* Tabla con toolbar integrado */}
      <DataTableV2
        columns={columns}
        data={items}
        loading={isLoading}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        toolbar={toolbar}
        condensed={condensed}
        variant="card"
      />

      {/* Drawers */}
      <ProductDetailDrawer
        open={!!selectedProductView}
        product={selectedProductView}
        onClose={() => setSelectedProductView(null)}
        categoryMap={categoryMap}
      />

      <ProductDrawer
        open={!!selectedProductEdit}
        product={selectedProductEdit}
        onClose={() => setSelectedProductEdit(null)}
        onSave={async (data) => {
          try {
            if (!selectedProductEdit?.id) {
              console.error("No product ID for update");
              return;
            }
            console.log(
              "Updating product:",
              selectedProductEdit.id,
              "with data:",
              data
            );
            await productsApi.update(selectedProductEdit.id, data);
            console.log("Product updated successfully");
            setSelectedProductEdit(null);
            await refetch();
          } catch (err) {
            console.error("Error updating product:", err);
          }
        }}
      />
    </div>
  );
}
