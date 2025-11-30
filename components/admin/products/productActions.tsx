"use client";

import { Pencil, Trash2 } from "lucide-react";

export default function ProductActions({ onEdit, onDelete }: any) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onEdit}
        className="p-2 rounded-lg hover:bg-gray-200 transition"
      >
        <Pencil size={18} className="text-gray-600" />
      </button>

      <button
        onClick={onDelete}
        className="p-2 rounded-lg hover:bg-red-200 transition"
      >
        <Trash2 size={18} className="text-red-600" />
      </button>
    </div>
  );
}
