"use client";
import { useAuth } from "@/contexts/authContext";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
export interface SidebarLinkItem {
  href: string;
  icon: keyof typeof LucideIcons;
  label: string;
}

interface SidebarProps {
  linkItems: SidebarLinkItem[];
}

export default function Sidebar({ linkItems }: SidebarProps) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white p-4 shadow-sm border border-gray-200 justify-between rounded-2xl">
      <div>
        <Image
          src="/images/logo.png"
          alt="MOOD. Logo"
          width={120}
          height={40}
          priority
        />

        <nav className="space-y-2">
          {linkItems.map((item) => {
            const IconComponent = LucideIcons[item.icon] as React.ElementType;
            if (!IconComponent) return null;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center p-2 mb-2 rounded-md transition-colors
                    ${
                      pathname === item.href ||
                      (pathname.startsWith(item.href) &&
                        item.href !== "/admin/dashboard")
                        ? "bg-[#F7EDEB] text-sm text-[#E0A793]"
                        : "text-gray-600 text-sm hover:bg-gray-100"
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 mb-3">
        <button
          className="flex items-center w-full p-2 text-sm rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => router.push("/account")}
        >
          <LucideIcons.UserCircleIcon className="w-5 h-5 mr-3" />
          Account
        </button>
        <button
          className="flex items-center w-full p-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => router.push("/notifications")}
        >
          <LucideIcons.BellRingIcon className="w-5 h-5 mr-3" />
          Notifications
        </button>
        <button
          className="flex items-center w-full p-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={handleLogout}
        >
          <LucideIcons.LogOutIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
