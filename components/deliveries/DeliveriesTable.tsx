"use client";

import { Delivery } from "@/types";
import RowActions from "./RowActions";

interface DeliveriesTableProps {
  deliveries: Delivery[];
  onEdit: (delivery: Delivery) => void;
  onRefresh: () => void;
  loading?: boolean;
  status?: "pending" | "completed" | "paid";
}

export default function DeliveriesTable({
  deliveries,
  onEdit,
  onRefresh,
  loading,
  status = "pending",
}: DeliveriesTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">No items found.</div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "Date pending";
    }
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto flex-1 flex flex-col">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-400">
            <th className="p-3 text-sm font-semibold text-gray-900">
              Customer
            </th>
            <th className="p-3 text-sm font-semibold text-gray-900">Phone</th>
            <th className="p-3 text-sm font-semibold text-gray-900">Address</th>
            {status !== "completed" && (
              <th className="p-3 text-sm font-semibold text-gray-900">Date</th>
            )}
            {status === "completed" && (
              <th className="p-3 text-sm font-semibold text-gray-900">
                Completed At
              </th>
            )}
            <th className="p-3 text-sm font-semibold text-gray-900">Items</th>
            <th className="p-3 text-sm font-semibold text-gray-900">Status</th>
            <th className="p-3 text-sm font-semibold text-gray-900">
              Created by
            </th>
            <th className="p-3 text-sm font-semibold text-gray-900">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {deliveries.map((delivery) => (
            <tr
              key={delivery.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="p-3 text-sm font-medium text-gray-900">
                {delivery.customer_name}
              </td>
              <td className="p-3 text-sm text-gray-600">
                {delivery.customer_phone}
              </td>
              <td className="p-3 text-sm text-gray-600">
                {delivery.delivery_address}
              </td>
              {status !== "completed" && (
                <td className="p-3 text-sm text-gray-600">
                  {formatDate(delivery.scheduled_date)}
                </td>
              )}
              {status === "completed" && (
                <td className="p-3 text-sm text-gray-600">
                  {delivery.completed_at
                    ? new Date(delivery.completed_at).toLocaleDateString(
                        "en-US"
                      )
                    : ""}
                </td>
              )}
              <td className="p-3">
                <div className="text-xs">
                  {Array.isArray(delivery.items) &&
                  delivery.items.length > 0 ? (
                    <div className="space-y-1">
                      {delivery.items.slice(0, 2).map((item) => (
                        <div key={item.product_id} className="text-gray-700">
                          {item.product_name || item.sku} x{item.quantity}
                        </div>
                      ))}
                      {delivery.items.length > 2 && (
                        <div className="text-gray-500">
                          +{delivery.items.length - 2} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">No items</span>
                  )}
                </div>
              </td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    delivery.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : delivery.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {delivery.status === "pending"
                    ? "Pending"
                    : delivery.status === "completed"
                    ? "Completed"
                    : "Paid"}
                </span>
              </td>
              <td className="p-3 text-sm text-gray-600">
                {delivery.created_by_name || "Unknown"}
              </td>
              <td className="p-3">
                <RowActions
                  delivery={delivery}
                  onEdit={() => onEdit(delivery)}
                  onRefresh={onRefresh}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
