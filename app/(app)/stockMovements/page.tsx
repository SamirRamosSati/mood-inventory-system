"use client";

import React, { useState, useEffect, useMemo } from "react";
import AddButton from "@/components/AddButton";
import Table from "@/components/Table";
import Modal from "@/components/modal";
import Dialog from "@/components/Dialog";
import CustomTabs from "@/components/stockMovements/customTabs";
import RowActions from "@/components/stockMovements/RowActions";
import StockMovementForm from "@/components/stockMovements/stockMovement-form";
import Filters from "@/components/Filters";
import PaginationControls from "@/components/paginationControl";
import { MovementWithRelations, TableColumn, ApiResponse } from "@/types";
import { useDialog } from "@/hooks/useDialog";
import { DialogVariant } from "@/hooks/useDialog";
import toast from "react-hot-toast";
import {
  MOVEMENT_COLUMNS_MAP,
  MONTH_FILTER_OPTIONS,
} from "@/config/stockMovementConfig";

const movementTypes = ["ARRIVAL", "PICKUP", "DELIVERY"] as const;

function formatDate(value: string | undefined | null) {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getMovementDate(movement: MovementWithRelations): string | null {
  switch (movement.type) {
    case "ARRIVAL":
      return movement.arrivalDate || null;
    case "PICKUP":
      return movement.pickupDate || null;
    case "DELIVERY":
      return movement.deliveryDate || null;
    default:
      return null;
  }
}

export default function StockMovementsPage() {
  const dialog = useDialog();
  const [movements, setMovements] = useState<MovementWithRelations[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] =
    useState<MovementWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ARRIVAL");
  const [pageByType, setPageByType] = useState<Record<string, number>>({
    ARRIVAL: 0,
    PICKUP: 0,
    DELIVERY: 0,
  });
  const PAGE_SIZE = 8;

  useEffect(() => {
    async function loadMovements() {
      try {
        const res = await fetch("/api/stockMovements");
        const data: ApiResponse<MovementWithRelations[]> = await res.json();
        if (data.success && data.data) setMovements(data.data);
        else throw new Error(data.error || "Failed to fetch movements");
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMovements();
  }, []);

  const handleSubmitMovement = async (movementData: unknown) => {
    try {
      const method = editingMovement ? "PUT" : "POST";

      const payload = editingMovement
        ? ({
            ...(editingMovement as Record<string, unknown>),
            ...(movementData as Record<string, unknown>),
            id: editingMovement.id,
          } as Record<string, unknown>)
        : movementData;

      const res = await fetch("/api/stockMovements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse<MovementWithRelations> = await res.json();
      if (!data.success) throw new Error(data.error || "Error saving movement");

      const newOrUpdatedMovement = data.data;

      if (editingMovement && newOrUpdatedMovement) {
        setMovements((prev) =>
          prev.map((m) =>
            m.id === editingMovement.id ? newOrUpdatedMovement : m
          )
        );
      } else if (newOrUpdatedMovement) {
        setMovements((prev) => [...prev, newOrUpdatedMovement]);
      }

      toast.success(editingMovement ? "Movement updated" : "Movement created");
      setEditingMovement(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      dialog.alert(
        "Error",
        err instanceof Error ? err.message : "Error saving movement"
      );
    }
  };

  const handleDeleteMovement = async (id: string) => {
    const confirmed = await dialog.confirm(
      "Delete Movement?",
      "This will permanently remove the stock movement record. This action cannot be undone.",
      {
        primaryLabel: "Delete",
        secondaryLabel: "Cancel",
        variant: "danger",
      }
    );

    if (!confirmed) return;

    dialog.setLoading(true);

    try {
      const res = await fetch(`/api/stockMovements?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete");

      setMovements((prev) => prev.filter((m) => m.id !== id));
      dialog.setLoading(false);
      dialog.close();
      toast.success("Movement deleted successfully");
    } catch (err) {
      console.error(err);
      dialog.setLoading(false);
      dialog.alert(
        "Error",
        err instanceof Error ? err.message : "Error deleting movement"
      );
    }
  };

  const handleEditMovement = (movement: MovementWithRelations) => {
    setEditingMovement(movement);
    setIsModalOpen(true);
  };

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    movements.forEach((m) => {
      const dateString = getMovementDate(m);
      if (dateString) {
        try {
          const year = new Date(dateString).getFullYear().toString();
          years.add(year);
        } catch {}
      }
    });
    return Array.from(years)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((year) => ({ label: year, value: year }));
  }, [movements]);

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      if (!selectedMonth && !selectedYear) return true;

      const dateString = getMovementDate(m);
      if (!dateString) return false;

      try {
        const d = new Date(dateString);
        const movementMonth = d.toLocaleDateString("en-US", {
          month: "2-digit",
        });
        const movementYear = d.getFullYear().toString();

        const monthMatch = !selectedMonth || movementMonth === selectedMonth;
        const yearMatch = !selectedYear || movementYear === selectedYear;

        return monthMatch && yearMatch;
      } catch {
        return false;
      }
    });
  }, [movements, selectedMonth, selectedYear]);

  const tabs = movementTypes.map((type) => {
    const filtered = filteredMovements.filter((m) => m.type === type);

    const page = pageByType[type] ?? 0;
    const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return {
      value: type,
      label: type,
      content: (
        <Table<Record<string, unknown>>
          columns={
            MOVEMENT_COLUMNS_MAP[type].map((col) => ({
              ...col,
              render:
                col.render ??
                ((item: MovementWithRelations) => {
                  const value = (item as unknown as Record<string, unknown>)[
                    col.key
                  ];

                  if (React.isValidElement(value)) return value;

                  if (
                    typeof col.key === "string" &&
                    col.key.toLowerCase().includes("date")
                  ) {
                    return formatDate(String(value ?? ""));
                  }

                  if (
                    typeof value === "string" ||
                    typeof value === "number" ||
                    typeof value === "boolean"
                  ) {
                    return String(value);
                  }

                  return "";
                }),
            })) as unknown as TableColumn<Record<string, unknown>>[]
          }
          data={paginated.map((m) => ({
            ...m,
            productName: m.productName ?? m.product?.name ?? "",
            userName: m.userName ?? m.user?.name ?? "",
            actions: (
              <RowActions
                onEdit={() => handleEditMovement(m)}
                onDelete={() => handleDeleteMovement(m.id)}
              />
            ),
          }))}
        />
      ),
      isLoading,
      dataLength: filtered.length,
    };
  });

  const RightElements = (
    <div className="flex items-center gap-3">
      <Filters
        filters={[
          {
            options: availableYears,
            selected: selectedYear,
            placeholder: "Select Year",
            onChange: (value) => {
              setSelectedYear(value);
              setPageByType({ ARRIVAL: 0, PICKUP: 0, DELIVERY: 0 });
            },
          },
          {
            options: MONTH_FILTER_OPTIONS,
            selected: selectedMonth,
            placeholder: "Select Month",
            onChange: (value) => {
              setSelectedMonth(value);
              setPageByType({ ARRIVAL: 0, PICKUP: 0, DELIVERY: 0 });
            },
          },
        ]}
      />
      <AddButton
        label="Add Movement"
        onClick={() => {
          setEditingMovement(null);
          setIsModalOpen(true);
        }}
      />
    </div>
  );

  return (
    <div className="p-2 md:p-6 space-y-6">
      <CustomTabs
        tabs={tabs}
        rightElement={RightElements}
        onTabChange={setActiveTab}
      />

      {(() => {
        const filtered = filteredMovements.filter((m) => m.type === activeTab);
        const page = pageByType[activeTab] ?? 0;
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

        return (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPageByType((prev) => ({
                ...prev,
                [activeTab]: newPage,
              }));
            }}
          />
        );
      })()}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMovement(null);
        }}
        title={editingMovement ? "Edit Stock Movement" : "Add Stock Movement"}
      >
        <StockMovementForm
          movement={editingMovement}
          onSubmit={handleSubmitMovement}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingMovement(null);
          }}
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
