import type { Key, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  /** Applied to both `<th>` and `<td>` for column alignment / width hints. */
  headerClassName?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  rowKey?: (row: T, index: number) => Key;
  /** Accessible table caption (recommended for admin tables). */
  caption?: string;
  className?: string;
};

/**
 * Responsive data table: horizontal scroll on narrow viewports (`min-w-[640px]` inner table).
 * Styled for dark AVASC admin / operational workflows.
 */
export function DataTable<T>({
  columns,
  rows,
  emptyMessage = "No records found.",
  rowKey,
  caption,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[640px] w-full border-collapse text-sm md:min-w-0">
          {caption ? (
            <caption className="border-b border-[var(--avasc-divider)] px-4 py-3 text-left text-xs font-medium text-[var(--avasc-text-muted)]">
              {caption}
            </caption>
          ) : null}
          <thead className="bg-[var(--avasc-bg-soft)]">
            <tr className="shadow-[0_1px_0_0_var(--avasc-divider)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--avasc-text-secondary)]",
                    column.headerClassName,
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--avasc-text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={rowKey ? rowKey(row, index) : index}
                  className="border-t border-[var(--avasc-divider)] transition-colors hover:bg-white/[0.03]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-4 align-top text-[var(--avasc-text-primary)]",
                        column.className
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
