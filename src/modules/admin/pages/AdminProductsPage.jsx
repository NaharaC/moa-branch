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
// import { handleError } from "../utils/";

export default function ProductsAdminPage() {

  const navigate = useNavigate();

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
              setSelectedProductEdit(null);
              refetch();
            } catch (error) {
              console.error("Error eliminando el producto:", error);
              // handleError(error, 'No se pudo eliminar el producto');
            }
          }
        },
      }),
      
    [categoryMap, refetch]
  );

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
    [search, status, onlyLowStock, activeTags, condensed, refetch]
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
        onSave={(data) => {
          console.log("Save product:", data);
          // TODO: Implement save logic
          setSelectedProductEdit(null);
          refetch();
        }}
      />
    </div>
  );
}
