"use client";

import Card from "@/components/Card";
import SearchBar from "@/components/admin/products/searchBar";
import { useState } from "react";
import AddButton from "@/components/AddButton";
import Table from "@/components/Table";
import Filters from "@/components/admin/products/Filters";
import Modal from "@/components/modal";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSearch(value: string) {
    setSearch(value);
    console.log("search:", value);
  }

  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Aeloria Sofa",
      sku: "SOF-001",
      category: "Sofa",
      stock: 4,
      brand: "WE STORY",
    },
    {
      id: "2",
      name: "Auria table",
      sku: "MES-019",
      category: "Table",
      stock: 2,
      brand: "WE STORY",
    },
    {
      id: "3",
      name: "Counter stool",
      sku: "CAD-224",
      category: "Stool",
      stock: 10,
      brand: "WE STORY",
    },
  ]);

  function handleAddProduct() {
    const newProduct = {
      id: (products.length + 1).toString(),
      name: "New Product",
      sku: "NEW-001",
      category: "Misc",
      stock: 0,
      brand: "New Brand",
    };
    setProducts([...products, newProduct]);
  }

  const brands = [...new Set(products.map((p) => p.brand))];
  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
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
  ];

  return (
    <div className="p-2">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-10 ">
            <SearchBar onSearch={handleSearch} />
            <Filters
              brands={brands}
              categories={categories}
              selectedBrand={brand}
              selectedCategory={category}
              onBrandChange={setBrand}
              onCategoryChange={setCategory}
            />
          </div>
          <AddButton onClick={() => setIsModalOpen(true)} />
        </div>
        {filtered.length === 0 ? (
          <p className="text-gray-400">No products found.</p>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as typeof e.target & {
              name: { value: string };
              sku: { value: string };
              category: { value: string };
              brand: { value: string };
            };

            const newProduct = {
              id: (products.length + 1).toString(),
              name: form.name.value,
              sku: form.sku.value,
              category: form.category.value,
              stock: 0,
              brand: form.brand.value,
            };

            setProducts([...products, newProduct]);
            setIsModalOpen(false);
          }}
          className="space-y-5"
        >
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              placeholder="Enter SKU code"
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
              placeholder="Enter category"
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
              placeholder="Enter brand"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-medium text-white bg-[#DFCDC1] hover:bg-[#C8A893] transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
