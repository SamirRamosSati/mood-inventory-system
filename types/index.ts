export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export enum MovementType {
  ARRIVAL = "ARRIVAL",
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_color?: string;
  created_at: string;
}

export type UserWithoutSensitive = Omit<User, "id">;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UserSession {
  user: UserWithoutSensitive;
  isAdmin: boolean;
}

export interface Product extends Record<string, unknown> {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  sku: string;
  description?: string;
  category?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  category?: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category?: string | null;
  brand?: string | null;
}

// Movement type
export interface Movement extends Record<string, unknown> {
  id: string;
  productId: string;
  userId: string;
  type: MovementType;
  quantity: number;
  notes?: string | null;
  customerName?: string | null;
  deliveryAddress?: string | null;
  deliveryDate?: string | null;
  arrivalDate?: string | null;
  order?: string | null;
  bol?: string | null;
  pickupBy?: string | null;
  pickupDate?: string | null;
  deliveryCompany?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovementData {
  productId: string;
  type: MovementType;
  quantity: number;
  notes?: string;
  customerName?: string;
  deliveryAddress?: string;
  deliveryDate?: Date;
}

export interface MovementFormData {
  productId: string;
  type: MovementType;
  quantity: number;
  notes?: string;
  arrivalDate?: string;
  order?: string;
  bol?: string;
  pickupBy?: string;
  pickupDate?: string;
  deliveryCompany?: string;
  deliveryDate?: string;
  sku?: string;
  customerName?: string;
}

export interface MovementWithRelations extends Movement {
  product?: Product;
  user?: User & Record<string, unknown>;
  productName?: string;
  userName?: string;
}

export interface RecentMovement {
  id: string | number;
  type: MovementType;
  product: string;
  quantity: number;
  time: string;
  vendor?: string;
  customer?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LowStockProduct {
  id: string | number;
  name: string;
  sku: string;
  category: string | null;
  stock: number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface AppError extends Error {
  statusCode?: number;
  message: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category?: string | null;
  brand?: string | null;
}

export interface MovementFormData {
  productId: string;
  type: MovementType;
  quantity: number;
  notes?: string;
  arrivalDate?: string;
  order?: string;
  bol?: string;
  pickupBy?: string;
  pickupDate?: string;
  deliveryCompany?: string;
  deliveryDate?: string;
  sku?: string;
  customerName?: string;
}
