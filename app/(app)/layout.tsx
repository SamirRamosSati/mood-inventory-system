"use client";

import { useEffect } from "react";
import Sidebar, { SidebarLinkItem } from "@/components/layout/sideBar";
import Navbar from "@/components/layout/navBar";
import { useAuth } from "@/contexts/authContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";

const sidebarLinkItems: SidebarLinkItem[] = [
  { href: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
  { href: "/products", icon: "Box", label: "Products" },
  { href: "/stockMovements", icon: "Warehouse", label: "Stock Movements" },
  { href: "/staff", icon: "UsersIcon", label: "Staff" },
  { href: "/deliveries", icon: "Truck", label: "Deliveries" },
  { href: "/locations", icon: "MapPinHouse", label: "Locations" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      if (!window.location.pathname.startsWith("/login")) {
        router.replace("/login");
      }
    }
  }, [isLoading, user, router]);

  if (isLoading) return <LoadingScreen />;

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
