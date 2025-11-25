import React, { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";

import { DataTableV2 } from "../../../../components/data-display/DataTableV2.jsx";
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
} from "../../../../components/data-display/TableToolbar.jsx";
import { Button } from "../../../../components/ui/Button.jsx";

import { useAdminOrders } from "../../hooks/useAdminOrders.js";
import { buildOrderColumns } from "../../utils/ordersColumns.jsx";
import OrdersDrawer from "../../components/OrdersDrawer.jsx";
import { ordersApi } from "../../../../services/orders.api.js";

const ORDER_STATUS_OPTIONS = [
  { label: "Todos los estados", value: "" },
  { label: "Pendiente", value: "pending" },
  { label: "Procesando", value: "processing" },
  { label: "Enviada", value: "shipped" },
  { label: "Completada", value: "fulfilled" },
  { label: "Cancelada", value: "cancelled" },
];

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTags, setActiveTags] = useState([]);
  const [condensed, setCondensed] = useState(false);

  const limit = 20;

  const { items, total, isLoading, refetch } = useAdminOrders({
    page,
    limit,
    status,
    search,
  });

  const columns = useMemo(
    () =>
      buildOrderColumns({
        onOpen: (order) => setSelectedOrder(order),
        onUpdateStatus: (order, newStatus) => {
          console.log("Actualizar estado de orden:", order.number, "a", newStatus);
          // TODO: Implementar llamada a API para actualizar estado
          // await ordersApi.updateStatus(order.id, newStatus);
          refetch();
        },
        onCancel: async (order) => {
          if (!window.confirm(`¿Estás seguro de cancelar la orden ${order.number}?`)) return;

          try {
            await ordersApi.cancel(order.id);
            refetch();
          } catch (error) {
            console.error("Error al cancelar la orden:", error);
            window.alert("No se pudo cancelar la orden. Intenta nuevamente.");
          }
        },
      }),
    [refetch],
  );

  const clearAll = () => {
    setSearch("");
    setStatus("");
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
          placeholder="Buscar por número, cliente…"
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
                { key: "status", value: v, label: `Estado: ${ORDER_STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v}` },
                ...tags.filter((t) => t.key !== "status"),
              ]);
            } else {
              setActiveTags((tags) => tags.filter((t) => t.key !== "status"));
            }
          }}
          options={ORDER_STATUS_OPTIONS}
        />
        <ToolbarSpacer />
        <QuickFilterPill
          active={status === "pending"}
          onClick={() => {
            const newStatus = status === "pending" ? "" : "pending";
            setStatus(newStatus);
            setPage(1);
          }}
        >
          Pendientes
        </QuickFilterPill>
        <QuickFilterPill
          active={status === "fulfilled"}
          onClick={() => {
            const newStatus = status === "fulfilled" ? "" : "fulfilled";
            setStatus(newStatus);
            setPage(1);
          }}
        >
          Completadas
        </QuickFilterPill>
        <ToolbarSpacer />
        <FilterTags
          tags={activeTags}
          onRemove={(tag) => {
            setActiveTags((tags) => tags.filter((t) => !(t.key === tag.key && t.value === tag.value)));
            if (tag.key === "status") setStatus("");
          }}
        />
        <div className="ml-auto flex items-center gap-2">
          <ColumnsMenuButton table={table} />
          <ClearFiltersButton onClear={clearAll} />
          <LayoutToggleButton condensed={condensed} onToggle={() => setCondensed((v) => !v)} />
          <Button
            appearance="ghost"
            intent="neutral"
            size="sm"
            onClick={() => refetch()}
            leadingIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refrescar
          </Button>
        </div>
      </TableToolbar>
    ),
    [search, status, activeTags, condensed, refetch],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-xl font-semibold tracking-tight text-(--text-strong)">
            Pedidos
          </h1>
          <p className="text-sm text-(--text-weak)">
            Revisa y administra las órdenes de la tienda MOA.
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

      {/* Drawer detalle */}
      <OrdersDrawer
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
