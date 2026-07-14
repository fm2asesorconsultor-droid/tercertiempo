import type { ReactNode } from "react";

type Column<T> = {
  header: string;
  cell: (item: T) => ReactNode;
};

type Props<T> = {
  items: T[];
  columns: Column<T>[];
  keyFor: (item: T) => string | number;
  emptyMessage?: string;
};

export function DataTable<T>({ items, columns, keyFor, emptyMessage = "Sin registros." }: Props<T>) {
  if (items.length === 0) {
    return <p className="text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default">
      <table className="w-full text-left text-sm">
        <thead className="bg-background-surface text-text-secondary">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {items.map((item) => (
            <tr key={keyFor(item)} className="hover:bg-background-surface/50">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-3 align-middle">
                  {col.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
