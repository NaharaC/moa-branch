import { useMemo } from "react";
import { Activity, Layers, Package, Settings, TrendingUp, Users } from "lucide-react";

import { useAdminOrders } from "../hooks/useAdminOrders.js";
import { useAdminProducts } from "../hooks/useAdminProducts.js";

import { Button } from "../../../components/ui/Button.jsx";
import { StatusPill } from "../../../components/ui/StatusPill.jsx";
import { formatCurrencyCLP } from "../../../utils/currency.js";
import { formatDate_ddMMyyyy, relativeTime } from "../../../utils/date.js";
import { ORDER_STATUS_MAP } from "../../../config/status-maps.js";
import { API_PATHS } from "../../../config/api-paths.js";

const SUMMARY_ORDER_LIMIT = 500;

const formatCount = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return number.toLocaleString("es-CL");
};

export default function AdminDashboardPage() {
  const {
    items: orders = [],
    total: totalOrdersRaw,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useAdminOrders({ page: 1, limit: SUMMARY_ORDER_LIMIT });

  const {
    total: totalProductsRaw,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useAdminProducts({ page: 1, limit: 1 });

  const totalOrders = Number.isFinite(Number(totalOrdersRaw)) ? Number(totalOrdersRaw) : orders.length;
  const totalProducts = Number.isFinite(Number(totalProductsRaw)) ? Number(totalProductsRaw) : 0;

  const dashboardData = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);

    const uniqueCustomers = new Set(
      orders
        .map((order) => String(order.userId ?? order.userEmail ?? "")) // fallback for anonymous
        .filter(Boolean),
    ).size;

    const statusCounts = orders.reduce((acc, order) => {
      const key = String(order.status ?? "pending").toLowerCase();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return {
      revenue,
      uniqueCustomers,
      statusCounts,
      latestOrders: orders.slice(0, 4),
    };
  }, [orders]);

  const statusEntries = Object.entries(ORDER_STATUS_MAP).map(([status, config]) => ({
    status,
    label: config.label,
    variant: config.variant,
    count: dashboardData.statusCounts[status] ?? 0,
  }));

  const totalStatusCount = statusEntries.reduce((sum, entry) => sum + entry.count, 0);

  const statsCards = [
    {
      label: "Pedidos totales",
      helper: "Pedidos registrados",
      icon: Activity,
      value: ordersLoading ? "…" : formatCount(totalOrders),
    },
    {
      label: "Ingresos estimados",
      helper: "Pedidos completados",
      icon: TrendingUp,
      value: ordersLoading ? "..." : formatCurrencyCLP(dashboardData.revenue),
    },
    {
      label: "Clientes únicos",
      helper: "Desde los pedidos",
      icon: Users,
      value: ordersLoading ? "…" : formatCount(dashboardData.uniqueCustomers),
    },
    {
      label: "Catálogo activo",
      helper: "Productos disponibles",
      icon: Layers,
      value: productsLoading ? "…" : formatCount(totalProducts),
    },
  ];

  const quickActions = [
    { label: "Pedidos", to: API_PATHS.admin.orders, icon: Package },
    { label: "Productos", to: API_PATHS.admin.products, icon: Layers },
    { label: "Clientes", to: API_PATHS.admin.customers, icon: Users },
    { label: "Ajustes", to: API_PATHS.admin.settings, icon: Settings },
  ];

  const handleRefresh = () => {
    refetchOrders?.();
    refetchProducts?.();
  };

  const isLoading = ordersLoading || productsLoading;
  const hasError = Boolean(ordersError || productsError);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-400">Administración</p>
        <h1 className="text-3xl font-semibold text-primary">Panel central</h1>
        <p className="text-sm text-neutral-500">Visión general de pedidos, clientes y catálogo.</p>
      </header>

      {hasError && (
        <div className="rounded-3xl border border-error/30 bg-error/[0.06] p-5 text-sm text-error">
          <p>No se pudo cargar la información del panel.</p>
          <Button appearance="ghost" intent="neutral" size="sm" className="mt-3" onClick={handleRefresh}>
            Reintentar
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="flex flex-col gap-3 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 text-sm text-neutral-500">
                <span>{card.label}</span>
                <Icon className="h-4 w-4 text-(--color-secondary1)" aria-hidden />
              </div>
              <p className="text-3xl font-semibold tracking-tight text-(--text-strong)">{card.value}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">{card.helper}</p>
            </article>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Pedidos</p>
              <h2 className="text-xl font-semibold text-primary">Últimos pedidos</h2>
            </div>
            <Button appearance="ghost" intent="neutral" size="sm" onClick={handleRefresh}>
              Actualizar
            </Button>
          </header>
          {isLoading ? (
            <div className="mt-6 py-10 text-center text-sm text-neutral-500">Cargando...</div>
          ) : dashboardData.latestOrders.length ? (
            <div className="mt-6 space-y-4">
              {dashboardData.latestOrders.map((order) => (
                <div
                  key={order.id ?? order.number}
                  className="flex flex-col gap-2 rounded-2xl border border-neutral-100 px-4 py-3 shadow-[0_5px_12px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-(--text-strong)">{order.number}</p>
                      <p className="text-xs text-neutral-500">
                        {formatDate_ddMMyyyy(order.createdAt, "—")} •{" "}
                        {relativeTime(order.createdAt, new Date(), "—")}
                      </p>
                    </div>
                    <StatusPill status={order.status} domain="order" />
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-neutral-500">
                    <span>Total</span>
                    <strong className="text-sm text-(--text-strong)">{formatCurrencyCLP(order.total)}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-neutral-500">Aún no hay pedidos registrados.</p>
          )}
        </article>

        <article className="flex flex-col gap-5 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Estados</p>
              <h2 className="text-xl font-semibold text-primary">Distribución</h2>
            </div>
            <span className="text-xs font-semibold text-neutral-500">
              {totalStatusCount ? `${totalStatusCount} pedidos` : "Sin datos"}
            </span>
          </div>
          {totalStatusCount ? (
            <div className="space-y-4">
              {statusEntries.map((entry) => (
                <div key={entry.status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-medium text-neutral-600">
                    <span className="flex items-center gap-2">
                      <StatusPill status={entry.status} domain="order" className="text-[10px]" />
                      {entry.label}
                    </span>
                    <span className="text-xs font-semibold text-(--text-strong)">{entry.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-(--surface-subtle)">
                    <div
                      className="h-full rounded-full bg-(--color-primary1)"
                      style={{
                        width: `${Math.max(4, Math.round((entry.count / totalStatusCount) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Los pedidos se registran aquí en cuanto haya actividad.</p>
          )}
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  appearance="ghost"
                  intent="primary"
                  size="sm"
                  to={action.to}
                  leadingIcon={<Icon className="h-4 w-4" aria-hidden />}
                >
                  {action.label}
                </Button>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
