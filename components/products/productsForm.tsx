// src/components/products/ProductForm.tsx

"use client";

import { Product } from "@/types";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFormData {
  name: string;
  sku: string;
  code?: string | null;
  category: string | null;
  brand: string | null;
  location: string | null;
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
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState<string>(product?.brand || "");
  const [categorySearch, setCategorySearch] = useState<string>(
    product?.category || ""
  );
  const [locationSearch, setLocationSearch] = useState<string>(
    (product as Product & { location?: string })?.location || ""
  );
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const brandWrapperRef = useRef<HTMLDivElement>(null);
  const categoryWrapperRef = useRef<HTMLDivElement>(null);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        brandWrapperRef.current &&
        !brandWrapperRef.current.contains(target)
      ) {
        setShowBrandDropdown(false);
      }

      if (
        categoryWrapperRef.current &&
        !categoryWrapperRef.current.contains(target)
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        locationWrapperRef.current &&
        !locationWrapperRef.current.contains(target)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowBrandDropdown, setShowCategoryDropdown, setShowLocationDropdown]);

  useEffect(() => {
    async function loadBrandsAndCategories() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && data.data) {
          const uniqueBrands = Array.from(
            new Set(
              data.data
                .map((p: Product) => p.brand)
                .filter((b: string | null) => b && b.trim())
            )
          ) as string[];

          const uniqueCategories = Array.from(
            new Set(
              data.data
                .map((p: Product) => p.category)
                .filter((c: string | null) => c && c.trim())
            )
          ) as string[];

          const uniqueLocations = Array.from(
            new Set(
              data.data
                .map((p: Product & { location?: string }) => p.location)
                .filter((l: string | undefined | null) => l && l.trim())
            )
          ) as string[];

          setBrands(uniqueBrands);
          setCategories(uniqueCategories);
          setLocations(uniqueLocations);
        }
      } catch (err) {
        console.error("Failed to load brands/categories/locations", err);
      }
    }
    loadBrandsAndCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const form = e.target as HTMLFormElement;

    const payload: ProductFormData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      sku: (form.elements.namedItem("sku") as HTMLInputElement).value.trim(),
      code:
        (form.elements.namedItem("code") as HTMLInputElement)?.value.trim() ||
        null,
      category: categorySearch.trim() || null,
      brand: brandSearch.trim() || null,
      location: locationSearch.trim() || null,
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
          placeholder="Enter product name"
          defaultValue={product?.name || ""}
          required
          className="w-full px-4 py-3 bg-gray-50 border  border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          SKU
        </label>
        <input
          type="text"
          name="sku"
          placeholder="Enter product SKU"
          defaultValue={product?.sku || ""}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Code
        </label>
        <input
          type="text"
          name="code"
          placeholder="Enter product code "
          defaultValue={(product as Product)?.code || ""}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div ref={categoryWrapperRef}>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Category
        </label>
        <div className="relative">
          <input
            type="text"
            name="category"
            value={categorySearch}
            onFocus={() => setShowCategoryDropdown(true)}
            onChange={(e) => {
              setCategorySearch(e.target.value);
              setShowCategoryDropdown(true);
            }}
            placeholder="Type or select category..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
          />

          <AnimatePresence>
            {categorySearch &&
              showCategoryDropdown &&
              categories.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 border border-gray-200 rounded-lg mt-1 max-h-40 overflow-auto bg-white w-full shadow-lg"
                >
                  {categories
                    .filter((c) =>
                      c.toLowerCase().includes(categorySearch.toLowerCase())
                    )
                    .map((c, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        onClick={() => {
                          setCategorySearch(c);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {c}
                      </li>
                    ))}
                </motion.ul>
              )}
          </AnimatePresence>
        </div>
      </div>

      <div ref={locationWrapperRef}>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Location
        </label>
        <div className="relative">
          <input
            type="text"
            name="location"
            value={locationSearch}
            onFocus={() => setShowLocationDropdown(true)}
            onChange={(e) => {
              setLocationSearch(e.target.value);
              setShowLocationDropdown(true);
            }}
            placeholder="Type or select location..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
          />

          <AnimatePresence>
            {locationSearch &&
              showLocationDropdown &&
              locations.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 border border-gray-200 rounded-lg mt-1 max-h-40 overflow-auto bg-white w-full shadow-lg"
                >
                  {locations
                    .filter((l) =>
                      l.toLowerCase().includes(locationSearch.toLowerCase())
                    )
                    .map((l, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        onClick={() => {
                          setLocationSearch(l);
                          setShowLocationDropdown(false);
                        }}
                      >
                        {l}
                      </li>
                    ))}
                </motion.ul>
              )}
          </AnimatePresence>
        </div>
      </div>

      <div ref={brandWrapperRef}>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Brand
        </label>
        <div className="relative">
          <input
            type="text"
            name="brand"
            value={brandSearch}
            onFocus={() => setShowBrandDropdown(true)}
            onChange={(e) => {
              setBrandSearch(e.target.value);
              setShowBrandDropdown(true);
            }}
            placeholder="Type or select brand..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
          />

          <AnimatePresence>
            {brandSearch && showBrandDropdown && brands.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 border border-gray-200 rounded-lg mt-1 max-h-40 overflow-auto bg-white w-full shadow-lg"
              >
                {brands
                  .filter((b) =>
                    b.toLowerCase().includes(brandSearch.toLowerCase())
                  )
                  .map((b, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      onClick={() => {
                        setBrandSearch(b);
                        setShowBrandDropdown(false);
                      }}
                    >
                      {b}
                    </li>
                  ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
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
