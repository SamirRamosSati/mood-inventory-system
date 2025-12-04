"use client";

import React from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "danger" | "primary" | "success";
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  closeOnClickOutside?: boolean;
}

export default function Dialog({
  isOpen,
  title,
  description,
  children,
  onClose,
  primaryAction,
  secondaryAction,
  closeOnClickOutside = true,
}: DialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnClickOutside) {
      onClose();
    }
  };

  const getPrimaryButtonColor = (variant?: string) => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-[#DFCDC1] hover:bg-[#C8A893] text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children && <div className="text-gray-700 text-sm">{children}</div>}

        <div className="flex gap-3 justify-end pt-4">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 rounded-lg text-gray-700 border border-gray-200 hover:bg-gray-50 transition font-medium"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              disabled={primaryAction.loading}
              className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${getPrimaryButtonColor(
                primaryAction.variant
              )}`}
            >
              {primaryAction.loading ? "Loading..." : primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
