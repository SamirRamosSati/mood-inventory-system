"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Product } from "@/types";
import { X, Search } from "lucide-react";

interface DeliveryItem {
  product_id: string;
  product_name?: string;
  quantity: number;
  sku?: string;
}

interface DeliveryItemsInputProps {
  items: DeliveryItem[];
  onChange: (items: DeliveryItem[]) => void;
}

export default function DeliveryItemsInput({
  items,
  onChange,
}: DeliveryItemsInputProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?pageSize=1000");
        const json = await response.json();
        if (response.ok && json.data) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProductsList = useMemo(() => {
    if (searchTerm.trim() === "") {
      return [];
    }

    const filtered = products.filter((p) => {
      const alreadySelected = items.some((item) => item.product_id === p.id);
      if (alreadySelected) return false;

      if (p.stock <= 0) return false;

      const term = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      );
    });

    return filtered;
  }, [searchTerm, products, items]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddItem = (product: Product) => {
    const newItem: DeliveryItem = {
      product_id: product.id,
      product_name: product.name,
      quantity: selectedQuantity,
      sku: product.sku,
    };

    onChange([...items, newItem]);
    setSearchTerm("");
    setShowDropdown(false);
    setSelectedQuantity(1);
    inputRef.current?.focus();
  };

  const handleRemoveItem = (productId: string) => {
    onChange(items.filter((item) => item.product_id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    onChange(
      items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Products
      </label>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No items added yet</p>
        ) : (
          items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.product_name}
                </p>
                <p className="text-xs text-gray-500">{item.sku}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.product_id,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#DFCDC1]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(item.product_id)}
                className="p-1 hover:bg-red-100 rounded transition"
              >
                <X size={18} className="text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DFCDC1]"
          />
        </div>

        {showDropdown && filteredProductsList.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {filteredProductsList.map((product) => (
              <button
                type="button"
                key={product.id}
                onClick={() => handleAddItem(product)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition border-b border-gray-100 last:border-b-0"
              >
                <p className="text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">
                  SKU: {product.sku} • Stock: {product.stock}
                </p>
              </button>
            ))}
          </div>
        )}

        {showDropdown && searchTerm && filteredProductsList.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-sm text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
