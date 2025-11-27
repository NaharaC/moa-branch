import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "@components/ui/Button.jsx";
import { TooltipNeutral } from "@components/ui/Tooltip.jsx";
import { LayoutDashboard, Package, Warehouse, Users, Settings, LogOut, Store, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { API_PATHS } from "@config/api-paths.js";

const navItems = [
  // { label: "Resumen", to: API_PATHS.admin.dashboard, icon: LayoutDashboard },
  // { label: "Pedidos", to: API_PATHS.admin.orders, icon: Package },
  { label: "Productos", to: API_PATHS.admin.products, icon: Warehouse },
  // { label: "Colecciones", to: API_PATHS.admin.collections, icon: Layers },
  // { label: "Clientes", to: API_PATHS.admin.customers, icon: Users },
  // { label: "Ajustes", to: API_PATHS.admin.settings, icon: Settings },
];


export default function EntornoAdmin({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isExpanded, setIsExpanded] = useState(true);

  // Cargar preferencia desde localStorage
  useEffect(() => {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
      const raw = globalThis.localStorage.getItem("moa.admin.sidebarExpanded");
      if (raw != null) setIsExpanded(raw === "true");
    }
  }, []);

  // Persistir preferencia
  useEffect(() => {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
      globalThis.localStorage.setItem("moa.admin.sidebarExpanded", String(isExpanded));
    }
  }, [isExpanded]);

 

  return (
  <div className="admin-shell min-h-screen bg-(--background) text-body">
      <header className="h-0" />

      <div className="flex min-h-screen relative">
        <aside
          className={`${isExpanded ? "w-56" : "w-20"} sticky top-0 h-screen flex flex-col items-center bg-white border-r border-neutral-100 py-5 px-2.5 transition-[width,padding] duration-400 ease-in-out`}
        >
          <div className="mb-5 w-full grid grid-cols-3 items-center">
            <div />

            <a href={API_PATHS.admin.dashboard} className="justify-self-center flex items-center gap-2" title="MOA Admin">
              {isExpanded ? (
                <>
                  <span className="title-serif text-primary text-xl font-semibold tracking-tight">MOA</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-secondary">Admin</span>
                </>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center title-serif text-primary text-xl font-semibold tracking-tight">
                  M
                </span>
              )}
            </a>

            {isExpanded && (
              <div className="justify-self-end">
                <Button
                  appearance="ghost"
                  size="sm"
                  onClick={() => setIsExpanded((v) => !v)}
                  className="h-8 w-8 rounded-full p-0 hover:bg-neutral-100 transition-colors flex items-center justify-center"
                  aria-label="Contraer"
                >
                  <ChevronLeft className="h-4 w-4 text-secondary" />
                </Button>
              </div>
            )}
          </div>

          {/* Botón toggle fuera del sidebar en modo compacto */}
          {!isExpanded && (
            <div className="absolute top-5 -right-3 z-10">
              <TooltipNeutral label="Expandir" position="right">
                <Button
                  appearance="ghost"
                  size="sm"
                  onClick={() => setIsExpanded((v) => !v)}
                  className="rounded-full p-1.5 bg-white border border-neutral-200 shadow-md hover:bg-neutral-100 hover:border-primary transition-colors"
                  aria-label="Expandir"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                </Button>
              </TooltipNeutral>
            </div>
          )}

          {/* Contenedor scroll interno para que el aside no recorte los tooltips */}
          <div className="flex-1 w-full overflow-y-auto overflow-x-visible">
          {/* Navegación principal */}
          <nav className="flex flex-col gap-2 mb-4 items-stretch w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isDashboard = item.to === API_PATHS.admin.dashboard;
              const isActive = isDashboard ? currentPath === item.to : currentPath.startsWith(item.to);
              const buttonNode = (
                <Button
                  key={item.to}
                  appearance="ghost"
                  size="sm"
                  as={Link}
                  to={item.to}
                  className={`sidebar-link rounded-lg ${isExpanded ? "w-full pl-3 pr-2 py-2.5" : "w-full px-2.5 py-2.5"} text-xs font-medium transition-colors duration-200 ${isActive ? "bg-neutral-100 text-primary border-r-4 border-primary" : "text-neutral-700 hover:text-primary hover:bg-neutral-50"}`}
                  aria-label={!isExpanded ? item.label : undefined}
                >
                  {isExpanded ? (
                    <span className="btn-label flex items-center gap-2 w-[103px]">
                      {Icon && (
                        <span className="flex items-center justify-center w-5 shrink-0">
                          <Icon className="h-5 w-5 stroke-[1.5] text-primary" aria-hidden />
                        </span>
                      )}
                      <span className="text-xs text-left">{item.label}</span>
                    </span>
                  ) : (
                    Icon && (
                      <span className="flex items-center justify-center w-5">
                        <Icon className="h-5 w-5 stroke-[1.5] text-primary" aria-hidden />
                      </span>
                    )
                  )}
                </Button>
              );

              return isExpanded ? (
                buttonNode
              ) : (
                <TooltipNeutral key={item.to} label={item.label} position="right">
                  {buttonNode}
                </TooltipNeutral>
              );
            })}
          </nav>
          {/* Separador con espacio visual */}
          <div className="my-4 h-px w-full bg-neutral-200" />

          {/* Acciones secundarias */}
          <div className="mt-auto w-full flex flex-col justify-around gap-1 pb-5">
            {isExpanded ? (
              <Button
                appearance="ghost"
                size="sm"
                as={Link}
                to={API_PATHS.home.landing}
                className={`sidebar-link rounded-lg w-full pl-3 pr-2 py-2.5 text-xs font-medium transition-colors duration-200 text-neutral-700 hover:text-primary hover:bg-neutral-50`}
              >
                <span className="btn-label flex items-center gap-2 w-[103px]">
                  <span className="flex items-center justify-center w-5 shrink-0">
                    <Store className="h-5 w-5 stroke-[1.5] text-primary" aria-hidden />
                  </span>
                  <span className="text-xs text-left">Visitar tienda</span>
                </span>
              </Button>
            ) : (
              <TooltipNeutral label="Visitar tienda" position="right">
                <Button
                  appearance="ghost"
                  size="sm"
                  as={Link}
                  to={API_PATHS.home.landing}
                  className={`sidebar-link rounded-lg w-full px-2.5 py-2.5 text-xs font-medium transition-colors duration-200 text-neutral-700 hover:text-primary hover:bg-neutral-50`}
                  aria-label="Visitar tienda"
                >
                  <span className="flex items-center justify-center w-5">
                    <Store className="h-5 w-5 stroke-[1.5] text-primary" aria-hidden />
                  </span>
                </Button>
              </TooltipNeutral>
            )}

            <div className="my-2 h-px w-full bg-neutral-200" />

            {isExpanded ? (
              <Button
                appearance="ghost"
                size="sm"
                className={`sidebar-link rounded-lg w-full pl-3 pr-2 py-2.5 text-xs font-medium transition-colors duration-200 text-neutral-700 hover:text-primary hover:bg-neutral-50`}
                onClick={() => {
                  if (typeof globalThis !== "undefined" && globalThis.localStorage) {
                    globalThis.localStorage.removeItem('token');
                    globalThis.localStorage.removeItem('moa.user');
                    globalThis.location.href = API_PATHS.auth.login;
                  }
                }}
              >
                <span className="btn-label flex items-center gap-2 w-[103px]">
                  <span className="flex items-center justify-center w-5 shrink-0">
                    <LogOut className="h-5 w-5 stroke-[1.5] text-primary" aria-hidden />
                  </span>
                  <span className="text-xs text-left">Cerrar sesión</span>
                </span>
              </Button>
            ) : (
              <TooltipNeutral label="Cerrar sesión" position="right">
                <Button
                  appearance="ghost"
                  size="sm"
                  className={`sidebar-link rounded-lg w-full px-2.5 py-2.5 text-xs font-medium transition-colors duration-200 text-neutral-700 hover:text-primary hover:bg-neutral-50`}
                  aria-label="Cerrar sesión"
                  onClick={() => {
                    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
                      globalThis.localStorage.removeItem('token');
                      globalThis.localStorage.removeItem('moa.user');
                      globalThis.location.href = API_PATHS.auth.login;
                    }
                  }}
                >
                  <span className="flex items-center justify-center w-5">
                    <LogOut className="h-5 w-5 stroke-[1.5] text-primary" aria-hidden />
                  </span>
                </Button>
              </TooltipNeutral>
            )}
          </div>
          </div>
        </aside>
  <main className="flex-1 overflow-auto p-8 bg-(--background)">{children}</main>
      </div>
    </div>
  );
}

EntornoAdmin.propTypes = {
  children: PropTypes.node,
};
