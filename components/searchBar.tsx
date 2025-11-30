"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  delay?: number;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  delay = 300,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onSearch]);

  return (
    <div className="flex items-center w-full max-w-sm bg-white border border-gray-200 rounded-xl px-4 py-2">
      <Search className="w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="ml-3 w-full bg-transparent outline-none text-sm text-gray-700"
      />
    </div>
  );
}
