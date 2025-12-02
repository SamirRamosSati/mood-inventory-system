import { LowStockProduct } from "@/types";

interface Props {
  lowStockProducts: LowStockProduct[];
}

export default function LowStockList({ lowStockProducts }: Props) {
  return (
    <div className="bg-white rounded-xl h-fit shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-md font-semibold text-gray-900">Low Stock Alert</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {lowStockProducts.map((product) => (
          <div key={product.id} className="p-4 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900 text-sm">
                {product.name}
              </p>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                {product.stock} left
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>SKU: {product.sku}</span>
              <span className="text-gray-500">{product.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
