"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { MovementWithRelations, MovementFormData, MovementType } from "@/types";

interface StockMovementFormProps {
  movement?: MovementWithRelations | null;
  onSubmit: (movement: MovementFormData) => void;
  onCancel: () => void;
}

const movementTypes: MovementType[] = [
  MovementType.ARRIVAL,
  MovementType.PICKUP,
  MovementType.DELIVERY,
];

export default function StockMovementForm({
  movement,
  onSubmit,
  onCancel,
}: StockMovementFormProps) {
  const formatDate = (d?: string | Date | null) => {
    if (!d) return "";
    try {
      if (typeof d === "string") return d.split("T")[0];
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };
  const [type, setType] = useState<MovementType>(
    (movement?.type as MovementType) ?? movementTypes[0]
  );
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (movement?.type) setType(movement.type);
    if (movement?.productId && movement?.productName) {
      setSelectedProduct({
        id: movement.productId,
        name: movement.productName,
      });
      setSearch(movement.productName);
    } else if (movement?.product?.id && movement?.product?.name) {
      setSelectedProduct({
        id: movement.product.id,
        name: movement.product.name,
      });
      setSearch(movement.product.name);
    }
  }, [movement]);

  // 🔹 Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Please select a valid product");

    const form = e.target as typeof e.target & {
      quantity: { value: string };
      notes: { value: string };
      arrivalDate?: { value: string };
      order?: { value: string };
      bol?: { value: string };
      pickupBy?: { value: string };
      pickupDate?: { value: string };
      deliveryCompany?: { value: string };
      deliveryDate?: { value: string };
      sku?: { value: string };
    };

    onSubmit({
      productId: selectedProduct.id,
      type,
      quantity: parseInt(form.quantity.value),
      notes: form.notes.value,
      arrivalDate: form.arrivalDate?.value,
      order: form.order?.value,
      bol: form.bol?.value,
      pickupBy: form.pickupBy?.value,
      pickupDate: form.pickupDate?.value,
      deliveryCompany: form.deliveryCompany?.value,
      deliveryDate: form.deliveryDate?.value,
      sku: form.sku?.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div ref={wrapperRef}>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product
        </label>
        {isLoadingProducts ? (
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500">
            Loading products...
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Type product name..."
              value={search}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedProduct(null);
                setShowDropdown(true);
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
              required
            />

            <AnimatePresence>
              {search && showDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 border rounded mt-1 max-h-40 overflow-auto bg-white w-full"
                >
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((p) => (
                      <li
                        key={p.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(p);
                          setSearch(p.name);
                          setShowDropdown(false);
                        }}
                      >
                        {p.name}
                      </li>
                    ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Type
        </label>
        <select
          name="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value as MovementType)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
        >
          {movementTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Quantity
        </label>
        <input
          type="number"
          name="quantity"
          required
          defaultValue={movement?.quantity || 0}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
        />
      </div>

      {type === MovementType.ARRIVAL && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Arrival Date
            </label>
            <input
              type="date"
              name="arrivalDate"
              required
              defaultValue={formatDate(movement?.arrivalDate)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Order
            </label>
            <input
              type="text"
              name="order"
              defaultValue={movement?.order || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              BOL
            </label>
            <input
              type="text"
              name="bol"
              defaultValue={movement?.bol || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
        </>
      )}

      {type === MovementType.DELIVERY && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Delivery Company
            </label>
            <input
              type="text"
              name="deliveryCompany"
              required
              defaultValue={movement?.deliveryCompany || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Delivery Date
            </label>
            <input
              type="date"
              name="deliveryDate"
              required
              defaultValue={formatDate(movement?.deliveryDate)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Order
            </label>
            <input
              type="text"
              name="order"
              required
              defaultValue={movement?.order || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
        </>
      )}

      {type === MovementType.PICKUP && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Pick Up By
            </label>
            <input
              type="text"
              name="pickupBy"
              required
              defaultValue={movement?.pickupBy || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Pick Up Date
            </label>
            <input
              type="date"
              name="pickupDate"
              required
              defaultValue={formatDate(movement?.pickupDate)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Order
            </label>
            <input
              type="text"
              name="order"
              required
              defaultValue={movement?.order || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
            />
          </div>
        </>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Notes
        </label>
        <input
          type="text"
          name="notes"
          placeholder="Optional notes"
          defaultValue={movement?.notes || ""}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-medium text-white bg-[#DFCDC1] hover:bg-[#C8A893] transition"
        >
          {movement ? "Save Changes" : "Add Movement"}
        </button>
      </div>
    </form>
  );
}
