// pages/admin/products.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/searchBar";
import AddButton from "@/components/AddButton";
import Table from "@/components/Table";
import Filters from "@/components/Filters";
import Modal from "@/components/modal";
import RowActions from "@/components/admin/stockMovements/RowActions";

export default function ProductsPage() {
  // UI / filter states
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  // modal + editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // data / loading / error
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          if (json.success && Array.isArray(json.data)) {
            setProducts(json.data);
          } else {
            setProducts([]);
            setError("Failed to load products");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch products:", err);
          setError("Failed to fetch products");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // handlers for UI
  function handleSearch(value: string) {
    setSearch(value);
  }

  function handleOpenCreate() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  function handleEditProduct(item: any) {
    setEditingProduct(item);
    setIsModalOpen(true);
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const prev = products;
      setProducts(products.filter((p) => p.id !== id));

      const res = await fetch(`/api/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        setProducts(prev);
        const txt = await res.text();
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. See console for details.");
    }
  }

  async function handleSubmitProduct(form: HTMLFormElement) {
    setSaving(true);
    setError(null);

    const payload = {
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

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
            ...payload,
          }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error || `HTTP ${res.status}`);
        }

        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Update failed");

        // replace in local state
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? json.data : p))
        );
      } else {
        // CREATE
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error || `HTTP ${res.status}`);
        }

        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Create failed");

        // append new product
        setProducts((prev) => [...prev, json.data]);
      }

      // close modal and reset
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error("Save product error:", err);
      setError(err?.message || "Failed to save product");
      alert(`Error: ${err?.message || "Failed to save product"}`);
    } finally {
      setSaving(false);
    }
  }

  // derived filter lists + filtered results
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filtered = products.filter((p) => {
    const searchMatch = p.name?.toLowerCase().includes(search.toLowerCase());
    const brandMatch = brand ? p.brand === brand : true;
    const categoryMatch = category ? p.category === category : true;
    return searchMatch && brandMatch && categoryMatch;
  });

  const columns = [
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock" },
    { key: "brand", label: "Brand" },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <RowActions
          onEdit={() => handleEditProduct(item)}
          onDelete={() => handleDeleteProduct(item.id)}
        />
      ),
    },
  ];

  return (
    <div className="p-2">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-10">
            <SearchBar onSearch={handleSearch} />
            <Filters
              filters={[
                {
                  options: brands.map((b) => ({ label: b, value: b })),
                  selected: brand,
                  placeholder: "All brands",
                  onChange: setBrand,
                },
                {
                  options: categories.map((c) => ({ label: c, value: c })),
                  selected: category,
                  placeholder: "All categories",
                  onChange: setCategory,
                },
              ]}
            />
          </div>

          <AddButton
            label="Add Product"
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No products found.</p>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            handleSubmitProduct(form);
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={editingProduct?.name || ""}
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
              defaultValue={editingProduct?.sku || ""}
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
              defaultValue={editingProduct?.category || ""}
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
              defaultValue={editingProduct?.brand || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
              className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-medium text-white bg-[#DFCDC1] hover:bg-[#C8A893] transition disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingProduct
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Modal>
    </div>
  );
}
