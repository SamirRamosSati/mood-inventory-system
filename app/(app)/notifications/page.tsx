"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Card from "@/components/Card";
import Dialog from "@/components/Dialog";
import { Notification, ApiResponse } from "@/types";
import toast from "react-hot-toast";
import { Loader2, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDialog } from "@/contexts/dialogContext";
import { DialogVariant } from "@/contexts/dialogContext";

export default function NotificationsPage() {
  const dialog = useDialog();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/notifications?unreadOnly=${
          filter === "unread"
        }&page=0&pageSize=100`
      );
      const json: ApiResponse<Notification[]> = await response.json();

      if (!response.ok) {
        toast.error(json.error || "Failed to fetch notifications");
        return;
      }

      setNotifications(json.data || []);
    } catch (error) {
      toast.error("Failed to fetch notifications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
      });

      const json: ApiResponse = await response.json();

      if (!response.ok) {
        toast.error(json.error || "Failed to mark as read");
        return;
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );

      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read_at);

      if (unreadNotifications.length === 0) {
        toast.success("All notifications are already read");
        return;
      }

      await Promise.all(
        unreadNotifications.map((notif) =>
          fetch(`/api/notifications/${notif.id}`, {
            method: "PUT",
          })
        )
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          !notif.read_at
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await dialog.confirm(
      "Delete Notification?",
      "This will permanently remove the notification. This action cannot be undone.",
      {
        primaryLabel: "Delete",
        secondaryLabel: "Cancel",
        variant: "danger",
      }
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      const json: ApiResponse = await response.json();

      if (!response.ok) {
        dialog.alert("Error", json.error || "Failed to delete notification");
        return;
      }

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      dialog.alert("Error", "Failed to delete notification");
      console.error(error);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read_at).length,
    [notifications]
  );

  return (
    <div className="p-2 md:p-6 space-y-6 flex flex-col h-full">
      <Card>
        <div className="flex flex-col h-full gap-4">
          {/* Header with filters */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all",
                  filter === "all"
                    ? "bg-[#DFCDC1] text-white"
                    : "bg-[#F5F5F5] text-gray-700 hover:bg-[#E0D7CF]"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all relative",
                  filter === "unread"
                    ? "bg-[#DFCDC1] text-white"
                    : "bg-[#F5F5F5] text-gray-700 hover:bg-[#E0D7CF]"
                )}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 rounded-xl font-medium text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="bg-white rounded-2xl border border-gray-100 flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center flex-1 gap-2 text-gray-600">
                <Loader2 size={20} className="animate-spin" />
                <span>Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex items-center justify-center flex-1 text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors flex items-start gap-4",
                      !notification.read_at && "bg-blue-50"
                    )}
                  >
                    {/* Unread indicator */}
                    {!notification.read_at && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <span className="inline-block mt-2 text-xs text-gray-500">
                        {notification.type === "delivery_created" &&
                          "New Delivery"}
                        {notification.type === "delivery_completed" &&
                          "Delivery Completed"}
                        {notification.type === "delivery_paid" &&
                          "Payment Confirmed"}
                        {" • "}
                        {new Date(notification.created_at).toLocaleDateString(
                          "en-US"
                        )}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {!notification.read_at && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 rounded-lg hover:bg-blue-100 transition text-blue-600"
                          title="Mark as read"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Dialog
        isOpen={dialog.config.isOpen}
        title={dialog.config.title}
        description={dialog.config.description}
        onClose={dialog.close}
        primaryAction={
          dialog.config.primaryAction
            ? {
                label: dialog.config.primaryAction.label,
                variant: dialog.config.primaryAction.variant as DialogVariant,
                onClick: dialog.onPrimary || (() => {}),
                loading: dialog.config.primaryAction.loading,
              }
            : undefined
        }
        secondaryAction={
          dialog.config.secondaryAction
            ? {
                label: dialog.config.secondaryAction.label,
                onClick: dialog.onSecondary || (() => {}),
              }
            : undefined
        }
        closeOnClickOutside={dialog.config.closeOnClickOutside}
      >
        {dialog.config.children}
      </Dialog>
    </div>
  );
}
