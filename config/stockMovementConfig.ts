// src/config/stockMovementConfig.ts

import { FilterOption, TableColumn } from "@/types";
import { MovementWithRelations } from "@/types";

type Col = TableColumn<MovementWithRelations>;

export const MOVEMENT_COLUMNS_MAP: Record<string, Col[]> = {
  ARRIVAL: [
    { key: "order", label: "Order" },
    { key: "bol", label: "BOL" },
    { key: "productName", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "userName", label: "User" },
    { key: "arrivalDate", label: "Arrival Date" },
    { key: "notes", label: "Notes" },
    { key: "actions", label: "" },
  ],
  PICKUP: [
    { key: "order", label: "Order" },
    { key: "productName", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "userName", label: "User" },
    { key: "pickupBy", label: "Pick Up By" },
    { key: "pickupDate", label: "Pick Up Date" },
    { key: "notes", label: "Notes" },
    { key: "actions", label: "" },
  ],
  DELIVERY: [
    { key: "order", label: "Order" },
    { key: "productName", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "userName", label: "User" },
    { key: "deliveryCompany", label: "Delivery Company" },
    { key: "deliveryDate", label: "Delivery Date" },
    { key: "notes", label: "Notes" },
    { key: "actions", label: "" },
  ],
};

export const MONTH_FILTER_OPTIONS: FilterOption[] = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];
