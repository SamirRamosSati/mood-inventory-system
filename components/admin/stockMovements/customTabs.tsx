"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CustomTab = {
  value: string;
  label: string;
  content: React.ReactElement;
  isLoading?: boolean;
  dataLength?: number;
};

export default function CustomTabs({
  tabs,
  rightElement,
  onTabChange,
}: {
  tabs: CustomTab[];
  rightElement?: React.ReactNode;
  onTabChange?: (tabValue: string) => void;
}) {
  const [tab, setTab] = React.useState(tabs[0].value);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    onTabChange?.(newTab);
  };

  return (
    <TabsPrimitive.Root
      value={tab}
      onValueChange={handleTabChange}
      className="flex flex-col gap-3"
    >
      <div className="flex justify-between items-center">
        <TabsPrimitive.List className="flex gap-2">
          {tabs.map((t) => (
            <TabsPrimitive.Trigger
              key={t.value}
              value={t.value}
              className={cn(
                "px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all " +
                  "bg-[#F5F5F5] text-gray-700 hover:bg-[#E0D7CF] " +
                  "data-[state=active]:bg-[#DFCDC1] data-[state=active]:text-white"
              )}
            >
              {t.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
        {rightElement}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 min-h-20">
        {tabs.map((t) => {
          const isActive = tab === t.value;

          return (
            <motion.div
              key={t.value}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              style={{ display: isActive ? "block" : "none" }}
            >
              {t.isLoading ? (
                <p className="text-center py-8 text-gray-400">Loading...</p>
              ) : t.dataLength === 0 ? (
                <p className="text-center py-8 text-gray-400">
                  No products to fetch
                </p>
              ) : (
                t.content
              )}
            </motion.div>
          );
        })}
      </div>
    </TabsPrimitive.Root>
  );
}
