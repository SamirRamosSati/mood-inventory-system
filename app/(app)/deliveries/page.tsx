"use client";

import { useState, useEffect, useMemo } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/searchBar";
import AddButton from "@/components/AddButton";
import DeliveriesTable from "@/components/deliveries/DeliveriesTable";
import PaginationControls from "@/components/paginationControl";
import DeliveryForm from "@/components/deliveries/DeliveryForm";
import Modal from "@/components/modal";
import Dialog from "@/components/Dialog";
import toast from "react-hot-toast";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { Delivery, CreateDeliveryData, ApiResponse } from "@/types";
import { Loader2 } from "lucide-react";
import { useDialog } from "@/contexts/dialogContext";
import { DialogVariant } from "@/contexts/dialogContext";

export default function DeliveriesPage() {
  const dialog = useDialog();
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 8;

  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/deliveries?status=${activeTab}&search=${encodeURIComponent(
            search
          )}&page=0&pageSize=100`
        );
        const json: ApiResponse<Delivery[]> = await response.json();
        if (!response.ok) {
          toast.error(json.error || "Failed to fetch deliveries");
          return;
        }
        setDeliveries(json.data || []);
        setCurrentPage(0);
      } catch (error) {
        toast.error("Failed to fetch deliveries");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [activeTab, search]);

  // Filtrar por aba (status)
  const filtered = useMemo(() => {
    return deliveries;
  }, [deliveries]);

  // Paginar
  const paginated = useMemo(() => {
    return filtered.slice(
      currentPage * PAGE_SIZE,
      (currentPage + 1) * PAGE_SIZE
    );
  }, [filtered, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleEdit = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setModalOpen(true);
  };

  const handleAddDelivery = () => {
    setEditingDelivery(null);
    setModalOpen(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(0);
    setSearch("");
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/deliveries?status=${activeTab}&search=${encodeURIComponent(
            search
          )}&page=0&pageSize=100`
        );
        const json: ApiResponse<Delivery[]> = await response.json();
        if (!response.ok) {
          toast.error(json.error || "Failed to fetch deliveries");
          return;
        }
        setDeliveries(json.data || []);
      } catch (error) {
        toast.error("Failed to fetch deliveries");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  };

  const handleSubmitDelivery = async (data: CreateDeliveryData) => {
    setSaving(true);
    setError(null);

    try {
      if (editingDelivery) {
        // Update delivery
        const response = await fetch(`/api/deliveries/${editingDelivery.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const json: ApiResponse<Delivery> = await response.json();

        if (!response.ok) {
          setError(json.error || "Failed to update delivery");
          toast.error(json.error || "Failed to update delivery");
          return;
        }

        toast.success("Delivery updated successfully");
        setModalOpen(false);
        setEditingDelivery(null);
        handleRefresh();
      } else {
        const response = await fetch("/api/deliveries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const json: ApiResponse<Delivery> = await response.json();

        if (!response.ok) {
          setError(json.error || "Failed to create delivery");
          toast.error(json.error || "Failed to create delivery");
          return;
        }

        toast.success("Delivery created successfully");
        setModalOpen(false);
        setEditingDelivery(null);
        handleRefresh();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creating delivery";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-2 md:p-6 space-y-6 flex flex-col h-full">
      <Card>
        <div className="flex flex-col h-full gap-4">
          {/* Tabs */}
          <TabsPrimitive.Root
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex flex-col gap-3 h-full"
          >
            <div className="flex justify-between items-center shrink-0">
              <TabsPrimitive.List className="flex gap-2">
                <TabsPrimitive.Trigger
                  value="pending"
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all",
                    activeTab === "pending"
                      ? "bg-[#DFCDC1] text-white"
                      : "bg-[#F5F5F5] text-gray-700 hover:bg-[#E0D7CF]"
                  )}
                >
                  Pending Deliveries
                </TabsPrimitive.Trigger>

                <TabsPrimitive.Trigger
                  value="completed"
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all",
                    activeTab === "completed"
                      ? "bg-[#DFCDC1] text-white"
                      : "bg-[#F5F5F5] text-gray-700 hover:bg-[#E0D7CF]"
                  )}
                >
                  Done Deliveries
                </TabsPrimitive.Trigger>

                <TabsPrimitive.Trigger
                  value="paid"
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all",
                    activeTab === "paid"
                      ? "bg-[#DFCDC1] text-white"
                      : "bg-[#F5F5F5] text-gray-700 hover:bg-[#E0D7CF]"
                  )}
                >
                  Paid Deliveries
                </TabsPrimitive.Trigger>
              </TabsPrimitive.List>

              <AddButton label="Add Delivery" onClick={handleAddDelivery} />
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <SearchBar
                onSearch={setSearch}
                placeholder="Search by customer name or phone..."
              />
              <span className="text-sm text-gray-500 py-3">
                Items found: {deliveries.length}
              </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 min-h-20 flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-gray-600 h-full">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Loading Deliveries...</span>
                </div>
              ) : paginated.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No items to fetch</p>
                </div>
              ) : (
                <DeliveriesTable
                  deliveries={paginated}
                  onEdit={handleEdit}
                  onRefresh={handleRefresh}
                />
              )}
            </div>
          </TabsPrimitive.Root>

          {/* Pagination */}
          {!loading && paginated.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDelivery(null);
          setError(null);
        }}
        title={editingDelivery ? "Edit Delivery" : "Add New Delivery"}
      >
        <DeliveryForm
          delivery={editingDelivery}
          onSubmit={handleSubmitDelivery}
          onCancel={() => {
            setModalOpen(false);
            setEditingDelivery(null);
            setError(null);
          }}
          saving={saving}
          error={error}
        />
      </Modal>

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
