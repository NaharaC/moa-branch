import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowUpDown, ChevronUp, ChevronDown, Filter, MoreHorizontal, Pencil, Check, X } from "lucide-react";
import { Pagination } from "../ui/Pagination.jsx";
import { IconButton } from "../ui/Button.jsx";
import { InputSm } from "../ui/Input.jsx";

/* DataTableV2
   Features (current implementation):
   - selectable rows (checkbox column)
   - row actions dropdown (Radix DropdownMenu)
   - inline editable cells (meta.editable)
   - header variants w/ custom sort icons & filter trigger
   - variants: card | plain (container styling)
*/

export function DataTableV2({
  columns,
  data,
  loading = false,
  emptyMessage = "Sin resultados",
  page,
  pageSize,
  total,
  onPageChange,
  onSortChange,
  selectable = false,
  editable = false,
  rowActions = [],
  variant = "card",
  condensed = false,
  toolbar,
  onCommitEdit, // (rowOriginal, changes) => void
  onSelectionChange, // (selectedRowsOriginal[]) => void
}) {
  const [sorting, setSorting] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const manualPaginationEnabled = onPageChange && Number.isFinite(page) && Number.isFinite(pageSize);
  const paginationState = manualPaginationEnabled ? { pageIndex: Math.max(0, page - 1), pageSize } : undefined;
  const tableState = manualPaginationEnabled ? { sorting, pagination: paginationState } : { sorting };

  const augmentedColumns = useMemo(() => {
    const cols = [...columns];
    if (selectable) {
      cols.unshift({
        id: "_select",
        size: 36,
        header: ({ table }) => (
          <input type="checkbox" aria-label="Seleccionar todos" checked={table.getIsAllRowsSelected()} onChange={(e) => table.toggleAllRowsSelected(e.target.checked)} />
        ),
        cell: ({ row }) => (
          <input type="checkbox" aria-label="Seleccionar fila" checked={row.getIsSelected?.() || false} onChange={(e) => row.toggleSelected?.(e.target.checked)} />
        ),
        meta: { align: "center" },
      });
    }
    if (rowActions?.length) {
      cols.push({
        id: "_actions",
        size: 44,
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton aria-label="Acciones" intent="neutral" size="sm" icon={<MoreHorizontal size={16} />} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="min-w-40 rounded-xl border border-(--color-border) bg-white p-1 shadow-lg" sideOffset={6}>
              {rowActions.map((action) => (
                <DropdownMenu.Item
                  key={action.label}
                  onSelect={() => action.onAction(row.original)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-(--color-secondary2) outline-none data-highlighted:bg-(--color-neutral2) data-highlighted:text-(--color-primary1)"
                >
                  {action.icon && <action.icon size={14} />}
                  {action.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ),
        meta: { align: "center" },
      });
    }
    return cols;
  }, [columns, selectable, rowActions]);

  const table = useReactTable({
    data,
    columns: augmentedColumns,
    state: { ...tableState, rowSelection },
    onSortingChange: (updater) => {
      setSorting((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const [first] = next ?? [];
        if (onSortChange && first?.id) onSortChange(first.id, first.desc ? "desc" : "asc");
        return next;
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: manualPaginationEnabled,
    getPaginationRowModel: manualPaginationEnabled ? undefined : getPaginationRowModel(),
    enableRowSelection: selectable,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (onSelectionChange) {
          const selected = Object.keys(next)
            .filter((key) => next[key])
            .map((key) => {
              const r = table.getRowModel().rowsById[key];
              return r?.original;
            })
            .filter(Boolean);
          onSelectionChange(selected);
        }
        return next;
      });
    },
    meta: { isRowEditing: (rowId) => !!editingRows[rowId] },
  });

  const headerGroups = table.getHeaderGroups();
  const visibleRows = table.getRowModel().rows;
  const showPagination = manualPaginationEnabled && Number.isFinite(total);

  const containerClasses = variant === "card"
    ? "rounded-3xl border border-(--color-border) bg-white/95 p-4 shadow-sm"
    : "border border-(--color-border) rounded-xl overflow-hidden";

  const toolbarContent = typeof toolbar === "function" ? toolbar(table) : toolbar;

  return (
    <div className="w-full">
      {toolbarContent && <div className="mb-3">{toolbarContent}</div>}
      <div className={containerClasses}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              {headerGroups.map((hg) => (
                <tr key={hg.id} className="text-(--color-secondary2)">
                  {hg.headers.map((header) => {
                    const metaAlign = header.column.columnDef.meta?.align;
                    const align = metaAlign === "right" ? "text-right" : metaAlign === "center" ? "text-center" : "text-left";
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    const headerMeta = header.column.columnDef.meta?.header || {};
                    return (
                      <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }} className={`px-3 py-2 font-semibold ${align}`}>
                        {header.isPlaceholder ? null : (
                          <div
                            role={canSort ? "button" : undefined}
                            tabIndex={canSort ? 0 : undefined}
                            onKeyDown={canSort ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); header.column.toggleSorting(); } } : undefined}
                            className={`inline-flex items-center gap-1 ${canSort ? "cursor-pointer select-none" : ""}`}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              sorted === "asc"
                                ? headerMeta.sortIcons?.asc ?? <ChevronUp size={18} className="opacity-70" />
                                : sorted === "desc"
                                  ? headerMeta.sortIcons?.desc ?? <ChevronDown size={18} className="opacity-70" />
                                  : headerMeta.sortIcons?.unsorted ?? <ArrowUpDown size={18} className="opacity-40" />
                            )}
                            {header.column.columnDef.meta?.filterable && (
                              <IconButton aria-label="Filtrar" size="xs" intent="neutral" icon={<Filter size={14} />} onClick={(e) => { e.stopPropagation(); header.column.columnDef.meta.onFilterClick?.(header.getContext()); }} />
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={headerGroups[0]?.headers.length || 1} className="px-3 py-6">
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-1/3 rounded bg-(--color-neutral3)" />
                      <div className="h-3 w-2/3 rounded bg-(--color-neutral3)" />
                      <div className="h-3 w-1/2 rounded bg-(--color-neutral3)" />
                    </div>
                  </td>
                </tr>
              )}
              {!loading && visibleRows.length === 0 && (
                <tr>
                  <td colSpan={headerGroups[0]?.headers.length || 1} className="px-3 py-8 text-center text-(--color-text-muted)">
                    {emptyMessage}
                  </td>
                </tr>
              )}
              {!loading && visibleRows.map((row) => (
                <tr key={row.id} className={`border-t border-(--color-border) ${condensed ? "h-10" : "h-14"} hover:bg-(--color-neutral2)/50 transition`}>
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta || {};
                    const metaAlign = meta.align;
                    const align = metaAlign === "right" ? "text-right" : metaAlign === "center" ? "text-center" : "text-left";
                    const isEditing = editable && editingRows[row.id] && meta.editable;
                    return (
                      <td key={cell.id} className={`px-3 ${condensed ? "py-1.5" : "py-2.5"} ${align}`}>{isEditing ? (
                        <div className="flex items-center gap-1">
                          <InputSm value={editingRows[row.id][cell.column.id] ?? cell.getValue() ?? ""} onChange={(e) => { const value = e.target.value; setEditingRows((prev) => ({ ...prev, [row.id]: { ...prev[row.id], [cell.column.id]: value }, })); }} />
                          <IconButton aria-label="Guardar" intent="primary" size="xs" icon={<Check size={14} />} onClick={() => {
                            const changes = editingRows[row.id] ?? {};
                            if (onCommitEdit && Object.keys(changes).length) {
                              onCommitEdit(row.original, changes);
                            }
                            setEditingRows((prev) => { const next = { ...prev }; delete next[row.id]; return next; });
                          }} />
                          <IconButton aria-label="Cancelar" intent="neutral" size="xs" icon={<X size={14} />} onClick={() => { setEditingRows((prev) => { const next = { ...prev }; delete next[row.id]; return next; }); }} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {editable && meta.editable && (<IconButton aria-label="Editar" size="xs" intent="neutral" icon={<Pencil size={14} />} onClick={() => { setEditingRows((prev) => ({ ...prev, [row.id]: prev[row.id] || {}, })); }} />)}
                        </div>
                      )}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showPagination && (<div className="mt-3"><Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} /></div>)}
      </div>
    </div>
  );
}

DataTableV2.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  onSortChange: PropTypes.func,
  selectable: PropTypes.bool,
  editable: PropTypes.bool,
  rowActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onAction: PropTypes.func.isRequired,
    icon: PropTypes.elementType,
  })),
  variant: PropTypes.oneOf(["card", "plain"]),
  condensed: PropTypes.bool,
  toolbar: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onCommitEdit: PropTypes.func,
  onSelectionChange: PropTypes.func,
};
