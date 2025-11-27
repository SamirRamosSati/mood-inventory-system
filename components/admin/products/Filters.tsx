"use client";

interface FiltersProps {
  brands: string[];
  categories: string[];
  selectedBrand: string;
  selectedCategory: string;
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function Filters({
  brands,
  categories,
  selectedBrand,
  selectedCategory,
  onBrandChange,
  onCategoryChange,
}: FiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-2">
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-400"
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl px-4 py-2">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-400"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
