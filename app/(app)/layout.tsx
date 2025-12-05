"use client";

import { useEffect, useMemo } from "react";
import Sidebar, { SidebarLinkItem } from "@/components/layout/sideBar";
import Navbar from "@/components/layout/navBar";
import { useAuth } from "@/contexts/authContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";

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

  const sidebarLinkItems: SidebarLinkItem[] = useMemo(() => {
    const items: SidebarLinkItem[] = [
      { href: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
      { href: "/products", icon: "Box", label: "Products" },
      { href: "/stockMovements", icon: "Warehouse", label: "Stock Movements" },
      { href: "/deliveries", icon: "Truck", label: "Deliveries" },
    ];

    if (user?.role?.toLowerCase() === "admin") {
      items.splice(3, 0, { href: "/staff", icon: "UsersIcon", label: "Staff" });
    }

    return items;
  }, [user?.role]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden md:flex px-4 py-4">
        <Sidebar linkItems={sidebarLinkItems} />
      </div>

      <main className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
        </div>
      </main>
    </div>
  );
}
