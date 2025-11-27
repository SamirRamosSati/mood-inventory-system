"use client";

type Column = {
  key: string;
  label: string;
};

type TableProps = {
  columns: Column[];
  data: any[];
};

export default function Table({ columns, data }: TableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b">
          {columns.map((col) => (
            <th key={col.key} className="p-3 text-sm font-semibold text-black">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b hover:bg-gray-50 transition">
            {columns.map((col) => (
              <td key={col.key} className="p-3 text-sm text-gray-800">
                {item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
