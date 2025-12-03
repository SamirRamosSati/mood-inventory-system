"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/searchBar";
import AddButton from "@/components/AddButton";
import Filters from "@/components/Filters";
import Modal from "@/components/modal";
import EmployeeForm from "@/components/staff/staffForm";
import StaffTable, { Employee } from "@/components/staff/staffTable";

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [duty, setDuty] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/staff");
        const data = await response.json();

        if (data.success && data.data) {
          setEmployees(data.data);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
  }

  function handleEditEmployee(emp: Employee) {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  }

  async function handleDeleteEmployee(id: string) {
    const employee = employees.find((e) => e.id === id);
    if (!employee) return;

    const isPending = employee.status === "pending";
    const confirmMsg = isPending
      ? "Delete this pending invite?"
      : "Delete this employee? This will remove their account permanently.";

    if (!confirm(confirmMsg)) return;

    try {
      const params = new URLSearchParams();
      if (isPending) {
        params.set("email", employee.email);
        params.set("isPending", "true");
      } else {
        params.set("id", id);
      }

      const response = await fetch(`/api/staff?${params.toString()}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.error || "Failed to delete");
        return;
      }

      setEmployees((prev) => prev.filter((e) => e.id !== id));
      alert(result.message);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An unexpected error occurred");
    }
  }

  async function handleSubmitEmployee(data: {
    name: string;
    email: string;
    phone: string;
    role: string;
    duty: string;
    status: string;
    avatarColor?: string;
  }) {
    setSaving(true);

    try {
      if (editingEmployee) {
        const isPending = editingEmployee.status === "pending";

        const response = await fetch("/api/staff", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: isPending ? undefined : editingEmployee.id,
            email: editingEmployee.email,
            name: data.name,
            phone: data.phone,
            role: data.role,
            duty: data.duty,
            isPending,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          alert(result.error || "Failed to update");
          setSaving(false);
          return;
        }

        setEmployees((prev) =>
          prev.map((e) =>
            e.id === editingEmployee.id ? { ...editingEmployee, ...data } : e
          )
        );
        setSaving(false);
        setEditingEmployee(null);
        setIsModalOpen(false);
        alert(result.message);
      } else {
        // Send invite
        const response = await fetch("/api/staff/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            duty: data.duty,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          alert(result.error || "Failed to send invite");
          setSaving(false);
          return;
        }

        // Refresh the list to show the new pending invite
        const fetchResponse = await fetch("/api/staff");
        const fetchData = await fetchResponse.json();
        if (fetchData.success && fetchData.data) {
          setEmployees(fetchData.data);
        }

        setSaving(false);
        setIsModalOpen(false);
        alert(
          "Invite sent successfully! User will receive an email to set their password."
        );
      }
    } catch (error) {
      console.error("Error submitting employee:", error);
      alert("An unexpected error occurred");
      setSaving(false);
    }
  }

  const duties = [...new Set(employees.map((e) => e.duty))];

  const filtered = employees.filter((e) => {
    const searchMatch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const dutyMatch = duty ? e.duty === duty : true;

    return searchMatch && dutyMatch;
  });

  return (
    <div className="p-2 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <SearchBar onSearch={handleSearch} placeholder="Search..." />
          <Filters
            filters={[
              {
                options: duties.map((d) => ({ label: d, value: d })),
                selected: duty,
                placeholder: "Filter",
                onChange: setDuty,
              },
            ]}
          />
        </div>
        <AddButton
          label="Add Employee"
          onClick={() => {
            setEditingEmployee(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      <Card>
        <div className="pb-4 text-sm text-gray-500 font-medium">
          Items found: {filtered.length}
        </div>

        <StaffTable
          employees={filtered}
          loading={loading}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
      >
        <EmployeeForm
          staff={
            editingEmployee
              ? {
                  id: editingEmployee.id,
                  name: editingEmployee.name,
                  email: editingEmployee.email,
                  role: editingEmployee.role,
                  function: editingEmployee.duty,
                  phone: editingEmployee.phone,
                }
              : null
          }
          onSubmit={(data) => {
            void handleSubmitEmployee({
              name: data.name,
              email: data.email,
              phone: data.phone || "",
              role: data.role,
              duty: data.function,
              status: editingEmployee?.status || "active",
              avatarColor: editingEmployee?.avatarColor,
            });
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
          saving={saving}
        />
      </Modal>
    </div>
  );
}
