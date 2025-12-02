"use client";

export interface FilterOption {
  label: string;
  value: string | number;
}

interface FiltersProps {
  filters: {
    options: FilterOption[];
    selected: string;
    placeholder?: string;
    onChange: (value: string) => void;
  }[];
}

export default function Filters({ filters }: FiltersProps) {
  return (
    <div className="flex items-center gap-3">
      {filters.map((filter, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2"
        >
          <select
            value={filter.selected}
            onChange={(e) => filter.onChange(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-400"
          >
            <option value="">{filter.placeholder || "All"}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
