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

    // Only show Staff for admins
    if (user?.role?.toLowerCase() === "admin") {
      items.splice(3, 0, { href: "/staff", icon: "UsersIcon", label: "Staff" });
    }

    return items;
  }, [user?.role]);

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
