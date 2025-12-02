"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/searchBar";
import AddButton from "@/components/AddButton";
import Table from "@/components/Table";
import Filters from "@/components/Filters";
import Modal from "@/components/modal";
import RowActions from "@/components/stockMovements/RowActions";
import ProductForm from "@/components/products/productsForm";
import PaginationControls from "@/components/paginationControl";
import { Product, ApiResponse } from "@/types";

interface ProductFormData {
  name: string;
  sku: string;
  category: string | null;
  brand: string | null;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ApiResponse<Product[]> = await res.json();
        if (!cancelled) {
          if (json.data && Array.isArray(json.data)) {
            setProducts(json.data);
          } else {
            setProducts([]);
            setError(json.error || "Failed to load products");
          }
        }
      } catch (err: unknown) {
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

  function handleSearch(value: string) {
    setSearch(value);
  }

  function handleEditProduct(item: Product) {
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

  async function handleSubmitProduct(payload: ProductFormData) {
    setSaving(true);
    setError(null);

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

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? json.data : p))
        );
      } else {
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

        setProducts((prev) => [...prev, json.data]);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save product";
      console.error("Save product error:", err);
      setError(message);
    } finally {
      setSaving(false);
    }
  }

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

  const PAGE_SIZE = 7;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock" },
    { key: "brand", label: "Brand" },
    {
      key: "actions",
      label: "Actions",
      render: (item: Product) => (
        <RowActions
          onEdit={() => handleEditProduct(item)}
          onDelete={() => handleDeleteProduct(item.id)}
        />
      ),
    },
  ];

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setError(null);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-2 space-y-4">
      {" "}
      {/* Adicionado space-y-4 para separar a linha de filtros do Card */}
      {/* 1. Elementos movidos para fora do Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {" "}
          {/* Ajustado gap para consistência visual */}
          <SearchBar onSearch={handleSearch} />
          <Filters
            filters={[
              {
                options: brands
                  .filter((b): b is string => b !== null && b !== undefined)
                  .map((b) => ({ label: b, value: b })),
                selected: brand,
                placeholder: "All brands",
                onChange: setBrand,
              },
              {
                options: categories
                  .filter((c): c is string => c !== null && c !== undefined)
                  .map((c) => ({ label: c, value: c })),
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
      {/* 2. Conteúdo do Card (Apenas Tabela e Controles) */}
      <Card>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No products found.</p>
        ) : (
          <>
            <Table columns={columns} data={paginated} />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmitProduct}
          onCancel={handleCancelModal}
          saving={saving}
          error={error}
        />
      </Modal>
    </div>
  );
}
