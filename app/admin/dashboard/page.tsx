"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/dashboard/Card";
import { RecentMovements } from "@/components/admin/dashboard/recentMovements";
import LowStockList from "@/components/admin/dashboard/lowStock";

export default function DashboardPage() {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  // Mock data
  const stats = {
    totalProducts: 142,
    lowStock: 8,
    todayMovements: 12,
    pendingDeliveries: 5,
  };

  const recentMovements = [
    {
      id: 1,
      type: "ARRIVAL",
      product: "Modern Sofa Set",
      quantity: 5,
      time: "2 hours ago",
      vendor: "Ashley Furniture",
    },
    {
      id: 2,
      type: "DELIVERY",
      product: "Dining Table",
      quantity: 1,
      time: "3 hours ago",
      customer: "John Smith",
    },
    {
      id: 3,
      type: "PICKUP",
      product: "Office Chair",
      quantity: 2,
      time: "5 hours ago",
      customer: "Sarah Johnson",
    },
    {
      id: 4,
      type: "ARRIVAL",
      product: "Bed Frame Queen",
      quantity: 3,
      time: "1 day ago",
      vendor: "IKEA",
    },
    {
      id: 5,
      type: "DELIVERY",
      product: "Coffee Table",
      quantity: 1,
      time: "1 day ago",
      customer: "Mike Brown",
    },
  ];

  const lowStockProducts = [
    {
      id: 1,
      name: "Modern Floor Lamp",
      sku: "FL-001",
      stock: 2,
      category: "Lighting",
    },
    {
      id: 2,
      name: "Accent Chair",
      sku: "CH-045",
      stock: 3,
      category: "Seating",
    },
    {
      id: 3,
      name: "Wall Mirror Large",
      sku: "MR-012",
      stock: 1,
      category: "Decor",
    },
    { id: 4, name: "Side Table", sku: "TB-089", stock: 2, category: "Tables" },
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            valueColor="text-gray-900"
            iconBg="bg-blue-100"
          />

          <StatCard
            title="Low Stock Items"
            value={stats.lowStock}
            icon="⚠️"
            valueColor="text-orange-600"
            iconBg="bg-orange-100"
          />

          <StatCard
            title="Today's Movements"
            value={stats.todayMovements}
            icon="📊"
            valueColor="text-gray-900"
            iconBg="bg-green-100"
          />

          <StatCard
            title="Pending Deliveries"
            value={stats.pendingDeliveries}
            icon="🚚"
            valueColor="text-purple-600"
            iconBg="bg-purple-100"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Movements */}
          <RecentMovements
            movements={recentMovements}
            getMovementColor={getMovementColor}
          />
          <LowStockList lowStockProducts={lowStockProducts} />
        </div>
      </main>
    </div>
  );
}
