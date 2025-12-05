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
    <div className="overflow-x-auto flex-1 flex flex-col max-h-full">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-white border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="p-3 text-sm font-semibold text-gray-900"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => (
            <tr
              key={String(item.id)}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="p-3 text-sm text-gray-600">
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
