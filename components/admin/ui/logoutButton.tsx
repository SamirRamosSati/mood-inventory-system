"use client";

import { ArrowRight, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 text-white py-2 px-4 cursor-pointer hover:bg-gray-800 transition-colors rounded-md"
    >
      <LogOutIcon className="w-4 h-4" />
      <span className="text-sm">Logout</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
