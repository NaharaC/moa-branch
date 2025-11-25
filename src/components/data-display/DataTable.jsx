//path/src/components/data/TanstackDataTable.jsx
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Pagination } from "../ui/Pagination.jsx";

export function TanstackDataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "Sin resultados",
  // sort: usamos TanStack internamente y notificamos al padre
  onSortChange, // (by, dir)
  // paginación controlada
  page,
  pageSize,
  total,
  onPageChange,
  toolbar,
  condensed = false,
  meta,
}) {
  const [sorting, setSorting] = React.useState([]);

  const manualPaginationEnabled =
    onPageChange && Number.isFinite(page) && Number.isFinite(pageSize);
  const paginationState = manualPaginationEnabled
    ? { pageIndex: Math.max(0, page - 1), pageSize }
    : undefined;

  const tableState = manualPaginationEnabled
    ? { sorting, pagination: paginationState }
    : { sorting };

  const table = useReactTable({
    data,
    columns,
    state: tableState,
    // sorting client-side (simple) + notificamos al padre
    onSortingChange: (updater) => {
      setSorting((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const [first] = next ?? [];
        if (onSortChange && first?.id) {
          onSortChange(first.id, first.desc ? "desc" : "asc");
        }
        return next;
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: manualPaginationEnabled,
    getPaginationRowModel: manualPaginationEnabled ? undefined : getPaginationRowModel(),
    meta,
  });

  const headerCols = table.getFlatHeaders();
  const visibleRows = table.getRowModel().rows;

  const showPagination = manualPaginationEnabled && Number.isFinite(total);

  return (
    <div className="w-full">
      {toolbar && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">{toolbar}</div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const metaAlign = header.column.columnDef.meta?.align;
                  const align =
                    metaAlign === "right"
                      ? "text-right"
                      : metaAlign === "center"
                      ? "text-center"
                      : "text-left";

                  const meta = header.column.columnDef.meta || {};
                  const headerMeta = meta.header || {};
                  const showDefaultSort = headerMeta.showDefaultSortIndicator !== false;
                  const sortIcons = headerMeta.sortIcons || {};
                  const onFilterClick = headerMeta.onFilterClick;
                  const headerExtra = headerMeta.extra;
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className={`px-3 py-2 font-medium ${align}`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className={
                            header.column.getCanSort()
                              ? "inline-flex cursor-pointer select-none items-center gap-1"
                              : ""
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {showDefaultSort && (
                            ({
                              asc: sortIcons.asc ?? <span className="text-[12px] opacity-70">▲</span>,
                              desc: sortIcons.desc ?? <span className="text-[12px] opacity-70">▼</span>,
                            }[header.column.getIsSorted()] ??
                              (header.column.getCanSort()
                                ? sortIcons.unsorted ?? (
                                    <span className="text-[12px] opacity-40">⇅</span>
                                  )
                                : null))
                          )}
                          {onFilterClick && (
                            <button
                              type="button"
                              className="ml-1 rounded p-0.5 text-neutral-400 hover:text-neutral-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                onFilterClick(header.getContext());
                              }}
                              aria-label="Filtrar columna"
                            >
                              {/* Simple funnel icon */}
                              <span className="text-[12px]">⏷</span>
                            </button>
                          )}
                          {headerExtra && <span className="ml-1">{headerExtra}</span>}
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
                <td colSpan={headerCols.length} className="px-3 py-6">
                  <div className="animate-pulse space-y-2">
                    <div className="h-3 w-1/3 rounded bg-neutral-200" />
                    <div className="h-3 w-2/3 rounded bg-neutral-200" />
                    <div className="h-3 w-1/2 rounded bg-neutral-200" />
                  </div>
                </td>
              </tr>
            )}

            {!loading && visibleRows.length === 0 && (
              <tr>
                <td colSpan={headerCols.length} className="px-3 py-10 text-center text-neutral-500">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              visibleRows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t border-neutral-100 ${
                    condensed ? "h-[42px]" : "h-[54px]"
                  } hover:bg-neutral-50`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const metaAlign = cell.column.columnDef.meta?.align;
                    const align =
                      metaAlign === "right"
                        ? "text-right"
                        : metaAlign === "center"
                        ? "text-center"
                        : "text-left";
                    return (
                      <td
                        key={cell.id}
                        className={`px-3 ${condensed ? "py-1.5" : "py-2.5"} ${align}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="mt-3">
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
