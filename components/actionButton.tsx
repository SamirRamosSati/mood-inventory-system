"use client";

import { FilePenLine } from "lucide-react";

interface ActionButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ActionButton({ onEdit }: ActionButtonProps) {
  return (
    <button onClick={() => onEdit?.()} aria-label="action">
      <span>
        <FilePenLine size={20} />
      </span>
    </button>
  );
}
