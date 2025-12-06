"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/searchBar";
import AddButton from "@/components/AddButton";
import Filters from "@/components/Filters";
import Modal from "@/components/modal";
import Dialog from "@/components/Dialog";
import EmployeeForm from "@/components/staff/staffForm";
import StaffTable, { Employee } from "@/components/staff/staffTable";
import PaginationControls from "@/components/paginationControl";
import { useDialog } from "@/hooks/useDialog";
import { DialogVariant } from "@/hooks/useDialog";
import toast from "react-hot-toast";

export default function StaffPage() {
  const dialog = useDialog();
  const [search, setSearch] = useState("");
  const [duty, setDuty] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

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

  const duties = [...new Set(employees.map((e) => e.duty))];
  const filtered = employees.filter((e) => {
    const searchMatch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const dutyMatch = duty ? e.duty === duty : true;
    return searchMatch && dutyMatch;
  });
  const PAGE_SIZE = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(0);
  }, [search, duty]);

  function handleSearch(value: string) {
    setSearch(value);
  }

  function handleDutyChange(value: string) {
    setDuty(value);
  }

  function handleEditEmployee(emp: Employee) {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  }

  async function handleDeleteEmployee(id: string) {
    const employee = employees.find((e) => e.id === id);
    if (!employee) return;

    const isPending = employee.status === "pending";
    const title = isPending ? "Delete Pending Invite?" : "Delete Employee?";
    const description = isPending
      ? "This will remove the pending invitation. The user won't be able to set up their account."
      : "This will permanently delete the employee account and remove all access. This action cannot be undone.";

    const confirmed = await dialog.confirm(title, description, {
      primaryLabel: "Delete",
      secondaryLabel: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    dialog.setLoading(true);

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
        dialog.setLoading(false);
        dialog.alert("Error", result.error || "Failed to delete employee");
        return;
      }

      setEmployees((prev) => prev.filter((e) => e.id !== id));
      dialog.setLoading(false);
      dialog.close();
      toast.success(result.message || "Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      dialog.setLoading(false);
      dialog.alert("Error", "An unexpected error occurred");
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
          dialog.alert("Error", result.error || "Failed to update employee");
          setSaving(false);
          return;
        }

        // Fetch updated employees to get latest avatar colors and data
        const fetchResponse = await fetch("/api/staff");
        const fetchData = await fetchResponse.json();
        if (fetchData.success && fetchData.data) {
          setEmployees(fetchData.data);
        }
        setSaving(false);
        setEditingEmployee(null);
        setIsModalOpen(false);
        toast.success(result.message || "Employee updated successfully");
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
          dialog.alert("Error", result.error || "Failed to send invite");
          setSaving(false);
          return;
        }

        const fetchResponse = await fetch("/api/staff");
        const fetchData = await fetchResponse.json();
        if (fetchData.success && fetchData.data) {
          setEmployees(fetchData.data);
        }

        setSaving(false);
        setIsModalOpen(false);
        toast.success(
          "Invite sent successfully! User will receive an email to set their password."
        );
      }
    } catch (error) {
      console.error("Error submitting employee:", error);
      dialog.alert("Error", "An unexpected error occurred");
      setSaving(false);
    }
  }

  const paginated = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  return (
    <div className="p-2 md:p-6 space-y-6 flex flex-col h-full">
      <Card>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
              <SearchBar onSearch={handleSearch} placeholder="Search..." />
              <Filters
                filters={[
                  {
                    options: duties.map((d) => ({ label: d, value: d })),
                    selected: duty,
                    placeholder: "Filter",
                    onChange: handleDutyChange,
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

          <div className="pb-4 text-sm text-gray-500 font-medium">
            Items found: {filtered.length}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <StaffTable
              employees={paginated}
              loading={loading}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          </div>
        </div>
      </Card>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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
