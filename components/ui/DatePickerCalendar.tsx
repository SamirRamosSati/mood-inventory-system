"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerCalendarProps {
  value: string | null | undefined;
  onChange: (date: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function DatePickerCalendar({
  value,
  onChange,
  placeholder = "Select a date",
  required = false,
  disabled = false,
}: DatePickerCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarValue, setCalendarValue] = useState<Date | null>(null);
  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  useEffect(() => {
    startTransition(() => {
      const date = value ? new Date(value + "T00:00:00") : null;
      setCalendarValue(date);
    });
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        calendarRef.current &&
        !calendarRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const calendarHeight = 350;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = rect.bottom + window.scrollY + 8;

      if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
        top = rect.top + window.scrollY - calendarHeight - 8;
      }

      setPortalPosition({
        top,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  const handleCalendarChange = (selectedDate: Date | Date[] | null) => {
    let date: Date | null = null;

    if (Array.isArray(selectedDate)) {
      date = selectedDate[0] || null;
    } else if (selectedDate instanceof Date) {
      date = selectedDate;
    }

    if (date instanceof Date) {
      setCalendarValue(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      onChange(formatted);
      setIsOpen(false);
    }
  };

  const displayValue = (() => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  })();

  return (
    <div ref={wrapperRef} className="w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent transition flex items-center justify-between disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon
          size={18}
          className={`text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <input
        type="hidden"
        value={value || ""}
        required={required}
        onChange={() => {}}
      />

      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={calendarRef}
            className="fixed bg-white border border-gray-200 rounded-2xl shadow-2xl z-9999 p-3"
            style={{
              top: `${portalPosition.top}px`,
              left: `${portalPosition.left}px`,
              width: "320px",
            }}
          >
            <Calendar
              onChange={
                handleCalendarChange as unknown as (
                  value: unknown,
                  event: unknown
                ) => void
              }
              value={calendarValue}
              className="react-calendar-custom"
            />
          </div>,
          document.body
        )}

      <style jsx global>{`
        .react-calendar-custom {
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          border: none;
          background: transparent;
          font-size: 0.875rem;
        }

        .react-calendar-custom button {
          font-size: 0.75rem;
          padding: 0.35rem;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          margin: 0.1rem;
        }

        .react-calendar-custom button:hover:not(:disabled) {
          background-color: #f3f4f6;
        }

        .react-calendar-custom button.react-calendar__tile--active {
          background-color: #dfcdc1;
          color: white;
          font-weight: bold;
        }

        .react-calendar-custom button.react-calendar__tile--active:hover {
          background-color: #c8a893;
        }

        .react-calendar-custom button.react-calendar__tile--now {
          background-color: #fef3c7;
          font-weight: bold;
        }

        .react-calendar-custom .react-calendar__tile--disabled {
          background-color: transparent;
          color: #d1d5db;
          cursor: not-allowed;
        }

        .react-calendar-custom .react-calendar__navigation {
          margin-bottom: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.25rem;
        }

        .react-calendar-custom .react-calendar__navigation button {
          padding: 0.25rem 0.5rem;
          font-size: 0.7rem;
          min-width: auto;
          margin: 0;
        }

        .react-calendar-custom .react-calendar__month-view__weekdays {
          margin-bottom: 0.35rem;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.2rem;
        }

        .react-calendar-custom .react-calendar__month-view__weekdays__weekday {
          font-weight: 600;
          color: #6b7280;
          text-decoration: none;
          padding: 0.3rem 0;
          font-size: 0.65rem;
          text-align: center;
        }

        .react-calendar-custom .react-calendar__month-view__days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.2rem;
        }

        .react-calendar-custom .react-calendar__month-view__days__day {
          height: auto;
          padding: 0.35rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .react-calendar-custom .react-calendar__tile {
          max-width: 100%;
          padding: 0;
          color: #111827;
          width: 100%;
        }

        .react-calendar-custom .react-calendar__tile:disabled {
          background-color: transparent;
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
