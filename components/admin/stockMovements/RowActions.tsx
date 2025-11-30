"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function RowActions({ onEdit, onDelete }: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded hover:bg-gray-100 transition"
      >
        <Pencil size={18} className="text-gray-600" />
      </button>

      {open && (
        <div className="absolute -left-36 top-0 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded-lg"
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg"
          >
            <Trash size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
