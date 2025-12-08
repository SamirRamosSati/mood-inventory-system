"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import StatCard from "@/components/dashboard/Card";
import { RecentMovements } from "@/components/dashboard/recentMovements";
import LowStockList from "@/components/dashboard/lowStock";
import { useEffect, useState } from "react";
import { Box, AlertTriangle, BarChart2, Truck } from "lucide-react";
import {
  Product,
  LowStockProduct,
  ApiResponse,
  MovementWithRelations,
  MovementType,
  Delivery,
} from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface RecentMovement {
  id: string | number;
  type: MovementType;
  product: string;
  quantity: number;
  time: string;
}

export default function DashboardPage() {
  useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    todayMovements: 0,
    pendingDeliveries: 0,
  });

  const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const resProducts = await fetch("/api/products");
        const dataProducts: ApiResponse<Product[]> = await resProducts.json();
        if (dataProducts.data) {
          setStats((prev) => ({
            ...prev,
            totalProducts: dataProducts.data!.length,
            lowStock: dataProducts.data!.filter(
              (product: Product) => product.stock <= 3
            ).length,
          }));
        } else {
          throw new Error(dataProducts.error || "Failed to fetch products");
        }

        const resMovements = await fetch("/api/stockMovements?pageSize=100");
        const dataMovements: ApiResponse<MovementWithRelations[]> =
          await resMovements.json();

        // Fetch deliveries
        const resDeliveries = await fetch(
          "/api/deliveries?status=pending&pageSize=100"
        );
        const dataDeliveries: ApiResponse<Delivery[]> =
          await resDeliveries.json();

        if (dataMovements.data) {
          const mapToRecent = (m: MovementWithRelations): RecentMovement => {
            const idValue =
              typeof m.id === "string" && !isNaN(Number(m.id))
                ? Number(m.id)
                : m.id;
            const productName =
              m.productName ?? m.product?.name ?? m.product ?? m.product;
            const time = formatRelativeTime(m.createdAt || m.arrivalDate);

            return {
              id: idValue,
              type: m.type,
              product: productName,
              quantity: m.quantity,
              time,
            } as RecentMovement;
          };

          setRecentMovements(dataMovements.data.slice(0, 10).map(mapToRecent));

          setStats((prev) => ({
            ...prev,
            todayMovements: dataMovements.data!.filter(
              (movement: MovementWithRelations) => {
                const movementDate = new Date(
                  movement.createdAt || movement.arrivalDate || ""
                );
                const today = new Date();
                return movementDate.toDateString() === today.toDateString();
              }
            ).length,
          }));
        } else {
          throw new Error(
            dataMovements.error || "Failed to fetch stock movements"
          );
        }

        const lowStockItems = dataProducts
          .data!.filter((product: Product) => product.stock <= 3)
          .map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            category: p.category || null,
            stock: p.stock,
          }));
        setLowStockProducts(lowStockItems.slice(0, 15));

        const pendingDeliveries = dataDeliveries.data
          ? dataDeliveries.data.length
          : 0;
        setStats((prev) => ({
          ...prev,
          pendingDeliveries,
        }));
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const getMovementColor = (type: string) => {
    switch (type) {
      case "ARRIVAL":
        return "bg-green-100 text-green-800";
      case "DELIVERY":
        return "bg-blue-100 text-blue-800";
      case "PICKUP":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto">
      <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col min-h-0">
        <main className="max-w-[1600px] mx-auto w-full flex flex-col space-y-6 md:space-y-8 flex-1 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 shrink-0">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<Box className="w-6 h-6 text-blue-600" />}
              valueColor="text-gray-900"
              iconBg="bg-blue-50"
              onClick={() => router.push("/products")}
            />

            <StatCard
              title="Low Stock Items"
              value={stats.lowStock}
              icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
              valueColor="text-orange-600"
              iconBg="bg-orange-50"
              onClick={() => router.push("/products")}
            />

            <StatCard
              title="Today's Movements"
              value={stats.todayMovements}
              icon={<BarChart2 className="w-6 h-6 text-green-600" />}
              valueColor="text-gray-900"
              iconBg="bg-green-50"
              onClick={() => router.push("/stockMovements")}
            />

            <StatCard
              title="Pending Deliveries"
              value={stats.pendingDeliveries}
              icon={<Truck className="w-6 h-6 text-purple-600" />}
              valueColor="text-purple-600"
              iconBg="bg-purple-50"
              onClick={() => router.push("/deliveries")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 flex-1 min-h-0">
            <RecentMovements
              movements={recentMovements}
              getMovementColor={getMovementColor}
            />
            <LowStockList lowStockProducts={lowStockProducts} />
          </div>
        </main>
      </div>
    </div>
  );
}
