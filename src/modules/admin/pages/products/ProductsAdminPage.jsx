//path/frontend/src/modules/admin/pages/products/ProductsAdminPage.jsx
import React from "react";
import { Plus, RefreshCw } from "lucide-react";

import { TanstackDataTable } from "../../../../components/data-display/DataTable.jsx";
import { Pagination } from "../../../../components/ui/Pagination.jsx";
import { Button } from "../../../../components/ui/Button.jsx";

import { useAdminProducts } from "../../hooks/useAdminProducts.js";
import { useCategories } from "../../../products/hooks/useCategories.js";
import { buildProductColumns } from "../../utils/ProductsColumns.jsx";
import { productsApi } from "../../../../services/products.api.js";

// import { useNavigate } from "react-router-dom";
// import { API_PATHS } from "../../../../config/api-paths.js";

export default function ProductsAdminPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [onlyLowStock, setOnlyLowStock] = React.useState(false);

  const limit = 20;

  const { items, total, totalPages, isLoading, refetch } = useAdminProducts({
    page,
    limit,
    search,
    status,
    onlyLowStock,
  });

  const { categories } = useCategories();
  const categoryMap = React.useMemo(
    () => Object.fromEntries((categories ?? []).map((c) => [c.id, c.name])),
    [categories]
  );

  const handleDelete = React.useCallback(
    async (product) => {
      if (!product?.id) {
        console.error("No product ID available");
        return;
      }

      const confirmed = window.confirm(
        `¿Está seguro que desea eliminar "${product.name}"?`
      );
      
      if (!confirmed) return;

      try {
        // Implementar la llamada a la API
        console.log("Eliminando producto:", product.id);
        await productsApi.remove(product.id);
        
        // Refrescar la lista
        await refetch();
        
        // Aquí puedes mostrar una notificación de éxito
        console.log("Producto eliminado exitosamente");
      } catch (err) {
        console.error("Error al eliminar producto:", err);
        // Aquí puedes mostrar una notificación de error
      }
    },
    [refetch]
  );

  const columns = React.useMemo(
    () =>
      buildProductColumns({
        categoryMap,
        onView: (product) => {
          console.log("view product", product);
        },
        onEdit: (product) => {
          console.log("edit product", product);
        },
        onDelete: handleDelete,
      }),
    [categoryMap, handleDelete]
  );

  // const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-sans text-xl font-semibold tracking-tight text-(--text-strong)">
            Productos
          </h1>
          <p className="text-sm text-(--text-weak)">
            Administra el catálogo y el inventario de la tienda MOA.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--color-secondary1) text-(--color-secondary1) hover:bg-(--surface-subtle)"
            aria-label="Refrescar"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

<button
  onClick={() => console.log("CLICK NATIVE")}
  style={{ padding: "10px", background: "brown", color: "white" }}
>
  Nuevo producto (TEST)
</button>


        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-subtle) px-4 py-3">
        <div className="min-w-[200px] flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, SKU…"
            className="w-full rounded-full border border-(--border-subtle) bg-white px-3 py-1.5 text-sm"
          />
        </div>

        <div className="w-full sm:w-[180px]">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-full border border-(--border-subtle) bg-white px-3 py-1.5 text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="borrador">Borrador</option>
            <option value="archivado">Archivado</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-(--text-weak)">
          <input
            type="checkbox"
            checked={onlyLowStock}
            onChange={(e) => {
              setOnlyLowStock(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 rounded border-(--border-subtle)"
          />
          <span>Solo stock crítico</span>
        </label>
      </div>

      <TanstackDataTable
        columns={columns}
        data={items}
        loading={isLoading}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
      />

      <div className="mt-3">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
