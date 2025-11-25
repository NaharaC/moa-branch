import React, { useState, useMemo } from "react";
import { Mail, Phone, Calendar, RefreshCw, UserPlus, MoreHorizontal, Eye, Edit3, Ban } from "lucide-react";
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
import { Badge } from "../../../components/ui/Badge.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/radix/DropdownMenu.jsx";
import { customersDb } from "../../../mocks/database/customers.js";
import { formatDate_ddMMyyyy } from "../../../utils/date.js";

const CUSTOMER_STATUS_OPTIONS = [
  { label: "Todos los estados", value: "" },
  { label: "Activo", value: "active" },
  { label: "Inactivo", value: "inactive" },
];

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [onlyOptIn, setOnlyOptIn] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const [condensed, setCondensed] = useState(false);

  const limit = 20;
  const customers = customersDb?.users ?? [];

  // Filtrado de datos
  const filteredData = useMemo(() => {
    let filtered = [...customers];

    // Búsqueda por nombre o email
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de opt-in
    if (onlyOptIn) {
      filtered = filtered.filter((c) => c.marketingOptIn);
    }

    // Filtro por estado (simulado)
    if (statusFilter) {
      // Como no tenemos campo status real, usamos marketingOptIn como proxy
      if (statusFilter === "active") {
        filtered = filtered.filter((c) => c.marketingOptIn);
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((c) => !c.marketingOptIn);
      }
    }

    return filtered;
  }, [customers, search, onlyOptIn, statusFilter]);

  // Paginación
  const total = filteredData.length;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredData.slice(start, end);
  }, [filteredData, page, limit]);

  // Definición de columnas
  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Cliente",
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <div className="flex flex-col gap-0.5 px-1 py-2">
              <span className="text-sm font-medium text-(--text-strong)">
                {customer.firstName} {customer.lastName}
              </span>
              <span className="flex items-center gap-1 text-xs text-(--color-text-muted)">
                <Mail className="h-3 w-3" />
                {customer.email}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => {
          const customer = row.original;
          return customer.phone ? (
            <div className="flex items-center gap-1 px-1 py-2 text-sm text-(--text-weak)">
              <Phone className="h-3.5 w-3.5" />
              {customer.phone}
            </div>
          ) : (
            <span className="px-1 py-2 text-sm text-(--color-text-muted)">—</span>
          );
        },
      },
      {
        id: "marketing",
        header: "Marketing",
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <div className="px-1 py-2">
              {customer.marketingOptIn ? (
                <Badge variant="success" size="sm">Opt-in</Badge>
              ) : (
                <Badge variant="neutral" size="sm">Sin permiso</Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Registro",
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <div className="flex items-center gap-1 px-1 py-2 text-sm text-(--text-weak)">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate_ddMMyyyy(customer.createdAt)}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <div className="flex items-center justify-end px-1 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    aria-label={`Acciones para ${customer.firstName}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onSelect={() => {
                      console.log("Ver perfil:", customer);
                      // TODO: Abrir modal o navegar a detalle
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      console.log("Editar cliente:", customer);
                      // TODO: Abrir formulario de edición
                    }}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      if (confirm(`¿Desactivar a ${customer.firstName} ${customer.lastName}?`)) {
                        console.log("Desactivar cliente:", customer);
                        // TODO: Implementar desactivación
                      }
                    }}
                    className="text-(--color-error)"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Desactivar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  const clearAll = () => {
    setSearch("");
    setStatusFilter("");
    setOnlyOptIn(false);
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
          placeholder="Buscar por nombre, email…"
        />
        <ToolbarSpacer />
        <FilterSelect
          label="Estado"
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
            if (v) {
              setActiveTags((tags) => [
                {
                  key: "status",
                  value: v,
                  label: `Estado: ${CUSTOMER_STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v}`,
                },
                ...tags.filter((t) => t.key !== "status"),
              ]);
            } else {
              setActiveTags((tags) => tags.filter((t) => t.key !== "status"));
            }
          }}
          options={CUSTOMER_STATUS_OPTIONS}
        />
        <ToolbarSpacer />
        <QuickFilterPill
          active={onlyOptIn}
          onClick={() => {
            setOnlyOptIn((v) => !v);
            setPage(1);
          }}
        >
          Solo Opt-in
        </QuickFilterPill>
        <ToolbarSpacer />
        <FilterTags
          tags={activeTags}
          onRemove={(tag) => {
            setActiveTags((tags) =>
              tags.filter((t) => !(t.key === tag.key && t.value === tag.value))
            );
            if (tag.key === "status") setStatusFilter("");
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
            onClick={() => {
              console.log("Refrescar datos");
              // TODO: Implementar refetch cuando tengamos API real
            }}
            leadingIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refrescar
          </Button>
          <Button
            appearance="solid"
            intent="primary"
            size="sm"
            leadingIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => {
              console.log("Crear nuevo cliente");
              // TODO: Abrir modal/formulario
            }}
          >
            Nuevo cliente
          </Button>
        </div>
      </TableToolbar>
    ),
    [search, statusFilter, onlyOptIn, activeTags, condensed]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-sans text-xl font-semibold tracking-tight text-primary">
            Clientes
          </h1>
          <p className="text-sm text-(--text-weak)">
            Gestiona la comunidad de usuarios registrados en MOA. {total} clientes en total.
          </p>
        </div>
      </div>

      {/* Tabla con toolbar integrado */}
      <DataTableV2
        columns={columns}
        data={paginatedData}
        loading={false}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        toolbar={toolbar}
        condensed={condensed}
        variant="card"
      />
    </div>
  );
}
