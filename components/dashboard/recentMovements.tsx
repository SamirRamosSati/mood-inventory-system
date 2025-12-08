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
    <div className="lg:col-span-2 flex flex-col min-h-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
            Recent Movements
          </h3>
          <button
            onClick={() => router.push("/stockMovements")}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </button>
        </div>

        <div className="divide-y divide-gray-200 flex-1 overflow-y-auto">
          {movements.length === 0 ? (
            <div className="p-4 sm:p-5 md:p-6 text-center text-gray-500">
              <p>No recent movements</p>
            </div>
          ) : (
            movements.map((movement) => (
              <div
                key={movement.id}
                className="p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition border-b last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getMovementColor(
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

                    <p className="font-medium text-xs sm:text-sm text-gray-900">
                      {movement.product}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Quantity:{" "}
                      <span className="font-medium">{movement.quantity}</span>
                      {movement.type === "ARRIVAL" && movement.vendor && (
                        <>
                          {" "}
                          • Vendor:{" "}
                          <span className="font-medium text-xs sm:text-sm">
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
                            <span className="font-medium text-xs sm:text-sm">
                              {movement.customer}
                            </span>
                          </>
                        )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
