"use client";

import React, { useState } from "react";

export interface StaffFormData {
  id?: string;
  name: string;
  email: string;
  role: string;
  function: string;
  phone: string | null;
}

interface StaffFormProps {
  staff: StaffFormData | null;
  onSubmit: (data: StaffFormData) => void;
  onCancel: () => void;
  saving?: boolean;
  error?: string | null;
}

const ROLE_OPTIONS = [
  { label: "Admin", value: "Admin" },
  { label: "Staff", value: "Staff" },
];

const FUNCTION_OPTIONS = [
  { label: "Sales Person", value: "Sales Person" },
  { label: "Warehouse Worker", value: "Warehouse Worker" },
  { label: "Manager", value: "Manager" },
  { label: "Owner", value: "Owner" },
];

const getInitialFormData = (staff: StaffFormData | null): StaffFormData => {
  if (staff) {
    return {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      function: staff.function,
      phone: staff.phone || "",
    } as StaffFormData;
  }
  return {
    name: "",
    email: "",
    role: ROLE_OPTIONS[1].value,
    function: FUNCTION_OPTIONS[0].value,
    phone: null,
  };
};

export default function StaffForm({
  staff,
  onSubmit,
  onCancel,
  saving = false,
  error = null,
}: StaffFormProps) {
  const [formData, setFormData] = useState<StaffFormData>(
    getInitialFormData(staff)
  );

  const isEditing = !!staff;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSubmit: StaffFormData = {
      ...formData,
      phone:
        formData.phone && formData.phone.trim() !== ""
          ? formData.phone.trim()
          : null,
      id: isEditing ? formData.id : undefined,
    } as StaffFormData;

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="text-red-600 text-sm border border-red-200 p-3 rounded-xl bg-red-50">
          API Error: {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Tel
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="Enter phone"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
          disabled={isEditing}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition disabled:bg-gray-200 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Duty
        </label>
        <select
          name="function"
          required
          value={formData.function}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition appearance-none"
        >
          {FUNCTION_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Role (Permission)
        </label>
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition appearance-none"
        >
          {ROLE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-medium text-white bg-[#DFCDC1] hover:bg-[#C8A893] transition disabled:bg-gray-400"
        >
          {saving ? "Saving..." : staff ? "Save Changes" : "Add new employee"}
        </button>
      </div>
    </form>
  );
}
