"use client";

import { useState } from "react";
import { Delivery, CreateDeliveryData, DeliveryItem } from "@/types";
import DeliveryItemsInput from "./DeliveryItemsInput";
import DatePickerCalendar from "@/components/ui/DatePickerCalendar";

interface DeliveryFormProps {
  delivery?: Delivery | null;
  onSubmit: (data: CreateDeliveryData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}

export default function DeliveryForm({
  delivery,
  onSubmit,
  onCancel,
  saving,
  error,
}: DeliveryFormProps) {
  const [formError, setFormError] = useState<string | null>(error);
  const [items, setItems] = useState<DeliveryItem[]>(delivery?.items || []);
  const [isDateTBA, setIsDateTBA] = useState(
    delivery ? !delivery.scheduled_date : false
  );
  const [scheduledDate, setScheduledDate] = useState<string | null>(
    delivery?.scheduled_date || null
  );
  const [order, setOrder] = useState<string>(delivery?.order || "");
  const [notes, setNotes] = useState<string>(delivery?.notes || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (items.length === 0) {
      setFormError("Please add at least one product");
      return;
    }

    const form = e.target as HTMLFormElement;

    const payload: CreateDeliveryData = {
      customer_name: (
        form.elements.namedItem("customer_name") as HTMLInputElement
      ).value.trim(),
      customer_phone: (
        form.elements.namedItem("customer_phone") as HTMLInputElement
      ).value.trim(),
      delivery_address: (
        form.elements.namedItem("delivery_address") as HTMLInputElement
      ).value.trim(),
      scheduled_date: isDateTBA ? null : scheduledDate,
      order: order.trim() || undefined,
      notes: notes.trim() || undefined,
      items,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Customer Name
        </label>
        <input
          type="text"
          name="customer_name"
          placeholder="Enter customer name"
          defaultValue={delivery?.customer_name || ""}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Customer Phone
        </label>
        <input
          type="tel"
          name="customer_phone"
          placeholder="Enter phone number"
          defaultValue={delivery?.customer_phone || ""}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Delivery Address
        </label>
        <input
          type="text"
          name="delivery_address"
          placeholder="Enter delivery address"
          defaultValue={delivery?.delivery_address || ""}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isDateTBA"
            checked={isDateTBA}
            onChange={(e) => setIsDateTBA(e.target.checked)}
            className="w-5 h-5 cursor-pointer rounded border-gray-300"
          />
          <label
            htmlFor="isDateTBA"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Date pending
          </label>
        </div>

        {!isDateTBA && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Scheduled Date
            </label>
            <DatePickerCalendar
              value={scheduledDate}
              onChange={setScheduledDate}
              placeholder="Select delivery date"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Order Number (Optional)
        </label>
        <input
          type="text"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="Enter order number"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter additional notes"
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition"
        />
      </div>

      {/* Items Input */}
      <DeliveryItemsInput items={items} onChange={setItems} />

      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {formError}
        </div>
      )}

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
          {saving ? "Saving..." : delivery ? "Save Changes" : "Add Delivery"}
        </button>
      </div>

      {(error || formError) && (
        <p className="mt-3 text-sm text-red-600">{error || formError}</p>
      )}
    </form>
  );
}
