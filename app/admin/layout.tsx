"use client";
import Sidebar from "@/components/admin/layout/sideBar";
import { SidebarLinkItem } from "@/components/admin/layout/sideBar";
import Navbar from "@/components/admin/layout/navBar";
import { useAuth } from "@/contexts/authContext";
import LoadingScreen from "@/components/LoadingScreen";

const sidebarLinkItems: SidebarLinkItem[] = [
  {
    href: "/admin/dashboard",
    icon: "LayoutDashboard",
    label: "Dashboard",
  },
  {
    href: "/admin/products",
    icon: "Box",
    label: "Products",
  },
  {
    href: "/admin/stock-movements",
    icon: "Warehouse",
    label: "Stock Movements",
  },
  {
    href: "/admin/staff",
    icon: "UsersIcon",
    label: "Staff",
  },
  {
    href: "/admin/deliveries",
    icon: "Truck",
    label: "Deliveries",
  },
  { href: "/admin/locations", icon: "MapPinHouse", label: "Locations" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  return (
    <div className="flex h-screen w-screen">
      <div className="hidden md:flex">
        <Sidebar linkItems={sidebarLinkItems} />
      </div>

      <main className="flex-1 p-2 px-10 overflow-y-auto bg-[#fafafa]">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
