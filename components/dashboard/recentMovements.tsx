"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-md font-semibold text-gray-900">
            Recent Movements
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {movements.map((movement) => (
            <div key={movement.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getMovementColor(
                        movement.type
                      )}`}
                    >
                      {movement.type}
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

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => router.push("/stockMovements")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all movements →
          </button>
        </div>
      </div>
    </div>
  );
}
