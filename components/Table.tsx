"use client";

import { TableColumn } from "@/types";

interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="p-3 text-sm font-semibold text-black"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={String(item.id)}
              className="border-b hover:bg-gray-50 transition"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="p-3 text-sm text-gray-800">
                  {col.render ? col.render(item) : String(item[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
