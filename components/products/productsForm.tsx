// src/components/products/ProductForm.tsx

"use client";

import { Product } from "@/types";
import { useState } from "react";

interface ProductFormData {
  name: string;
  sku: string;
  category: string | null;
  brand: string | null;
}

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  saving,
  error,
}: ProductFormProps) {
  const [formError, setFormError] = useState<string | null>(error);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const form = e.target as HTMLFormElement;

    const payload: ProductFormData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      sku: (form.elements.namedItem("sku") as HTMLInputElement).value.trim(),
      category:
        (
          form.elements.namedItem("category") as HTMLInputElement
        ).value.trim() || null,
      brand:
        (form.elements.namedItem("brand") as HTMLInputElement).value.trim() ||
        null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          defaultValue={product?.name || ""}
          required
          className="w-full px-4 py-3 bg-gray-50 border placeholder:text-sm border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          SKU
        </label>
        <input
          type="text"
          name="sku"
          defaultValue={product?.sku || ""}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Category
        </label>
        <input
          type="text"
          name="category"
          defaultValue={product?.category || ""}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Brand
        </label>
        <input
          type="text"
          name="brand"
          defaultValue={product?.brand || ""}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div className="flex gap-3 justify-end ml-auto">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-medium text-white bg-[#DFCDC1] hover:bg-[#C8A893] transition disabled:opacity-60"
        >
          {saving ? "Saving..." : product ? "Save Changes" : "Add Product"}
        </button>
      </div>

      {(error || formError) && (
        <p className="mt-3 text-sm text-red-600">{error || formError}</p>
      )}
    </form>
  );
}
