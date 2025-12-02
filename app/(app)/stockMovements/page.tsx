"use client";

import React, { useState, useEffect, useMemo } from "react";
import AddButton from "@/components/AddButton";
import Table from "@/components/Table";
import Modal from "@/components/modal";
import CustomTabs from "@/components/stockMovements/customTabs";
import RowActions from "@/components/stockMovements/RowActions";
import StockMovementForm from "@/components/stockMovements/stockMovement-form";
import Filters, { FilterOption } from "@/components/Filters";
import { MovementWithRelations, TableColumn, ApiResponse } from "@/types";

const movementTypes = ["ARRIVAL", "PICKUP", "DELIVERY"] as const;

type Col = TableColumn<MovementWithRelations>;

const movementColumnsMap: Record<string, Col[]> = {
  ARRIVAL: [
    { key: "order", label: "Order" },
    { key: "bol", label: "BOL" },
    { key: "productName", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "userName", label: "User" },
    { key: "arrivalDate", label: "Arrival Date" },
    { key: "notes", label: "Notes" },
    { key: "actions", label: "" },
  ],
  PICKUP: [
    { key: "order", label: "Order" },
    { key: "productName", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "userName", label: "User" },
    { key: "pickupBy", label: "Pick Up By" },
    { key: "pickupDate", label: "Pick Up Date" },
    { key: "notes", label: "Notes" },
    { key: "actions", label: "" },
  ],
  DELIVERY: [
    { key: "order", label: "Order" },
    { key: "productName", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "userName", label: "User" },
    { key: "deliveryCompany", label: "Delivery Company" },
    { key: "deliveryDate", label: "Delivery Date" },
    { key: "notes", label: "Notes" },
    { key: "actions", label: "" },
  ],
};

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

const monthOptions: FilterOption[] = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<MovementWithRelations[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] =
    useState<MovementWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
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
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error saving movement");
    } finally {
      setEditingMovement(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteMovement = async (id: string) => {
    if (!confirm("Delete this movement?")) return;

    try {
      const res = await fetch(`/api/stockMovements?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete");

      setMovements((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error deleting movement");
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
        } catch (e) {}
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
      } catch (e) {
        return false;
      }
    });
  }, [movements, selectedMonth, selectedYear]);

  const tabs = movementTypes.map((type) => {
    const filtered = filteredMovements.filter((m) => m.type === type);

    const page = pageByType[type] ?? 0;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return {
      value: type,
      label: type,
      content: (
        <>
          <Table<Record<string, unknown>>
            columns={
              movementColumnsMap[type].map((col) => ({
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

          <div className="flex flex-col items-center justify-center gap-3 mt-4 md:gap-4">
            <button
              onClick={() =>
                setPageByType((prev) => ({
                  ...prev,
                  [type]: Math.max(0, page - 1),
                }))
              }
              disabled={page === 0}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-40 text-lg md:text-base"
            >
              ↑
            </button>

            <span className="text-xs md:text-sm text-gray-600 text-center">
              Page {page + 1} / {totalPages}
            </span>

            <button
              onClick={() =>
                setPageByType((prev) => ({
                  ...prev,
                  [type]: Math.min(totalPages - 1, page + 1),
                }))
              }
              disabled={(page + 1) * PAGE_SIZE >= filtered.length}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-40 text-lg md:text-base"
            >
              ↓
            </button>
          </div>
        </>
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
            options: monthOptions,
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
    <div className="p-2 md:p-4 space-y-4">
      <CustomTabs tabs={tabs} rightElement={RightElements} />

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
    </div>
  );
}
