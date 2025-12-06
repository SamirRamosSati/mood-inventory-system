// components/StatCard.tsx
import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  valueColor?: string;
  iconBg?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon,
  valueColor = "text-gray-900",
  iconBg = "bg-gray-100",
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 ${
        onClick ? "cursor-pointer hover:shadow-md transition" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-light text-gray-600">{title}</p>
          <p className={`text-xl font-bold mt-2 ${valueColor}`}>{value}</p>
        </div>

        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
