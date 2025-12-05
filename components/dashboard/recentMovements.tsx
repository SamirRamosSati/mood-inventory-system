"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, Truck } from "lucide-react";

export interface Movement {
  id: string | number;
  type: string;
  product: string;
  quantity: number;
  time: string;
  vendor?: string;
  customer?: string;
}

interface RecentMovementsProps {
  movements: Movement[];
  getMovementColor: (type: string) => string;
}

export function RecentMovements({
  movements,
  getMovementColor,
}: RecentMovementsProps) {
  const router = useRouter();
  const IconForType = (type: string) => {
    switch (type) {
      case "ARRIVAL":
        return <ArrowDownCircle className="w-4 h-4" />;
      case "DELIVERY":
        return <ArrowUpCircle className="w-4 h-4" />;
      case "PICKUP":
        return <Truck className="w-4 h-4" />;
      default:
        return <ArrowDownCircle className="w-4 h-4" />;
    }
  };
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-900">
            Recent Movements
          </h3>
          <button
            onClick={() => router.push("/stockMovements")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </button>
        </div>

        <div className="divide-y divide-gray-200 flex-1 overflow-auto">
          {movements.map((movement) => (
            <div key={movement.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getMovementColor(
                        movement.type
                      )}`}
                    >
                      {IconForType(movement.type)}
                      <span className="uppercase text-[10px] font-semibold">
                        {movement.type}
                      </span>
                    </span>

                    <span className="text-xs text-gray-500">
                      {movement.time}
                    </span>
                  </div>

                  <p className="font-medium text-sm text-gray-900">
                    {movement.product}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Quantity:{" "}
                    <span className="font-medium">{movement.quantity}</span>
                    {movement.type === "ARRIVAL" && movement.vendor && (
                      <>
                        {" "}
                        • Vendor:{" "}
                        <span className="font-medium text-sm">
                          {movement.vendor}
                        </span>
                      </>
                    )}
                    {(movement.type === "DELIVERY" ||
                      movement.type === "PICKUP") &&
                      movement.customer && (
                        <>
                          {" "}
                          • Customer:{" "}
                          <span className="font-medium text-sm">
                            {movement.customer}
                          </span>
                        </>
                      )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
