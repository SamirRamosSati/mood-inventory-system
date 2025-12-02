// src/components/stockMovements/PaginationControls.tsx (Mudar para PaginationControls.tsx ou src/components/PaginationControls.tsx)

import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const safeTotalPages = Math.max(1, totalPages);

  const handlePrev = () => {
    onPageChange(Math.max(0, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(safeTotalPages - 1, currentPage + 1));
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-90"
      >
        ↑
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage + 1} / {safeTotalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage + 1 >= safeTotalPages}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-90"
      >
        ↓
      </button>
    </div>
  );
}
