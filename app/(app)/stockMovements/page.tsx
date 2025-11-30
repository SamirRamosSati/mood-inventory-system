"use client";

import { useState, useEffect } from "react";
import AddButton from "@/components/AddButton";
import Table from "@/components/Table";
import Modal from "@/components/modal";
import CustomTabs from "@/components/admin/stockMovements/customTabs";
import RowActions from "@/components/admin/stockMovements/RowActions";
import StockMovementForm from "@/components/admin/stockMovements/stockMovement-form";

const movementTypes = ["ARRIVAL", "PICKUP", "DELIVERY"];

const movementColumnsMap: Record<string, { key: string; label: string }[]> = {
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
    { key: "sku", label: "SKU" },
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

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Carregar movimentos da API
  useEffect(() => {
    async function loadMovements() {
      try {
        const res = await fetch("/api/stockMovements");
        const data = await res.json();
        if (data.success) setMovements(data.data);
        else throw new Error(data.error || "Failed to fetch movements");
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMovements();
  }, []);

  // 🔹 Criar ou atualizar movimento
  const handleSubmitMovement = async (movementData: any) => {
    try {
      const method = editingMovement ? "PUT" : "POST";
      const res = await fetch("/api/stockMovements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movementData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error saving movement");

      if (editingMovement) {
        setMovements((prev) =>
          prev.map((m) => (m.id === editingMovement.id ? data.data : m))
        );
      } else {
        setMovements((prev) => [...prev, data.data]);
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error saving movement");
    } finally {
      setEditingMovement(null);
      setIsModalOpen(false);
    }
  };

  // 🔹 Deletar movimento
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

  // 🔹 Editar movimento
  const handleEditMovement = (movement: any) => {
    setEditingMovement(movement);
    setIsModalOpen(true);
  };

  // 🔹 Criar tabs
  const tabs = movementTypes.map((type) => {
    const filtered = movements.filter((m) => m.type === type);
    return {
      value: type,
      label: type,
      content: (
        <Table
          columns={movementColumnsMap[type]}
          data={filtered.map((m) => ({
            ...m,
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

  return (
    <div className="space-y-4">
      <CustomTabs
        tabs={tabs}
        rightElement={
          <AddButton
            label="Add a Stock Movement"
            onClick={() => {
              setEditingMovement(null);
              setIsModalOpen(true);
            }}
          />
        }
      />

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
