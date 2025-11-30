"use client";

import { useState } from "react";
import { FilePenLine } from "lucide-react";

export default function ActionButton({ onEdit, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button onClick={() => setIsOpen(true)}>
      <span>
        <FilePenLine size={20} />
      </span>
    </button>
  );
}
