"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, CheckCheck, Trash } from "lucide-react";
import { Delivery } from "@/types";
import toast from "react-hot-toast";

interface DeliveryRowActionsProps {
  delivery: Delivery;
  onEdit: () => void;
  onRefresh: () => void;
}

export default function DeliveryRowActions({
  delivery,
  onEdit,
  onRefresh,
}: DeliveryRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 160,
      });
    }
  }, [open]);

  const handleMarkCompleted = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/deliveries/${delivery.id}/mark-completed`,
        {
          method: "PUT",
        }
      );

      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error || "Error marking as completed");
        return;
      }

      toast.success("Delivery marked as completed");
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast.error("Error marking as completed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/deliveries/${delivery.id}/mark-paid`, {
        method: "PUT",
      });

      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error || "Error marking as paid");
        return;
      }

      toast.success("Delivery marked as paid");
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast.error("Error marking as paid");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this delivery?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/deliveries/${delivery.id}/delete`, {
        method: "DELETE",
      });

      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error || "Error deleting delivery");
        return;
      }

      toast.success("Delivery deleted successfully");
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast.error("Error deleting delivery");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-2 rounded hover:bg-gray-100 transition disabled:opacity-50"
      >
        <Pencil size={18} className="text-gray-600" />
      </button>

      {open && (
        <div
          className="fixed w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded-lg disabled:opacity-50"
          >
            <Pencil size={16} /> Edit
          </button>

          {delivery.status === "pending" && (
            <button
              onClick={handleMarkCompleted}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full rounded-lg disabled:opacity-50"
            >
              <Check size={16} /> Mark Completed
            </button>
          )}

          {delivery.status === "completed" && (
            <button
              onClick={handleMarkPaid}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 w-full rounded-lg disabled:opacity-50"
            >
              <CheckCheck size={16} /> Mark Paid
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg disabled:opacity-50"
          >
            <Trash size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
