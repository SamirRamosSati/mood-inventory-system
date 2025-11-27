"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Mood Home Interiors
              </h1>
              <p className="text-sm text-gray-600">Inventory System</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600">
                  {isAdmin ? "👑 Administrator" : "👤 User"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Here what happening with your inventory today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.lowStock}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Todays Movements
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.todayMovements}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Deliveries
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.pendingDeliveries}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Movements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Movements
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="p-6 hover:bg-gray-50 transition"
                  >
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
                          <span className="text-sm text-gray-500">
                            {movement.time}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {movement.product}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity:{" "}
                          <span className="font-medium">
                            {movement.quantity}
                          </span>
                          {movement.type === "ARRIVAL" && movement.vendor && (
                            <>
                              {" "}
                              • Vendor:{" "}
                              <span className="font-medium">
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
                                <span className="font-medium">
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
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all movements →
                </button>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Low Stock Alert
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 hover:bg-gray-50 transition"
                  >
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
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Restock items →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {isAdmin && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-3">
                    <span className="text-xl">➕</span>
                    <span className="font-medium text-gray-900">
                      Add New Product
                    </span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-3">
                    <span className="text-xl">📥</span>
                    <span className="font-medium text-gray-900">
                      Record Arrival
                    </span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-3">
                    <span className="text-xl">🚚</span>
                    <span className="font-medium text-gray-900">
                      Schedule Delivery
                    </span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-3">
                    <span className="text-xl">👥</span>
                    <span className="font-medium text-gray-900">
                      Manage Users
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
