import { LowStockProduct } from "@/types";
import { AlertTriangle } from "lucide-react";

interface Props {
  lowStockProducts: LowStockProduct[];
}

export default function LowStockList({ lowStockProducts }: Props) {
  return (
    <div className="flex flex-col min-h-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-orange-50">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200 flex-1 overflow-y-auto">
          {lowStockProducts.length === 0 ? (
            <div className="p-4 sm:p-5 md:p-6 text-center text-gray-500">
              <p>No low stock items</p>
            </div>
          ) : (
            lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition border-b last:border-b-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">
                    {product.name}
                  </p>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    {product.stock} left
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 gap-2">
                  <span className="truncate">SKU: {product.sku}</span>
                  <span className="text-gray-500 truncate">
                    {product.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
