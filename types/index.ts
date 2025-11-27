import {
  User as PrismaUser,
  UserRole,
  Product,
  Movement,
  MovementType,
} from "@prisma/client";

export type User = PrismaUser;

export type UserWithoutSensitive = Omit<User, "authId">;

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

export type { Product };

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

export type { Movement, MovementType };

export interface CreateMovementData {
  productId: string;
  type: MovementType;
  quantity: number;
  notes?: string;
  customerName?: string;
  deliveryAddress?: string;
  deliveryDate?: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserSession {
  user: UserWithoutSensitive;
  isAdmin: boolean;
}
